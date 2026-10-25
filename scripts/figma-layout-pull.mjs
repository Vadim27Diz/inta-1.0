#!/usr/bin/env node
// Снимок раскладки через Figma REST API — замена похода в Figma через use_figma для
// npm run figma:layout. Портирует все 13 проверок .claude/skills/design-tokens/assets/
// figma-layout-export.js буква в букву; расхождения с Plugin API и почему они не меняют
// результат — в комментариях по месту.
//
//   npm run figma:pull                  # записывает figma/layout.json
//   node scripts/figma-layout-pull.mjs --diff   # то же + печатает diff с текущим файлом
//
// Требует .env.local: FIGMA_TOKEN (scope file_content:read), FIGMA_FILE_KEY.
// Требует figma/variable-ids.json — карта id→имя переменной (REST отдаёт только id; правило
// кольца фокуса сравнивает по имени). Снимается read-only через use_figma, см.
// docs/internal/specs/README.md → «Чем снимается». Устаревшая карта — проверяется по счётчику;
// при добавлении переменных в Figma пересними карту, иначе новые id не резолвятся в имена.
//
// Известные различия формата REST vs Plugin API (подтверждены на фикстуре в npm run figma:probe):
//   - радиус угла: boundVariables.rectangleCornerRadii.RECTANGLE_<CORNER>_CORNER_RADIUS,
//     не boundVariables.topLeftRadius.
//   - maxLines/textTruncation — внутри node.style, не на верхнем уровне узла. ЭТОТ ПОРТ ИХ НЕ
//     ЧИТАЕТ: оригинальный скрипт их тоже не читает (только componentPropertyReferences,
//     absoluteBoundingBox, boundVariables, isExposedInstance, exposedInstances,
//     componentPropertyReferences, componentPropertyDefinitions, layoutPositioning,
//     clipsContent, strokeWeight, strokeAlign) — см. полный список использованных полей ниже.
//   - relativeTransform/size REST не отдаёт; frame-относительные x/y/width/height считаются
//     как разница absoluteBoundingBox ребёнка и родителя (функция `rel()` ниже).
//   - defaultVariant (Plugin API: самый верхний-левый вариант сетки) REST не вычисляет — не
//     читается ни одной из 13 проверок, поэтому отсутствие не влияет на результат.
import fs from "node:fs";
import path from "node:path";

