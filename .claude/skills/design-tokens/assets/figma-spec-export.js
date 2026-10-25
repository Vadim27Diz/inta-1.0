// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first. READ-ONLY.
// Снимает спек компонента для переноса в код: docs/internal/specs/<slug>.json.
// Формат и соглашения (порядок padding, corners, имена переменных вместо hex) —
// docs/internal/specs/README.md.
//
// Порядок:
//   1. COMPONENT = имя набора на странице Components, прогнать этот скрипт.
//   2. Ответ сохранить ЧЕРЕЗ `node scripts/port-spec-save.mjs <slug>` (не руками — он добавляет
//      layoutSignature из figma/layout.json и печатает сводку).
//   3. Строку компонента в docs/internal/port-queue.md перевести в `spec-captured` → `queued`.
//
// Главное правило: спек — ТАБЛИЦА, не перебор вариантов. Строки группируются по различающимся
// наборам значений, а `when` оставляет только те свойства, которые на этот набор влияют.
// У Tab это ~20 строк вместо 48 вариантов.

const COMPONENT = "Tab";

const page = figma.root.children.find((p) => p.name === "Components");
if (!page) throw new Error("нет страницы Components");
await figma.setCurrentPageAsync(page);
figma.skipInvisibleInstanceChildren = false; // иначе у скрытых слотов (Icon left) пустой children

const root = page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })
  .find((n) => n.name === COMPONENT && !(n.parent && n.parent.type === "COMPONENT_SET"));
if (!root) throw new Error(`нет компонента ${COMPONENT} на странице Components`);

const allVars = await figma.variables.getLocalVariablesAsync();
const varName = (id) => { const v = allVars.find((x) => x.id === id); return v ? v.name : id; };
const bound = (n, field) => {
  const bv = n.boundVariables && n.boundVariables[field];
  const ref = Array.isArray(bv) ? bv[0] : bv;
  return ref && ref.id ? varName(ref.id) : null;
};
const paintVar = (n, field) => {
  const list = n.boundVariables && n.boundVariables[field];
  return Array.isArray(list) && list[0] ? varName(list[0].id) : null;
};
const hasFill = (n) => Array.isArray(n.fills) && n.fills.length > 0 && n.fills.some((f) => f.visible !== false);

