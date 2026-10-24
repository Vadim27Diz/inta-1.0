// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first. READ-ONLY.
// Снимок раскладки страницы Components + межстраничных проверок для scripts/figma-layout-check.mjs.
//
// Порядок:
//   1. Прогнать ЭТОТ скрипт целиком (на странице Components) — даёт структурный снимок секций
//      плюс ringClipping/textContainers/nakedText ДЛЯ Components.
//   2. Прогнать RING_SCAN (см. ниже) ещё двумя ОТДЕЛЬНЫМИ вызовами use_figma — по одному на
//      страницы Playground и Foundations (переключение страницы — не чаще раза за вызов,
//      поэтому три страницы = три вызова, не один). Добавить их находки в тот же массив
//      ringClipping.
//   3. Сохранить JSON из ответа ЧЕРЕЗ `node scripts/figma-layout-save.mjs` (не руками — он
//      проставляет exporterHash, см. комментарий в начале figma-layout-check.mjs), затем
//      `node scripts/figma-layout-check.mjs`. Хеш из ответа use_figma и хеш сохранённого файла
//      (`node scripts/figma-layout-check.mjs --hash`) обязаны совпасть — иначе снимок устарел
//      относительно Figma и проверка валидирует прошлое (это не автоматизировать без живого
//      похода в Figma из CI — сверяется руками).
// Обновлять после КАЖДОЙ правки раскладки, любого компонента, их текстовых слоёв — ИЛИ правки
// этого файла (логика экспортёра тоже часть снимка; иначе ловушка 8 из SKILL.md).

const PAGE = "Components";
const page = figma.root.children.find((p) => p.name === PAGE);
if (!page) throw new Error(`нет страницы ${PAGE}`);
await figma.setCurrentPageAsync(page);
// скрытые слоты (visible=false, напр. Icon left/right у Button по умолчанию) иначе отдают пустой
// .children в findAll-обходах — см. «Ограничения Figma API» в SKILL.md figma-icon-slots.
figma.skipInvisibleInstanceChildren = false;

const A = (n) => { const b = n.absoluteBoundingBox; return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
const node = (n) => [n.name, n.type, ...A(n)];

const sections = page.children.filter((c) => c.type === "SECTION").map((s) => ({ s: node(s), c: s.children.map(node) }));
const loose = page.children.filter((c) => c.type !== "SECTION").map(node);
const topLevel = page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })
  .filter((n) => !(n.parent && n.parent.type === "COMPONENT_SET"));
const components = topLevel.map((n) => [n.name, n.type, n.parent.name, n.parent.type]);

const EXEMPT_ABSOLUTE_LAYERS = {};

// абсолютно позиционированные слои внутри наборов — разрешён только focus-ring
const absoluteLayers = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  for (const v of variants) {
    if (!("findAll" in v)) continue;
    const abs = v.findAll((n) => "layoutPositioning" in n && n.layoutPositioning === "ABSOLUTE" && n.name !== "focus-ring");
    for (const a of abs) {
      const exempt = EXEMPT_ABSOLUTE_LAYERS[`${root.name}|${a.name}`] || null;
      absoluteLayers.push([root.name, v.name, a.name, a.type, exempt]);
    }
  }
}

// ---- правило: focus-ring нигде не обрезан предком (clipsContent=true допустим, только если
// кольцо целиком внутри рамки предка) — эта же логика гоняется отдельно на Playground и
// Foundations (см. RING_SCAN ниже), находки суммируются в один массив ringClipping.
function isContained(inner, outer) {
  return inner.x >= outer.x - 0.5 && inner.y >= outer.y - 0.5 &&
    inner.x + inner.width <= outer.x + outer.width + 0.5 &&
    inner.y + inner.height <= outer.y + outer.height + 0.5;
}
const ringClipping = [];
for (const r of page.findAll((n) => n.name === "focus-ring")) {
  let n = r.parent;
  while (n && n.type !== "PAGE") {
    if ("clipsContent" in n && n.clipsContent === true && !isContained(r.absoluteBoundingBox, n.absoluteBoundingBox)) {
      ringClipping.push([PAGE, n.name, n.type, ...A(r), ...A(n)]);
    }
    n = n.parent;
  }
}

