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
//   3. Сохранить итоговый объект в figma/layout.json → `node scripts/figma-layout-check.mjs`
//      (он же печатает хеш; хеш из ответа скрипта и хеш файла обязаны совпасть — иначе снимок
//      устарел и проверка валидирует прошлое).
// Обновлять после КАЖДОЙ правки раскладки, любого компонента или их текстовых слоёв.

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
};

// ---- правило: текст, который меняется при использовании (подпись/значение/клавиша),
// подключён как TEXT property, а не «голый» текстовый слой. Исключения — явно, с причиной.
const EXEMPT_NAKED_TEXT = {
  "Label|required": "декоративный маркер обязательности — всегда литеральная «*», не пользовательский контент",
};

const textContainers = [];
const nakedText = [];
for (const root of topLevel) {
  const variants = root.type === "COMPONENT_SET" ? root.children : [root];
  const v = variants[0]; // структура одинакова у всех вариантов набора
  for (const t of v.findAll((n) => n.type === "TEXT")) {
    if (/^caption /.test(t.name)) continue; // подписи под глифами — не контент компонента
    const hasProperty = !!(t.componentPropertyReferences && t.componentPropertyReferences.characters);
    const rootFixed = widthIsFixed(v);
    const parent = t.parent;
    const parentFixed = parent && parent !== v && "layoutMode" in parent ? widthIsFixed(parent) : null;
    if (rootFixed || parentFixed) {
      const key = `${root.name}|${parent ? parent.name : v.name}`;
      textContainers.push([root.name, t.name, parent ? parent.name : v.name, rootFixed, !!parentFixed, EXEMPT_FIXED_WIDTH[key] || null]);
    }
    if (!hasProperty) {
      const key = `${root.name}|${t.name}`;
      nakedText.push([root.name, t.name, t.characters, EXEMPT_NAKED_TEXT[key] || null]);
    }
  }
}

const data = {
  schema: "ds layout v1: [name, type, x, y, w, h]",
  page: PAGE,
  exportedAt: new Date().toISOString().slice(0, 10),
  sections, loose, components, absoluteLayers,
  ringClipping, textContainers, nakedText,
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