const ENV = ".env.local";
if (fs.existsSync(ENV)) {
  for (const line of fs.readFileSync(ENV, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
const TOKEN = process.env.FIGMA_TOKEN;
const KEY = process.env.FIGMA_FILE_KEY;
if (!TOKEN || !KEY) { console.error("нет FIGMA_TOKEN/FIGMA_FILE_KEY"); process.exit(1); }

const VARMAP_PATH = "figma/variable-ids.json";
if (!fs.existsSync(VARMAP_PATH)) {
  console.error(`нет ${VARMAP_PATH} — снять read-only через use_figma, см. docs/internal/specs/README.md`);
  process.exit(1);
}
const varmap = JSON.parse(fs.readFileSync(VARMAP_PATH, "utf8"));
const idToName = varmap.map;

const CACHE = "figma/cache.local";
fs.mkdirSync(CACHE, { recursive: true });
async function fetchPage(pageId) {
  const cached = path.join(CACHE, `nodes-${pageId.replace(/[^\w.-]/g, "_")}.json`);
  const r = await fetch(`https://api.figma.com/v1/files/${KEY}/nodes?ids=${encodeURIComponent(pageId)}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} fetching page ${pageId}`);
  const json = await r.json();
  fs.writeFileSync(cached, JSON.stringify(json));
  return Object.values(json.nodes)[0].document;
}

// ---- обход дерева: собираем {node, parent} для всех потомков, включая скрытые (visible:false
// REST отдаёт как есть — подтверждено npm run figma:probe: 436 скрытых узлов видны, 69 внутри
// инстансов — ровно аналог figma.skipInvisibleInstanceChildren=false в Plugin API)
function flatten(root) {
  const out = [];
  const walk = (n, parent) => { out.push({ n, parent }); for (const c of n.children || []) walk(c, n); };
  walk(root, null);
  return out;
}
function byId(flat) { const m = new Map(); for (const { n } of flat) m.set(n.id, n); return m; }

// ---- то же, что A(n)=[round(x),round(y),round(w),round(h)] из absoluteBoundingBox в Plugin API
const A = (n) => {
  const b = n.absoluteBoundingBox;
  return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)];
};
const node = (n) => [n.name, n.type, ...A(n)];

// frame-относительные x/y/width/height (Plugin API: n.x/n.y/n.width/n.height — REST не отдаёт
// relativeTransform/size для нелистовых узлов надёжно, поэтому считаем от absoluteBoundingBox).
// width/height совпадают буквально; x/y — разница абсолютных box'ов ребёнка и родителя.
function rel(n, parent) {
  const nb = n.absoluteBoundingBox, pb = parent ? parent.absoluteBoundingBox : { x: 0, y: 0 };
  return { x: nb.x - pb.x, y: nb.y - pb.y, width: nb.width, height: nb.height };
}

function cornerVar(n, corner) {
  // corner: topLeftRadius|topRightRadius|bottomLeftRadius|bottomRightRadius (Plugin API naming,
  // сохраняем как ключ вызова) → REST-ключ RECTANGLE_<CORNER>_CORNER_RADIUS
  const REST_KEY = {
    topLeftRadius: "RECTANGLE_TOP_LEFT_CORNER_RADIUS",
    topRightRadius: "RECTANGLE_TOP_RIGHT_CORNER_RADIUS",
    bottomLeftRadius: "RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS",
    bottomRightRadius: "RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS",
  }[corner];
  const bv = n.boundVariables && n.boundVariables.rectangleCornerRadii;
  const ref = bv && bv[REST_KEY];
  return ref && ref.id ? idToName[ref.id] || ref.id : null;
}
function cornerVal(n, corner) {
  // Plugin API: n[corner] — число. REST: если углы РАЗНЫЕ, rectangleCornerRadii: [tl,tr,br,bl];
  // если все углы ОДИНАКОВЫЕ, rectangleCornerRadii отсутствует и значение в cornerRadius
  // (подтверждено на фикстуре: focus-ring cornerRadius=8, rectangleCornerRadii=undefined).
  const IDX = { topLeftRadius: 0, topRightRadius: 1, bottomRightRadius: 2, bottomLeftRadius: 3 };
  if (Array.isArray(n.rectangleCornerRadii)) return n.rectangleCornerRadii[IDX[corner]];
  return n.cornerRadius;
}
function paintVarWeb(n, field) {
  const list = n.boundVariables && n.boundVariables[field];
  const ref = Array.isArray(list) ? list[0] : list;
  return ref && ref.id ? idToName[ref.id] || ref.id : null;
}
const hasVisibleFill = (n) => Array.isArray(n.fills) && n.fills.some((f) => f.visible !== false);

function mainComponentOf(inst, allById) {
  if (!inst.componentId) return null;
  const m = allById.get(inst.componentId);
  if (!m) return { missing: true, id: inst.componentId }; // внешний компонент/библиотека — не наш случай
  return m;
}
function resolvedMainName(inst, allById, parentOf) {
  const m = mainComponentOf(inst, allById);
  if (!m || m.missing) return null;
  const p = parentOf.get(m.id);
  return p && p.type === "COMPONENT_SET" ? p.name : m.name;
}
function stripPropId(name) { return name.replace(/#\d+:\d+$/, ""); }

// =====================================================================================
async function pull(pageName) {
  const file = await (async () => {
    const r = await fetch(`https://api.figma.com/v1/files/${KEY}?depth=1`, { headers: { "X-Figma-Token": TOKEN } });
    if (!r.ok) throw new Error(`HTTP ${r.status} listing pages`);
    return r.json();
  })();
  const pageMeta = (file.document.children || []).find((p) => p.name === pageName);
  if (!pageMeta) throw new Error(`нет страницы ${pageName}`);
  const page = await fetchPage(pageMeta.id);

  const flat = flatten(page);
  const allById = byId(flat);
  const parentOf = new Map(flat.map(({ n, parent }) => [n.id, parent]));

  const sections = page.children.filter((c) => c.type === "SECTION").map((s) => ({ s: node(s), c: s.children.map(node) }));
  const loose = page.children.filter((c) => c.type !== "SECTION").map(node);

  function flattenWithin(n, out) { out.push(n); for (const c of n.children || []) flattenWithin(c, out); return out; }
  const allInPage = flattenWithin(page, []);
  const topLevel = allInPage
    .filter((n) => n.type === "COMPONENT" || n.type === "COMPONENT_SET")
    .filter((n) => { const p = parentOf.get(n.id); return !(p && p.type === "COMPONENT_SET"); });
  const components = topLevel.map((n) => { const p = parentOf.get(n.id); return [n.name, n.type, p.name, p.type]; });

  return { page, flat, allById, parentOf, sections, loose, topLevel, components };
}

// =====================================================================================
async function main() {
  const components_ = await pull("Components");
  const { page, flat, allById, parentOf, sections, loose, topLevel, components } = components_;

  // ---- 1. абсолютно позиционированные слои внутри наборов — разрешён только focus-ring
  const EXEMPT_ABSOLUTE_LAYERS = {};
  const absoluteLayers = [];
  for (const root of topLevel) {
    const variants = root.type === "COMPONENT_SET" ? root.children : [root];
    for (const v of variants) {
      const sub = flattenWithinNode(v);
      for (const a of sub) {
        if (a === v) continue;
        if (a.layoutPositioning === "ABSOLUTE" && a.name !== "focus-ring") {
          const exempt = EXEMPT_ABSOLUTE_LAYERS[`${root.name}|${a.name}`] || null;
          absoluteLayers.push([root.name, v.name, a.name, a.type, exempt]);
        }
      }
    }
  }

  // ---- 2. focus-ring нигде не обрезан предком (Components); Playground/Foundations — отдельно
  function isContained(inner, outer) {
    return inner.x >= outer.x - 0.5 && inner.y >= outer.y - 0.5 &&
      inner.x + inner.width <= outer.x + outer.width + 0.5 &&
      inner.y + inner.height <= outer.y + outer.height + 0.5;
  }
  function ringClippingOnPage(pageDoc, parentOfPage, pageName) {
    const rings = flattenWithinNode(pageDoc).filter((n) => n.name === "focus-ring");
    const found = [];
    for (const r of rings) {
      let n = parentOfPage.get(r.id);
      while (n && n.id !== pageDoc.id) {
        if ("clipsContent" in n && n.clipsContent === true && !isContained(r.absoluteBoundingBox, n.absoluteBoundingBox)) {
          found.push([pageName, n.name, n.type, ...A(r), ...A(n)]);
        }
        n = parentOfPage.get(n.id);
      }
    }
    return found;
  }
  const ringClipping = ringClippingOnPage(page, parentOf, "Components");
  for (const extra of ["Playground", "Foundations"]) {
    try {
      const { page: p2, parentOf: po2 } = await pull(extra);
      ringClipping.push(...ringClippingOnPage(p2, po2, extra));
    } catch (e) { console.log(`⚠ ringClipping на ${extra} пропущен: ${e.message}`); }
  }

  // ---- 3. текстовый контейнер только Hug/Fill, никогда Fixed; 10. текст как TEXT property
  function widthIsFixed(frame) {
    if (!("layoutMode" in frame) || !frame.layoutMode || frame.layoutMode === "NONE") return true;
    if (frame.layoutMode === "HORIZONTAL") return frame.primaryAxisSizingMode === "FIXED";
    return frame.counterAxisSizingMode === "FIXED";
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
  const EXEMPT_NAKED_TEXT = {
    "Label|required": "декоративный маркер обязательности — всегда литеральная «*», не пользовательский контент",
    "Input OTP|separator": "декоративный разделитель между группами слотов — всегда литеральное тире, не пользовательский контент",
    "Typography|bullet": "декоративный маркер пункта списка — всегда литеральная «•», не пользовательский контент",
  };
  function ownerName(t, rootName) {
    let n = parentOf.get(t.id);
    while (n) {
      if (n.type === "INSTANCE") {
        const m = mainComponentOf(n, allById);
        if (m && !m.missing) { const p = parentOf.get(m.id); return p && p.type === "COMPONENT_SET" ? p.name : m.name; }
        break;
      }
      n = parentOf.get(n.id);
    }
    return rootName;
  }
  function nearestInstance(t) {
    let n = parentOf.get(t.id);
    while (n) { if (n.type === "INSTANCE") return n; n = parentOf.get(n.id); }
    return null;
  }
  const textContainers = [];
  const nakedText = [];
  for (const root of topLevel) {
    const variants = root.type === "COMPONENT_SET" ? root.children : [root];
    const v = variants[0];
    for (const t of flattenWithinNode(v).filter((n) => n.type === "TEXT")) {
      if (/^caption /.test(t.name)) continue;
      const owner = ownerName(t, root.name);
      const refs = t.componentPropertyReferences || {};
      const hasProperty = Object.keys(refs).some((k) => stripPropId(k) === "characters" ||
        (typeof refs[k] === "string" && false)); // characters ref value не нужен — нужен сам факт привязки
      // REST: componentPropertyReferences — { field: "PropName#id" }; факт привязки поля characters:
      const hasCharactersRef = !!refs.characters;
      const fixedScope = nearestInstance(t) || v;
      const rootFixed = widthIsFixed(fixedScope);
      const parent = parentOf.get(t.id);
      const parentFixed = parent && parent.id !== v.id && "layoutMode" in parent ? widthIsFixed(parent) : null;
      if (rootFixed || parentFixed) {
        const key = `${owner}|${parent ? parent.name : v.name}`;
        textContainers.push([root.name, t.name, parent ? parent.name : v.name, rootFixed, !!parentFixed, EXEMPT_FIXED_WIDTH[key] || null]);
      }
      if (!hasCharactersRef) {
        const key = `${owner}|${t.name}`;
        nakedText.push([root.name, t.name, t.characters, EXEMPT_NAKED_TEXT[key] || null]);
      }
    }
  }

  // ---- 4. дочерние элементы списка — Fill, не Hug
  function sameComponent(a, b) {
    const am = mainComponentOf(a, allById), bm = mainComponentOf(b, allById);
    if (!am || am.missing || !bm || bm.missing) return false;
    const amSet = parentOf.get(am.id); const bmSet = parentOf.get(bm.id);
    const amId = amSet && amSet.type === "COMPONENT_SET" ? amSet.id : am.id;
    const bmId = bmSet && bmSet.type === "COMPONENT_SET" ? bmSet.id : bm.id;
    return amId === bmId;
  }
  const listItemSizing = [];
  for (const root of topLevel) {
    const variants = root.type === "COMPONENT_SET" ? root.children : [root];
    for (const v of variants) {
      const sub = flattenWithinNode(v);
      const lists = sub.filter((n) => n.layoutMode === "VERTICAL" && (n.children || []).length >= 2 &&
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

  // ---- 5. повторяющиеся нарисованные слои
  const repeatedLayers = [];
  for (const root of topLevel) {
    const variants = root.type === "COMPONENT_SET" ? root.children : [root];
    for (const v of variants) {
      const containers = [v, ...flattenWithinNode(v).filter((n) => n.id !== v.id && "children" in n)];
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

  // ---- 6. форма focus-ring (Kind/Scale/Position, скругление на шаг выше родителя)
  const SCALE_UP = { "radius/sm": "radius/md", "radius/md": "radius/lg", "radius/lg": "radius/xl" };
  const CORNERS = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
  const FULL_THRESHOLD = 999;
  const focusRingShape = [];
  const EXEMPT_FOCUS_RING_SHAPE = {};
  function pushRingFinding(row) {
    const exempt = EXEMPT_FOCUS_RING_SHAPE[`${row[1]}|${row[2]}`] || null;
    focusRingShape.push([...row, exempt]);
  }
  for (const r of flattenWithinNode(page).filter((n) => n.name === "focus-ring")) {
    const directParent = parentOf.get(r.id);
    if (!directParent || !("cornerRadius" in directParent) && !("rectangleCornerRadii" in directParent) && directParent.type !== "ELLIPSE") continue;
    let parent = directParent;
    let offsetBaseX = 0, offsetBaseY = 0;
    const rb = rel(r, null), pb = rel(directParent, null);
    const parentExplainsSize = Math.abs(rb.width - (pb.width + 4)) <= 0.5 && Math.abs(rb.height - (pb.height + 4)) <= 0.5;
    if (!parentExplainsSize && directParent.children) {
      const sibling = directParent.children.find((s) => {
        if (s.id === r.id) return false;
        const sb = rel(s, null);
        return Math.abs(rb.width - (sb.width + 4)) <= 0.5 && Math.abs(rb.height - (sb.height + 4)) <= 0.5;
      });
      if (sibling) {
        parent = sibling;
        const sibRel = rel(sibling, directParent);
        offsetBaseX = sibRel.x; offsetBaseY = sibRel.y;
      }
    }
    const parentIsEllipse = parent.type === "ELLIPSE";
    const m = r.type === "INSTANCE" ? mainComponentOf(r, allById) : null;
    const mainSetName = m && !m.missing ? (parentOf.get(m.id) && parentOf.get(m.id).type === "COMPONENT_SET" ? parentOf.get(m.id).name : m.name) : null;
    if (r.type !== "INSTANCE" || mainSetName !== "Utility / Focus ring") {
      pushRingFinding(["not-instance", parent.name, r.name, r.type, mainSetName]);
      continue;
    }
    const kindMatch = m.name.match(/^Kind=(\w+)/);
    const kind = kindMatch ? kindMatch[1] : null;
    if (!kind) { pushRingFinding(["no-kind", parent.name, r.name, m.name]); continue; }
    const isFlush = kind === "field" || kind === "seam";
    const stepRadius = kind !== "field";

    for (const corner of CORNERS) {
      const parentVal = parentIsEllipse ? FULL_THRESHOLD : cornerVal(parent, corner);
      const parentVar = parentIsEllipse ? null : cornerVar(parent, corner);
      const ringVal = cornerVal(r, corner);
      const ringVar = cornerVar(r, corner);
      if (parentVal >= FULL_THRESHOLD) {
        if (ringVal < FULL_THRESHOLD) pushRingFinding(["corner-full", parent.name, r.name, corner, "full", ringVal]);
      } else if (parentVal === 0) {
        if (ringVal !== 0) pushRingFinding(["corner-flat", parent.name, r.name, corner, 0, ringVal]);
      } else if (!stepRadius) {
        if (ringVar !== parentVar) pushRingFinding(["corner-equal", parent.name, r.name, corner, parentVar, ringVar || ringVal]);
      } else if (parentVar && SCALE_UP[parentVar]) {
        if (ringVar !== SCALE_UP[parentVar]) pushRingFinding(["corner-step", parent.name, r.name, corner, SCALE_UP[parentVar], ringVar || ringVal]);
      } else {
        pushRingFinding(["corner-unclassified", parent.name, r.name, corner, parentVar || parentVal, ringVar || ringVal]);
      }
    }
    const wantDelta = isFlush ? 0 : 4;
    const wantOffset = isFlush ? 0 : -2;
    const rr = rel(r, directParent);
    const okW = Math.abs(rr.width - (pb.width + wantDelta)) <= 0.5;
    const okH = Math.abs(rr.height - (pb.height + wantDelta)) <= 0.5;
    const okX = Math.abs((rr.x - offsetBaseX) - wantOffset) <= 0.5;
    const okY = Math.abs((rr.y - offsetBaseY) - wantOffset) <= 0.5;
    if (!okW || !okH || !okX || !okY) {
      pushRingFinding(["geometry", parent.name, r.name,
        { kind, w: rr.width, h: rr.height, dx: rr.x - offsetBaseX, dy: rr.y - offsetBaseY },
        { wantW: pb.width + wantDelta, wantH: pb.height + wantDelta, wantDx: wantOffset, wantDy: wantOffset }]);
    }
    const wantStroke = kind === "field" ? 3 : 2;
    if (r.strokeWeight !== wantStroke) pushRingFinding(["stroke-weight", parent.name, r.name, kind, wantStroke, r.strokeWeight]);
  }

  // ---- 7. слоты-иконки
  const ICON_SLOT_EXCLUDE_ROOTS = new Set(["Icon", "Icon base", "Utility / Focus ring"]);
  const iconScanRoots = topLevel.filter((n) => !ICON_SLOT_EXCLUDE_ROOTS.has(n.name) && !/^li:/.test(n.name));
  const topLevelNames = new Set(iconScanRoots.map((n) => n.name));
  function isIconPrimitive(name) { return name === "Icon" || name === "Icon base" || /^li:/.test(name); }
  function containsIconPrimitive(nd) {
    return flattenWithinNode(nd).some((n) => n.type === "INSTANCE" && n.componentId && isIconPrimitive(resolvedMainName(n, allById, parentOf)));
  }
  function structuralAxes(root) {
    if (root.type !== "COMPONENT_SET") return [];
    return Object.entries(root.componentPropertyDefinitions || {}).filter(([, d]) => d.type === "VARIANT").map(([k]) => k);
  }
  function parseVariantProps(name) {
    const out = {};
    for (const part of name.split(", ")) { const eq = part.indexOf("="); if (eq !== -1) out[part.slice(0, eq)] = part.slice(eq + 1); }
    return out;
  }
  function representativeVariants(root) {
    if (root.type !== "COMPONENT_SET") return [root];
    const axes = structuralAxes(root);
    if (!axes.length) return [root.children[0]];
    const covered = {}; for (const a of axes) covered[a] = new Set();
    const selected = [];
    for (const child of root.children) {
      const props = parseVariantProps(child.name);
      let addsNew = selected.length === 0;
      for (const a of axes) if (props[a] !== undefined && !covered[a].has(props[a])) addsNew = true;
      if (addsNew) { selected.push(child); for (const a of axes) if (props[a] !== undefined) covered[a].add(props[a]); }
    }
    return selected;
  }
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
    iconSlots.push([root.name, variant.name, inst.name, !!inst.isExposedInstance, mainName, hasPropertyRef, exempt]);
  }
  function findIconSlots(root, variant, nd) {
    for (const child of nd.children || []) {
      if (child.type === "INSTANCE") {
        const main = resolvedMainName(child, allById, parentOf);
        if (main && isIconPrimitive(main)) { recordIconSlot(root, variant, child, main); continue; }
        if (main && topLevelNames.has(main)) continue;
        if (containsIconPrimitive(child)) recordIconSlot(root, variant, child, main);
        continue;
      }
      findIconSlots(root, variant, child);
    }
  }
  for (const root of iconScanRoots) for (const v of representativeVariants(root)) findIconSlots(root, v, v);

  // ---- 8. геометрия не зависит от Variant/State — только от указанных осей
  const SIZE_CONSISTENCY_TARGETS = { Button: ["Type", "Size"] };
  const PADDING_FIELDS = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"];
  const GEOMETRY_FIELDS = ["width", "height", ...PADDING_FIELDS];
  const sizeConsistency = [];
  for (const [rootName, axes] of Object.entries(SIZE_CONSISTENCY_TARGETS)) {
    const root = topLevel.find((n) => n.name === rootName);
    if (!root || root.type !== "COMPONENT_SET") continue;
    const groups = {};
    for (const v of root.children) {
      const props = parseVariantProps(v.name);
      const key = axes.map((a) => props[a]).join("|");
      (groups[key] ||= []).push(v);
    }
    for (const [key, members] of Object.entries(groups)) {
      const first = members[0];
      for (const f of GEOMETRY_FIELDS) {
        const want = first[f];
        for (const m of members.slice(1)) {
          if (Math.abs((m[f] ?? 0) - (want ?? 0)) > 0.5) {
            sizeConsistency.push([rootName, key, f, want, m[f], m.name]);
          }
        }
      }
    }
  }

  // ---- 9. порядок значений Size: lg, md, sm (и icon-lg, icon, icon-sm)
  const SIZE_ORDER_TARGETS = ["Label", "Field", "Input"];
  const sizeOrderConsistency = [];
  const WANT_ORDER = ["lg", "md", "sm"];
  for (const rootName of SIZE_ORDER_TARGETS) {
    const root = topLevel.find((n) => n.name === rootName);
    if (!root || root.type !== "COMPONENT_SET") continue;
    const def = (root.componentPropertyDefinitions || {}).Size;
    if (!def || !def.variantOptions) continue;
    const actual = def.variantOptions.filter((v) => WANT_ORDER.includes(v));
    const want = WANT_ORDER.filter((v) => actual.includes(v));
    if (JSON.stringify(actual) !== JSON.stringify(want)) {
      sizeOrderConsistency.push([rootName, actual.join(","), want.join(",")]);
    }
  }

  function flattenWithinNode(nd) { return flattenWithin(nd, []); }
  function flattenWithin(n, out) { out.push(n); for (const c of n.children || []) flattenWithin(c, out); return out; }

  const data = {
    schema: "ds layout v1: [name, type, x, y, w, h]",
    page: "Components",
    exportedAt: new Date().toISOString().slice(0, 10),
    sections, loose, components,
    absoluteLayers, ringClipping, textContainers, nakedText,
    listItemSizing, repeatedLayers, iconSlots, sizeConsistency, sizeOrderConsistency, focusRingShape,
  };
  return data;
}

function djb2(x) { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(16); }

main().then((data) => {
  const EXPORTER_PATH = "scripts/figma-layout-pull.mjs";
  const dataHash = djb2(JSON.stringify(data));
  data.exporterHash = djb2(fs.readFileSync(EXPORTER_PATH, "utf8"));
  data.source = "rest";

  const OUT = "figma/layout.json";
  if (process.argv.includes("--diff") && fs.existsSync(OUT)) {
    const old = JSON.parse(fs.readFileSync(OUT, "utf8"));
    for (const key of Object.keys(data)) {
      if (["exportedAt", "exporterHash", "source"].includes(key)) continue;
      const a = JSON.stringify(old[key] ?? null), b = JSON.stringify(data[key] ?? null);
      if (a !== b) console.log(`⚠ ${key}: отличается (старое ${a.length} симв., новое ${b.length} симв.)`);
      else console.log(`= ${key}: совпадает`);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(data));
  console.log(`сохранено ${OUT} · данные ${dataHash} · exporterHash ${data.exporterHash} · источник REST`);
}).catch((e) => { console.error(e.stack || e.message); process.exit(1); });