// ---- правило: контейнер текстового слоя — только Hug/Fill по ширине, не Fixed.
// Исключения — перечислены здесь явно, с причиной (а не молча пропущены).
function widthIsFixed(frame) {
  if (!("layoutMode" in frame) || frame.layoutMode === "NONE") return true;
  if (frame.layoutMode === "HORIZONTAL") return frame.primaryAxisSizingMode === "FIXED";
  return frame.counterAxisSizingMode === "FIXED"; // VERTICAL: ширина — counter axis
}
const EXEMPT_FIXED_WIDTH = {
  "Input|field": "поле ввода фиксированной ширины по дизайну — переполнение клипуется краем поля, не раздувает контейнер",
  "Textarea|field": "поле ввода фиксированной ширины по дизайну — переполнение клипуется краем поля, не раздувает контейнер",
  "Native Select|field": "поле ввода фиксированной ширины по дизайну — переполнение клипуется краем поля, не раздувает контейнер",
  "Input OTP / Slot|State=default": "слот кода фиксированного размера по дизайну (как поле ввода) — один символ, не раздувает контейнер",
  "Input OTP / Slot|Input OTP / Slot": "слот кода фиксированного размера по дизайну (как поле ввода) — один символ, не раздувает контейнер; тот же слот, что выше, но контейнер — инстанс внутри Input OTP, а не мастер-компонент",
  "Avatar Group|avatar-group-count": "счётчик фиксированного размера по дизайну (как кружок аватара, size-8/10/12) — не растягивается под текст «+N»",
  "Avatar|Avatar": "круг аватара фиксированного размера по дизайну (как поле ввода) — инициалы не растягивают круг; всплыло только через Avatar Group, т.к. сам набор Avatar сканируется по variants[0] (Content=photo, без текста)",
  "Card|text": "ширина Card (288, как w-72 в коде) фиксирована по дизайну — иначе компонент хугается к однострочной ширине короткого демо-текста и не демонстрирует перенос длинного заголовка/описания, который и был целью правки card.tsx (min-w-0/break-words)",
  "Card|content": "та же причина, что у Card|text — фиксированная ширина карточки нужна, чтобы Content демонстрировал перенос, а не хугался к одной строке",
  "Alert|content": "ширина Alert (384, как w-96 в историях) фиксирована по дизайну — иначе компонент хугается к однострочной ширине короткого дефолтного текста (Title и Description, оба внутри фрейма content) и не демонстрирует line-clamp-1 заголовка и перенос/break-words описания, который и проверяет story Content",
};

// ---- правило: текст, который меняется при использовании (подпись/значение/клавиша),
// подключён как TEXT property, а не «голый» текстовый слой. Исключения — явно, с причиной.
const EXEMPT_NAKED_TEXT = {
  "Label|required": "декоративный маркер обязательности — всегда литеральная «*», не пользовательский контент",
  "Input OTP|separator": "декоративный разделитель между группами слотов — всегда литеральное тире, не пользовательский контент",
  "Typography|bullet": "декоративный маркер пункта списка — всегда литеральная «•», не пользовательский контент",
};

// Composite-компоненты (Field…) вкладывают ГОТОВЫЕ инстансы Input/Label и т.п. — у вложенного
// текста владелец исключения не корневой набор ("Field"), а компонент, которому физически
// принадлежит слой ("Input"). Идём вверх до ближайшего INSTANCE и берём имя его mainComponent
// (сета, если тот — вариант). Если инстанса нет — владелец корневой компонент ("Input"), а НЕ
// вариант (`v.name` вида "Size=md, State=default" никогда не совпадёт с ключом исключения).
function ownerName(t, rootName) {
  let n = t.parent;
  while (n) {
    if (n.type === "INSTANCE") {
      const main = n.mainComponent;
      if (main) return main.parent && main.parent.type === "COMPONENT_SET" ? main.parent.name : main.name;
      break;
    }
    n = n.parent;
  }
  return rootName;
}