// ---- свойства набора: значения VARIANT в порядке Figma (он задаётся порядком создания)
const defs = root.componentPropertyDefinitions || {};
const properties = Object.entries(defs).map(([rawName, d]) => {
  const name = rawName.replace(/#\d+:\d+$/, ""); // Label#518:0 → Label
  const p = { name, type: d.type };
  if (d.variantOptions) p.values = [...d.variantOptions];
  if (d.defaultValue !== undefined) p.default = d.defaultValue;
  return p;
});
const axes = properties.filter((p) => p.type === "VARIANT").map((p) => p.name);

const variants = root.type === "COMPONENT_SET" ? root.children : [root];
const propsOf = (v) => Object.fromEntries(
  v.name.split(",").map((s) => s.trim().split("=")).filter((kv) => kv.length === 2),
);

// ---- слои первого варианта: структура одинакова у всех
const first = variants[0];
const textStyleIds = [];
const walk = (n, depth, out) => {
  for (const c of n.children || []) {
    const row = { name: c.name, type: c.type, depth };
    if (c.type === "INSTANCE") {
      const m = c.mainComponent;
      row.of = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : null;
      if (c.isExposedInstance) row.exposed = true;
    }
    if (c.visible === false) row.visibleByDefault = false;
    if (c.layoutPositioning === "ABSOLUTE") row.absolute = true;
    const ref = c.componentPropertyReferences;
    if (ref && (ref.characters || ref.visible || ref.mainComponent)) {
      row.property = (ref.characters || ref.visible || ref.mainComponent).replace(/#\d+:\d+$/, "");
    }
    if (c.type === "TEXT" && c.textStyleId) textStyleIds.push(c.textStyleId);
    out.push(row);
    walk(c, depth + 1, out);
  }
  return out;
};
const layers = walk(first, 0, [{ name: first.name.includes("=") ? "root" : first.name, type: root.type, depth: -1 }]);

// имена текстовых стилей — батчем, а не await в цикле (gotchas /figma-use → Sequential awaits)
const styleNames = {};
await Promise.all([...new Set(textStyleIds)].map(async (id) => {
  const s = await figma.getStyleByIdAsync(id);
  if (s) styleNames[id] = s.name;
}));

// ---- сбор по варианту: геометрия, токены, радиусы
const ICON = (n) => n === "Icon" || n === "Icon base" || /^li:/.test(n);
const perVariant = variants.map((v) => {
  const all = v.findAll(() => true);
  const label = all.find((n) => n.type === "TEXT");
  const iconInst = all.find((n) => {
    if (n.type !== "INSTANCE") return false;
    const m = n.mainComponent;
    const mn = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : "";
    return ICON(mn);
  });
  const geometry = {
    height: Math.round(v.height),
    padding: [v.paddingTop, v.paddingRight, v.paddingBottom, v.paddingLeft],
    itemSpacing: v.itemSpacing,
    icon: iconInst ? Math.round(iconInst.width) : null,
    typo: label && label.textStyleId ? styleNames[label.textStyleId] || null : null,
  };
  // токены: корень + каждый именованный слой с привязанной заливкой/обводкой
  const tokens = {
    fill: hasFill(v) ? paintVar(v, "fills") : null,
    stroke: Array.isArray(v.strokes) && v.strokes.length ? paintVar(v, "strokes") : null,
  };
  for (const n of all) {
    if (n.name === "focus-ring") continue;
    const f = hasFill(n) ? paintVar(n, "fills") : null;
    const s = Array.isArray(n.strokes) && n.strokes.length ? paintVar(n, "strokes") : null;
    if (f) tokens[`${n.name}.fill`] = f;
    if (s) tokens[`${n.name}.stroke`] = s;
  }
  const corners = ["topLeftRadius", "topRightRadius", "bottomRightRadius", "bottomLeftRadius"]
    .map((c) => bound(v, c) || v[c]);
  return { props: propsOf(v), geometry, tokens, corners };
});

// ---- группировка: одна строка на различающийся набор значений, `when` только из тех свойств,
// которые на него влияют. Если в группе собраны ВСЕ значения свойства — свойство не влияет.
const valuesByAxis = {};
for (const a of axes) valuesByAxis[a] = new Set(perVariant.map((r) => r.props[a]));

function group(pick) {
  const bySig = new Map();
  for (const r of perVariant) {
    const sig = JSON.stringify(pick(r));
    if (!bySig.has(sig)) bySig.set(sig, { value: pick(r), members: [] });
    bySig.get(sig).members.push(r);
  }
  return [...bySig.values()].map(({ value, members }) => {
    const when = [];
    for (const a of axes) {
      const present = new Set(members.map((m) => m.props[a]));
      if (present.size < valuesByAxis[a].size) when.push(`${a}=${[...present].join("|")}`);
    }
    return { when: when.length ? when.join(", ") : "*", ...(typeof value === "object" && !Array.isArray(value) ? value : { value }) };
  });
}

// ---- фокус-кольцо
const ringInst = first.findOne((n) => n.name === "focus-ring")
  || variants.map((v) => v.findOne((n) => n.name === "focus-ring")).find(Boolean);
let focusRing = null;
if (ringInst) {
  const m = ringInst.type === "INSTANCE" ? ringInst.mainComponent : null;
  const kind = m && m.name.match(/Kind=(\w+)/);
  const scale = m && m.name.match(/Scale=(\w+)/);
  focusRing = {
    kind: kind ? kind[1] : null,
    scale: scale ? scale[1] : null,
    strokeWeight: ringInst.strokeWeight,
    of: m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : null,
  };
}

return JSON.stringify({
  $schema: "inta port spec v1",
  component: root.name,
  capturedAt: new Date().toISOString().slice(0, 10),
  figma: {
    fileKey: "uUb84csG4wOfbUjB38ODiz",
    page: "Components",
    setId: root.id,
    sectionId: root.parent ? root.parent.id : null,
    variantCount: variants.length,
    defaultVariant: root.type === "COMPONENT_SET" && root.defaultVariant ? root.defaultVariant.name : null,
    layoutSignature: null, // заполняет scripts/port-spec-save.mjs из figma/layout.json
  },
  properties,
  layers,
  geometry: group((r) => r.geometry),
  tokens: group((r) => r.tokens),
  radius: group((r) => ({ corners: r.corners })),
  focusRing,
});
