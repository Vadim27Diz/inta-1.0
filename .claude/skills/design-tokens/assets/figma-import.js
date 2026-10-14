// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first.
// Creates or updates variable collections + text styles from tokens.seed.json (same shape as figma-export.js output).
// Paste the seed JSON into SEED. Large file? Run once per collection, in order:
// Primitives → Brand → Theme → Component, then TEXT_STYLES = true. Aliases resolve by name against what already exists.

const SEED = /* PASTE tokens.seed.json HERE */ null;
const ONLY = ["Primitives", "Brand", "Theme", "Component"]; // narrow to one collection per run if needed
const TEXT_STYLES = true;

const PREFIX = SEED.prefix || "ds";
const cssName = (n) => `--${PREFIX}-${n.replace(/\/default$/, "").replace(/\//g, "-")}`;

function scopesFor(collection, name, type) {
  if (collection === "Primitives") return [];              // hidden from every picker: designers can't use raw values
  if (collection === "Brand" && name.startsWith("brand/")) return []; // brand ramps feed Theme only
  if (type === "STRING") return ["FONT_FAMILY"];
  if (name.startsWith("radius/")) return ["CORNER_RADIUS"];
  if (type !== "COLOR") return [];
  const leaf = name.split("/").slice(-2).join("/");
  if (/border|focus-ring/.test(name)) return ["STROKE_COLOR"];
  if (/(^|\/)on-|link/.test(leaf)) return ["TEXT_FILL", "SHAPE_FILL", "STROKE_COLOR"]; // text + icons
  return ["FRAME_FILL", "SHAPE_FILL"];
}
const primitiveScopes = (name) =>
  name.startsWith("spacing/") ? ["GAP", "WIDTH_HEIGHT"] :
  name.endsWith("/size") ? ["FONT_SIZE"] :
  name.endsWith("/line-height") ? ["LINE_HEIGHT"] :
  name.startsWith("font-weight/") ? ["FONT_WEIGHT"] :
  name.startsWith("radius/") ? ["CORNER_RADIUS"] : [];

function hexToRgba(hex) {
  const h = hex.replace("#", "");
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
}

const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = new Map(allVars.map((v) => [v.name, v]));
const log = [];

for (const c of SEED.collections.filter((c) => ONLY.includes(c.name))) {
  let col = existingCollections.find((x) => x.name === c.name) || figma.variables.createVariableCollection(c.name);
  // modes: rename the first, add the rest
  const modeIds = {};
  c.modes.forEach((m, i) => {
    const found = col.modes.find((x) => x.name === m);
    if (found) modeIds[m] = found.modeId;
    else if (i === 0 && col.modes.length === 1 && !c.modes.includes(col.modes[0].name)) { col.renameMode(col.modes[0].modeId, m); modeIds[m] = col.modes[0].modeId; }
    else modeIds[m] = col.addMode(m); // fails on plans without multiple modes — tell the human
  });
  if (c.hiddenFromPublishing) col.hiddenFromPublishing = true;

  for (const t of c.variables) {
    let v = byName.get(t.name);
    if (!v) { v = figma.variables.createVariable(t.name, col, t.type); byName.set(t.name, v); }
    for (const [mode, raw] of Object.entries(t.valuesByMode)) {
      let value;
      if (raw && typeof raw === "object" && "alias" in raw) {
        const target = byName.get(raw.alias);
        if (!target) { log.push(`MISSING alias ${raw.alias} for ${t.name}`); continue; }
        value = figma.variables.createVariableAlias(target);
      } else value = t.type === "COLOR" ? hexToRgba(raw) : raw;
      v.setValueForMode(modeIds[mode], value);
    }
    v.scopes = c.name !== "Primitives" ? scopesFor(c.name, t.name, t.type)
      : t.type === "COLOR" ? []                       // raw colors: never pickable
      : t.type === "STRING" ? ["FONT_FAMILY"]
      : primitiveScopes(t.name);                      // spacing / text / weight / radius scales stay pickable
    if (t.description) v.description = t.description;
    v.setVariableCodeSyntax("WEB", `var(${cssName(t.name)})`);
  }
  log.push(`${c.name}: ${c.variables.length} variables, modes ${c.modes.join("/")}`);
}

if (TEXT_STYLES && SEED.textStyles) {
  const styles = await figma.getLocalTextStylesAsync();
  const firstModeValue = (name) => { const v = byName.get(name); const m = Object.keys(v.valuesByMode)[0]; return v.valuesByMode[m]; };
  for (const s of SEED.textStyles) {
    const style = styles.find((x) => x.name === s.name) || figma.createTextStyle();
    style.name = s.name;
    const weight = firstModeValue(s.fontWeight);
    const styleName = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold" }[weight] || "Regular";
    const fam = byName.get(s.fontFamily);
    const famValue = typeof firstModeValue(s.fontFamily) === "string" ? firstModeValue(s.fontFamily) : "Inter";
    try { await figma.loadFontAsync({ family: famValue, style: styleName }); style.fontName = { family: famValue, style: styleName }; }
    catch (e) { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); style.fontName = { family: "Inter", style: "Regular" }; log.push(`font ${famValue} ${styleName} not available — used Inter Regular for ${s.name}`); }
    style.setBoundVariable("fontFamily", fam);
    style.setBoundVariable("fontSize", byName.get(s.fontSize));
    style.setBoundVariable("lineHeight", byName.get(s.lineHeight));
    style.setBoundVariable("fontWeight", byName.get(s.fontWeight));
    style.letterSpacing = { unit: "PERCENT", value: (s.letterSpacingEm || 0) * 100 };
  }
  log.push(`text styles: ${SEED.textStyles.length}`);
}
return log.join("\n");