// Та же проблема, что решает ownerName(), но для «фиксированная ли ширина»: текст внутри
// вложенного инстанса (Button/Badge и т.п.) физически принадлежит ЕГО собственной геометрии,
// не геометрии корня, который его на себя нанизал. Без этой развязки Card (сам по себе
// Fixed-width по дизайну — см. EXEMPT_FIXED_WIDTH) заражал «Fixed» даже Label вложенной кнопки,
// хотя сама кнопка внутри остаётся Hug, как и в своей собственной секции.
function nearestInstance(t) {
  let n = t.parent;
  while (n) {
    if (n.type === "INSTANCE") return n;
    n = n.parent;
  }
  return null;
}

const textContainers = [];
const nakedText = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  const v = variants[0]; // структура одинакова у всех вариантов набора
  for (const t of v.findAll((n) => n.type === "TEXT")) {
    if (/^caption /.test(t.name)) continue; // подписи под глифами — не контент компонента
    const owner = ownerName(t, root.name);
    const hasProperty = !!(t.componentPropertyReferences && t.componentPropertyReferences.characters);
    const fixedScope = nearestInstance(t) || v;
    const rootFixed = widthIsFixed(fixedScope);
    const parent = t.parent;
    const parentFixed = parent && parent !== v && "layoutMode" in parent ? widthIsFixed(parent) : null;
    if (rootFixed || parentFixed) {
      const key = `${owner}|${parent ? parent.name : v.name}`;
      textContainers.push([root.name, t.name, parent ? parent.name : v.name, rootFixed, !!parentFixed, EXEMPT_FIXED_WIDTH[key] || null]);
    }
    if (!hasProperty) {
      const key = `${owner}|${t.name}`;
      nakedText.push([root.name, t.name, t.characters, EXEMPT_NAKED_TEXT[key] || null]);
    }
  }
}

// ---- правило: дочерние элементы списка (пункты Select, позже menu item/command item) — Fill
// по ширине, не Hug. Список = вертикальный auto layout с 2+ детьми-инстансами ОДНОГО компонента.
function sameComponent(a, b) {
  if (!a.mainComponent || !b.mainComponent) return false;
  const am = a.mainComponent.parent && a.mainComponent.parent.type === "COMPONENT_SET" ? a.mainComponent.parent : a.mainComponent;
  const bm = b.mainComponent.parent && b.mainComponent.parent.type === "COMPONENT_SET" ? b.mainComponent.parent : b.mainComponent;
  return am.id === bm.id;
}
const listItemSizing = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  for (const v of variants) {
    if (!("findAll" in v)) continue;
    const lists = v.findAll((n) => "layoutMode" in n && n.layoutMode === "VERTICAL" && n.children.length >= 2 &&
      n.children.every((ch) => ch.type === "INSTANCE") && n.children.every((ch) => sameComponent(ch, n.children[0])));
    for (const list of lists) {
      for (const item of list.children) {
        if (item.layoutSizingHorizontal !== "FILL") {
          listItemSizing.push([root.name, v.name, list.name, item.name, item.layoutSizingHorizontal]);
        }
      }
    }
  }
}

