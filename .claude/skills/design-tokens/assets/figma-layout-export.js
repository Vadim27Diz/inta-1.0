// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first. READ-ONLY.
// Снимок раскладки страницы Components для scripts/figma-layout-check.mjs.
//
// Порядок: прогнать этот скрипт → сохранить JSON в figma/layout.json →
// `node scripts/figma-layout-check.mjs` (он же печатает хеш; хеш из ответа скрипта
// и хеш файла обязаны совпасть — иначе снимок устарел и проверка валидирует прошлое).
// Обновлять после КАЖДОЙ правки раскладки.
const PAGE = "Components";
const page = figma.root.children.find((p) => p.name === PAGE);
if (!page) throw new Error(`нет страницы ${PAGE}`);
await figma.setCurrentPageAsync(page);

const A = (n) => { const b = n.absoluteBoundingBox; return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
const node = (n) => [n.name, n.type, ...A(n)];

const sections = page.children.filter((c) => c.type === "SECTION").map((s) => ({ s: node(s), c: s.children.map(node) }));
const loose = page.children.filter((c) => c.type !== "SECTION").map(node);
const components = page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })
  .filter((n) => !(n.parent && n.parent.type === "COMPONENT_SET"))
  .map((n) => [n.name, n.type, n.parent.name, n.parent.type]);

const data = {
  schema: "ds layout v1: [name, type, x, y, w, h]",
  page: PAGE,
  exportedAt: new Date().toISOString().slice(0, 10),
  sections, loose, components,
};
const djb2 = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(16); };
return { hash: djb2(JSON.stringify(data)), json: JSON.stringify(data) };
