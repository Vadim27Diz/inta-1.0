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

const A = (n) => { const b = n.absoluteBoundingBox; return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
const node = (n) => [n.name, n.type, ...A(n)];

const sections = page.children.filter((c) => c.type === "SECTION").map((s) => ({ s: node(s), c: s.children.map(node) }));
const loose = page.children.filter((c) => c.type !== "SECTION").map(node);
const topLevel = page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })
  .filter((n) => !(n.parent && n.parent.type === "COMPONENT_SET"));
const components = topLevel.map((n) => [n.name, n.type, n.parent.name, n.parent.type]);

// абсолютно позиционированные слои внутри наборов — разрешён только focus-ring
const absoluteLayers = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  for (const v of variants) {
    if (!("findAll" in v)) continue;
    const abs = v.findAll((n) => "layoutPositioning" in n && n.layoutPositioning === "ABSOLUTE" && n.name !== "focus-ring");
    for (const a of abs) absoluteLayers.push([root.name, v.name, a.name, a.type]);
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

const textContainers = [];
const nakedText = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  const v = variants[0]; // структура одинакова у всех вариантов набора
  for (const t of v.findAll((n) => n.type === "TEXT")) {
    if (/^caption /.test(t.name)) continue; // подписи под глифами — не контент компонента
    const owner = ownerName(t, root.name);
    const hasProperty = !!(t.componentPropertyReferences && t.componentPropertyReferences.characters);
    const rootFixed = widthIsFixed(v);
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
    focusRingShape.push(["not-instance", parent.name, r.name, r.type, mainSetName]);
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
  if (!kind) { focusRingShape.push(["no-kind", parent.name, r.name, main.name]); continue; }
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
      if (ringVal < FULL_THRESHOLD) focusRingShape.push(["corner-full", parent.name, r.name, corner, "full", ringVal]);
    } else if (parentVal === 0) {
      if (ringVal !== 0) focusRingShape.push(["corner-flat", parent.name, r.name, corner, 0, ringVal]);
    } else if (!stepRadius) {
      // field: кольцо повторяет ТУ ЖЕ переменную, что и родитель — не следующую ступень
      if (ringVar !== parentVar) focusRingShape.push(["corner-equal", parent.name, r.name, corner, parentVar, ringVar || ringVal]);
    } else if (parentVar && SCALE_UP[parentVar]) {
      if (ringVar !== SCALE_UP[parentVar]) focusRingShape.push(["corner-step", parent.name, r.name, corner, SCALE_UP[parentVar], ringVar || ringVal]);
    } else {
      focusRingShape.push(["corner-unclassified", parent.name, r.name, corner, parentVar || parentVal, ringVar || ringVal]);
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
    focusRingShape.push(["geometry", parent.name, r.name, { kind, w: r.width, h: r.height, dx: r.x - offsetBaseX, dy: r.y - offsetBaseY }, { wantW: parent.width + wantDelta, wantH: parent.height + wantDelta, wantDx: wantOffset, wantDy: wantOffset }]);
  }
  // толщина обводки: control/seam — 2px, field — 3px (образец ui.shadcn.com)
  const wantStroke = kind === "field" ? 3 : 2;
  if (r.strokeWeight !== wantStroke) {
    focusRingShape.push(["stroke-weight", parent.name, r.name, kind, wantStroke, r.strokeWeight]);
  }
}

const data = {
  schema: "ds layout v1: [name, type, x, y, w, h]",
  page: PAGE,
  exportedAt: new Date().toISOString().slice(0, 10),
  sections, loose, components, absoluteLayers,
  ringClipping, textContainers, nakedText, listItemSizing, repeatedLayers, focusRingShape,
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