// ---- правило: повторяющиеся элементы внутри компонента (пункты списков, вкладки, ячейки) —
// экземпляры общего компонента, а не нарисованные слои. 2+ соседа с одинаковым именем, ни один
// не INSTANCE → повод вынести в переиспользуемый компонент (как Select/Item, Input OTP/Slot).
const repeatedLayers = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  for (const v of variants) {
    if (!("findAll" in v)) continue;
    const containers = [v, ...v.findAll((n) => "children" in n)];
    for (const c of containers) {
      const byName = {};
      for (const child of c.children || []) (byName[child.name] ||= []).push(child);
      for (const [name, group] of Object.entries(byName)) {
        if (group.length >= 2 && group.every((n) => n.type !== "INSTANCE")) {
          repeatedLayers.push([root.name, v.name, c.name, name, group.length]);
        }
      }
    }
  }
}

// ---- правило: каждый focus-ring — экземпляр Utility / Focus ring (не нарисованный слой);
// его скругление по каждому из 4 углов — переменная НА ШАГ ВЫШЕ той же стороны родителя
// (sm→md, md→lg, lg→xl; full→full — без переменной, full статичен и в коде, см. SKILL.md);
// прямой угол родителя (0) — прямой угол и у кольца на той же стороне (ряд Input OTP, Position
// first/middle/last). Кольцо больше родителя на 4px по каждой оси (инсет 2px со всех сторон).
const allVars = await figma.variables.getLocalVariablesAsync();
const idToName = {};
for (const v of allVars) idToName[v.id] = v.name;
function cornerVarName(n, corner) {
  const bv = n.boundVariables && n.boundVariables[corner];
  return bv && bv.id ? idToName[bv.id] || bv.id : null;
}
const SCALE_UP = { "radius/sm": "radius/md", "radius/md": "radius/lg", "radius/lg": "radius/xl" };
const CORNERS = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
const FULL_THRESHOLD = 999;
const focusRingShape = [];
const EXEMPT_FOCUS_RING_SHAPE = {};
function pushRingFinding(row) {
  const exempt = EXEMPT_FOCUS_RING_SHAPE[`${row[1]}|${row[2]}`] || null;
  focusRingShape.push([...row, exempt]);
}
for (const r of page.findAll((n) => n.name === "focus-ring")) {
  const directParent = r.parent;
  if (!directParent || !("topLeftRadius" in directParent)) continue; // геометрия родителя не читается — не наш случай
  // Slider: Root — плоский (не auto-layout) фрейм, фокусируется не он целиком, а Thumb (кольцо —
  // СОСЕД Thumb внутри Root, не его дитя, т.к. Root не auto-layout). Если непосредственный родитель
  // сам не скруглён и его размер не объясняет размер кольца (родитель+4) — настоящая форма, с
  // которой сверяем углы, это сосед (обычно Thumb), чей размер+4 совпадает с кольцом; офсет x/y
  // тогда считаем от соседа, а не от (0,0), т.к. кольцо и сосед — в одной системе координат
  // (оба — прямые дети Root), а не в системе координат самого соседа.
  let parent = directParent;
  let offsetBaseX = 0, offsetBaseY = 0;
  const parentExplainsSize = Math.abs(r.width - (directParent.width + 4)) <= 0.5 && Math.abs(r.height - (directParent.height + 4)) <= 0.5;
  if (!parentExplainsSize && "children" in directParent) {
    // сосед может быть ELLIPSE (бегунок Slider) — у неё нет topLeftRadius вовсе, она круглая по
    // природе; сверяем только по размеру (сосед+4 = кольцо), не требуем наличия радиуса.
    const sibling = directParent.children.find((s) => s !== r &&
      Math.abs(r.width - (s.width + 4)) <= 0.5 && Math.abs(r.height - (s.height + 4)) <= 0.5);
    if (sibling) { parent = sibling; offsetBaseX = sibling.x; offsetBaseY = sibling.y; }
  }
  const parentIsEllipse = parent.type === "ELLIPSE";
  const main = r.type === "INSTANCE" ? r.mainComponent : null;
  const mainSetName = main ? (main.parent && main.parent.type === "COMPONENT_SET" ? main.parent.name : main.name) : null;
  if (r.type !== "INSTANCE" || mainSetName !== "Utility / Focus ring") {
    pushRingFinding(["not-instance", parent.name, r.name, r.type, mainSetName]);
    continue;
  }
  // Kind — посадка (из имени варианта: "Kind=control|field|seam, Scale=…, Position=…"):
  //   control — отдельно стоящие контролы: зазор 2px, кольцо = родитель+4, скругление на шаг выше.
  //   field   — поля ввода: вплотную (0 зазора), кольцо = родитель 1:1, скругление РАВНО родителю
  //             (не на шаг выше — образец, см. описание компонента, Input на ui.shadcn.com).
  //   seam    — элементы встык (Input OTP и т.п.): вплотную, скругление на шаг выше, Position
  //             задаёт форму по стороне.
  const kindMatch = main.name.match(/^Kind=(\w+)/);
  const kind = kindMatch ? kindMatch[1] : null;
  if (!kind) { pushRingFinding(["no-kind", parent.name, r.name, main.name]); continue; }
  const isFlush = kind === "field" || kind === "seam";
  const stepRadius = kind !== "field"; // field: скругление равно родителю, не на шаг выше

  for (const corner of CORNERS) {
    // ELLIPSE (бегунок) не имеет per-corner радиуса — она круглая по природе, что эквивалентно
    // "full" на все 4 угла для целей этого сравнения.
    const parentVal = parentIsEllipse ? FULL_THRESHOLD : parent[corner];
    const parentVar = parentIsEllipse ? null : cornerVarName(parent, corner);
    const ringVal = r[corner];
    const ringVar = cornerVarName(r, corner);
    if (parentVal >= FULL_THRESHOLD) {
      if (ringVal < FULL_THRESHOLD) pushRingFinding(["corner-full", parent.name, r.name, corner, "full", ringVal]);
    } else if (parentVal === 0) {
      if (ringVal !== 0) pushRingFinding(["corner-flat", parent.name, r.name, corner, 0, ringVal]);
    } else if (!stepRadius) {
      // field: кольцо повторяет ТУ ЖЕ переменную, что и родитель — не следующую ступень
      if (ringVar !== parentVar) pushRingFinding(["corner-equal", parent.name, r.name, corner, parentVar, ringVar || ringVal]);
    } else if (parentVar && SCALE_UP[parentVar]) {
      if (ringVar !== SCALE_UP[parentVar]) pushRingFinding(["corner-step", parent.name, r.name, corner, SCALE_UP[parentVar], ringVar || ringVal]);
    } else {
      pushRingFinding(["corner-unclassified", parent.name, r.name, corner, parentVar || parentVal, ringVar || ringVal]);
    }
  }
  // геометрия — через собственные width/height/x/y узлов (frame-относительные), НЕ
  // absoluteBoundingBox: у кольца strokeAlign=OUTSIDE, поэтому absoluteBoundingBox шире
  // фрейма на 2×strokeWeight с каждой стороны — сравнение по нему даёт ложное расхождение.
  const wantDelta = isFlush ? 0 : 4;
  const wantOffset = isFlush ? 0 : -2;
  const okW = Math.abs(r.width - (parent.width + wantDelta)) <= 0.5;
  const okH = Math.abs(r.height - (parent.height + wantDelta)) <= 0.5;
  const okX = Math.abs((r.x - offsetBaseX) - wantOffset) <= 0.5;
  const okY = Math.abs((r.y - offsetBaseY) - wantOffset) <= 0.5;
  if (!okW || !okH || !okX || !okY) {
    pushRingFinding(["geometry", parent.name, r.name, { kind, w: r.width, h: r.height, dx: r.x - offsetBaseX, dy: r.y - offsetBaseY }, { wantW: parent.width + wantDelta, wantH: parent.height + wantDelta, wantDx: wantOffset, wantDy: wantOffset }]);
  }
  // толщина обводки: control/seam — 2px, field — 3px (образец ui.shadcn.com)
  const wantStroke = kind === "field" ? 3 : 2;
  if (r.strokeWeight !== wantStroke) {
    pushRingFinding(["stroke-weight", parent.name, r.name, kind, wantStroke, r.strokeWeight]);
  }
}

