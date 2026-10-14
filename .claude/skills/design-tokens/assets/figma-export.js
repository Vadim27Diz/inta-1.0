// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first.
// Returns tokens JSON in the same shape as tokens.seed.json. Save the returned string to tokens/tokens.json,
// then: npm run tokens:build
// Output is too long for one response? Set ONLY to one collection per run and merge the "collections" arrays.

const ONLY = null; // e.g. ["Theme"]
const PREFIX = "ds";
const ORDER = ["Primitives", "Brand", "Theme", "Component"];

const hex = ({ r, g, b, a }) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}${a === undefined || a === 1 ? "" : h(a)}`;
};

const collections = (await figma.variables.getLocalVariableCollectionsAsync())
  .filter((c) => !ONLY || ONLY.includes(c.name))
  .sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));
const nameById = new Map((await figma.variables.getLocalVariablesAsync()).map((v) => [v.id, v.name]));

const out = { $schema: "ds-kit tokens v1 (Figma-shaped: collections → modes → variables)", prefix: PREFIX, collections: [], textStyles: [] };
const problems = [];

for (const c of collections) {
  const modeName = Object.fromEntries(c.modes.map((m) => [m.modeId, m.name]));
  const vars = [];
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const valuesByMode = {};
    for (const [modeId, raw] of Object.entries(v.valuesByMode)) {
      if (raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS") {
        const target = nameById.get(raw.id);
        if (!target) problems.push(`${v.name}: alias to a variable from another file/library (${raw.id})`);
        valuesByMode[modeName[modeId]] = { alias: target || raw.id };
      } else valuesByMode[modeName[modeId]] = v.resolvedType === "COLOR" ? hex(raw) : raw;
    }
    if (c.name === "Theme" && v.resolvedType === "COLOR" && Object.values(valuesByMode).some((x) => typeof x === "string"))
      problems.push(`${v.name}: raw color in Theme — must be an alias to Brand/Primitives`);
    const t = { name: v.name, type: v.resolvedType, valuesByMode };
    if (v.description) t.description = v.description;
    vars.push(t);
  }
  const col = { name: c.name, modes: c.modes.map((m) => m.name), variables: vars };
  if (c.hiddenFromPublishing) col.hiddenFromPublishing = true;
  out.collections.push(col);
}

for (const s of await figma.getLocalTextStylesAsync()) {
  const b = s.boundVariables || {};
  const ref = (k) => (b[k] ? nameById.get(b[k].id) : null);
  if (!ref("fontSize")) problems.push(`text style ${s.name}: fontSize not bound to a variable`);
  out.textStyles.push({
    name: s.name, fontFamily: ref("fontFamily"), fontSize: ref("fontSize"), lineHeight: ref("lineHeight"), fontWeight: ref("fontWeight"),
    letterSpacingEm: s.letterSpacing.unit === "PERCENT" ? s.letterSpacing.value / 100 : 0,
  });
}

return JSON.stringify({ ...out, _problems: problems });