// ---- правило: слот-иконка (прямой путь из топ-уровневого компонента до инстанса Icon/Icon base/
// li:* через FRAME/GROUP, без пересечения границы ДРУГОГО топ-уровневого компонента) должен быть
// реально переключаем из панели Properties — двумя равноправными способами, оба реально
// встречаются в файле:
//   (а) сам кандидат — прямой инстанс Icon base с isExposedInstance=true (Button, Avatar, Item,
//       Empty, Alert — слот либо прямой ребёнок варианта, либо вложен через чистые FRAME-обёртки
//       типа media/header, но НЕ через другой INSTANCE — isExposedInstance работает только у
//       первичного инстанса, не у вложенного в вложенный, см. «Ограничения Figma API» в
//       SKILL.md figma-icon-slots);
//   (б) у кандидата componentPropertyReferences.mainComponent указывает на INSTANCE_SWAP-свойство,
//       объявленное где-то выше по дереву (Toggle T2 — свойство `Icon#518:0` на наборе, 33
//       preferredValues, привязано к li:*-инстансу напрямую, без обёртки через Icon base).
// Кандидат — инстанс, resolved-имя которого (через родительский COMPONENT_SET, если это вариант)
// это "Icon", "Icon base" или "li:*"; граница — инстанс ДРУГОГО топ-уровневого компонента (его
// собственные иконочные слоты уже проверяются отдельно, когда он сам top-level root — без этой
// границы Button внутри Card/Empty и т.п. давал бы ложные находки); инстанс без совпадения ни по
// одному из двух — кандидат, только если внутри него (рекурсивно) всё же нашёлся Icon/Icon
// base/li:* (как Checkbox/mark, Select/Item/indicator — отдельный локальный компонент-обёртка,
// не топ-уровневый и не сам Icon/Icon base).
const ICON_SLOT_EXCLUDE_ROOTS = new Set(["Icon", "Icon base", "Utility / Focus ring"]);
const iconScanRoots = topLevel.filter((n) => !ICON_SLOT_EXCLUDE_ROOTS.has(n.name) && !/^li:/.test(n.name));
const topLevelNames = new Set(iconScanRoots.map((n) => n.name));

function resolvedMainName(inst) {
  const m = inst.mainComponent;
  if (!m) return null;
  return m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name;
}
function isIconPrimitive(name) {
  return name === "Icon" || name === "Icon base" || /^li:/.test(name);
}
function containsIconPrimitive(node) {
  if (!("findAll" in node)) return false;
  return node.findAll((n) => n.type === "INSTANCE" && n.mainComponent && isIconPrimitive(resolvedMainName(n))).length > 0;
}

// минимум один вариант на каждое значение каждой VARIANT-оси (не только variants[0] — разные
// значения структурной оси иногда меняют структуру слота, см. «Пробелы» в handoff.md), жадный
// проход: первое появление нового значения любой оси добавляет вариант в выборку.
function structuralAxes(root) {
  if (root.type !== "COMPONENT_SET") return [];
  return Object.entries(root.componentPropertyDefinitions)
    .filter(([, d]) => d.type === "VARIANT")
    .map(([k]) => k);
}
function parseVariantProps(name) {
  const out = {};
  for (const part of name.split(", ")) {
    const eq = part.indexOf("=");
    if (eq !== -1) out[part.slice(0, eq)] = part.slice(eq + 1);
  }
  return out;
}
function representativeVariants(root) {
  if (root.type !== "COMPONENT_SET") return [root];
  const axes = structuralAxes(root);
  if (!axes.length) return [root.children[0]];
  const covered = {};
  for (const a of axes) covered[a] = new Set();
  const selected = [];
  for (const child of root.children) {
    const props = parseVariantProps(child.name);
    let addsNew = selected.length === 0;
    for (const a of axes) if (props[a] !== undefined && !covered[a].has(props[a])) addsNew = true;
    if (addsNew) {
      selected.push(child);
      for (const a of axes) if (props[a] !== undefined) covered[a].add(props[a]);
    }
  }
  return selected;
}

// подтверждено живым чтением 2026-10-22 — зашитые глифы по дизайну, решение человека, см.
// handoff.md «Решения человека по остальным компонентам с иконками».
const EXEMPT_ICON_SLOTS = {
  "Checkbox|mark": "чекмарк — зашитый глиф по дизайну; вложен в компонент mark, глубже одного уровня instance-в-instance isExposedInstance не работает",
  "Select|Icon": "шеврон триггера — зашитый глиф по дизайну, миграция Select-триггера решением человека не нужна",
  "Native Select|Icon": "шеврон — зашитый глиф по дизайну, тот же случай, что Select",
  "Select / Item|Icon": "чекмарк пункта — зашитый глиф по дизайну, та же причина, что Checkbox/mark",
  "Spinner|li:loader-circle": "глиф спиннера — зашитый по дизайну, смена на другую иконку не имеет смысла (как чекмарк Checkbox)",
};

const iconSlots = [];
function recordIconSlot(root, variant, inst, mainName) {
  const hasPropertyRef = !!(inst.componentPropertyReferences && inst.componentPropertyReferences.mainComponent);
  const exempt = EXEMPT_ICON_SLOTS[`${root.name}|${inst.name}`] || null;
  iconSlots.push([root.name, variant.name, inst.name, inst.isExposedInstance, mainName, hasPropertyRef, exempt]);
}
function findIconSlots(root, variant, node) {
  if (!("children" in node)) return;
  for (const child of node.children) {
    if (child.type === "INSTANCE") {
      const main = resolvedMainName(child);
      if (main && isIconPrimitive(main)) { recordIconSlot(root, variant, child, main); continue; }
      if (main && topLevelNames.has(main)) continue; // граница другого топ-уровневого компонента
      if (containsIconPrimitive(child)) recordIconSlot(root, variant, child, main);
      continue; // внутрь инстанса не идём в любом случае — см. комментарий выше про isExposedInstance
    }
    findIconSlots(root, variant, child);
  }
}
for (const root of iconScanRoots) {
  for (const v of representativeVariants(root)) findIconSlots(root, v, v);
}

// геометрия не должна зависеть от Variant/State — только от свойств, перечисленных здесь (у Button
// это Type×Size). Выброс значит «кнопка на глаз меняет размер при переключении варианта». Найдено
// 2026-10-24: strokesIncludedInLayout=true у Button/outline добавлял +2px к ширине относительно
// вариантов без обводки того же Type×Size — не входило ни в один чек. Правило человека тогда же:
// паддинг не может быть 0 (центрирование — явным паддингом на spacing/*, не пустой Fixed-рамкой).
const SIZE_CONSISTENCY_TARGETS = { Button: ["Type", "Size"] };
const PADDING_FIELDS = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"];
const GEOMETRY_FIELDS = ["width", "height", ...PADDING_FIELDS];

const sizeConsistency = [];
for (const setName in SIZE_CONSISTENCY_TARGETS) {
  const set = topLevel.find((n) => n.type === "COMPONENT_SET" && n.name === setName);
  if (!set) continue;
  const groupByProps = SIZE_CONSISTENCY_TARGETS[setName];
  const groups = {};
  for (const child of set.children) {
    const key = groupByProps.map((p) => child.variantProperties[p]).join(", ");
    (groups[key] ??= []).push(child);
  }
  for (const key in groups) {
    const group = groups[key];
    for (const f of GEOMETRY_FIELDS) {
      const counts = new Map();
      for (const c of group) counts.set(c[f], (counts.get(c[f]) || 0) + 1);
      let mode = null, modeCount = -1;
      for (const [v, n] of counts) if (n > modeCount) { mode = v; modeCount = n; }
      for (const c of group) if (c[f] !== mode) sizeConsistency.push([setName, key, c.name, f, c[f], mode, null]);
    }
    for (const c of group) {
      for (const f of PADDING_FIELDS) {
        if (c[f] === 0) sizeConsistency.push([setName, key, c.name, "zeroPadding", f, null, null]);
      }
      // strokesIncludedInLayout стоит true на ВСЕХ вариантах Button (не только с видимой обводкой) —
      // проверено живым чтением 2026-10-24. Безвреден без страницы paint (strokes.length===0), но
      // раздувает hug-ширину там, где обводка реально есть — флагуем только это сочетание.
      if (c.strokesIncludedInLayout && (c.strokes || []).length > 0) {
        sizeConsistency.push([setName, key, c.name, "strokesIncludedInLayout", true, false, null]);
      }
    }
  }
}

// ---- правило: Label, Field и Input держат один и тот же набор И порядок значений Size — иначе
// будущий рассинхрон (кто-то переставил Size в одном наборе и забыл остальные) останется
// незамеченным. На момент написания Input ещё не переставлен человеком (md,sm,lg вместо lg,md,sm,
// см. handoff.md) — проверка намеренно красная до этой ручной правки, это не баг экспортёра.
const SIZE_ORDER_TARGETS = ["Label", "Field", "Input"];
const sizeOrderConsistency = [];
{
  const orders = {};
  for (const name of SIZE_ORDER_TARGETS) {
    const set = topLevel.find((n) => n.type === "COMPONENT_SET" && n.name === name);
    const def = set && set.componentPropertyDefinitions["Size"];
    orders[name] = def ? def.variantOptions : null;
  }
  const present = SIZE_ORDER_TARGETS.filter((n) => orders[n]);
  const reference = orders[present[0]];
  for (const name of present.slice(1)) {
    const actual = orders[name];
    if (JSON.stringify(actual) !== JSON.stringify(reference)) {
      sizeOrderConsistency.push([name, actual.join(","), present[0], reference.join(","), null]);
    }
  }
}

const data = {
  schema: "ds layout v1: [name, type, x, y, w, h]",
  page: PAGE,
  exportedAt: new Date().toISOString().slice(0, 10),
  sections, loose, components, absoluteLayers,
  ringClipping, textContainers, nakedText, listItemSizing, repeatedLayers, focusRingShape, iconSlots,
  sizeConsistency, sizeOrderConsistency,
};
const djb2 = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(16); };
return { hash: djb2(JSON.stringify(data)), json: JSON.stringify(data) };

// ===== RING_SCAN — прогнать отдельно для "Playground" и "Foundations" (поменять PAGE2 ниже),
// находки (массив) дописать в data.ringClipping перед сохранением в figma/layout.json =====
//
// const PAGE2 = "Playground"; // или "Foundations"
// const page2 = figma.root.children.find((p) => p.name === PAGE2);
// await figma.setCurrentPageAsync(page2);
// const A2 = (n) => { const b = n.absoluteBoundingBox; return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
// function isContained2(inner, outer) {
//   return inner.x >= outer.x - 0.5 && inner.y >= outer.y - 0.5 &&
//     inner.x + inner.width <= outer.x + outer.width + 0.5 &&
//     inner.y + inner.height <= outer.y + outer.height + 0.5;
// }
// const found = [];
// for (const r of page2.findAll((n) => n.name === "focus-ring")) {
//   let n = r.parent;
//   while (n && n.type !== "PAGE") {
//     if ("clipsContent" in n && n.clipsContent === true && !isContained2(r.absoluteBoundingBox, n.absoluteBoundingBox)) {
//       found.push([PAGE2, n.name, n.type, ...A2(r), ...A2(n)]);
//     }
//     n = n.parent;
//   }
// }
// return found;
