// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first.
// Creates or updates variable collections + text styles from tokens.seed.json (same shape as figma-export.js output).
// Paste the seed JSON into SEED. One run per collection, in order:
// Primitives → Brand → Theme → Component, then a separate fifth run with ONLY = [] and TEXT_STYLES = true.
// Text styles must be last: they bind to font/size/weight variables from Primitives and Brand.
// Aliases resolve by name against what already exists in the file.

const SEED = /* PASTE tokens.seed.json HERE */ null;
const ONLY = ["Primitives"]; // one collection per run; [] for the text-styles-only run
const TEXT_STYLES = false;   // true only in the last run

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
const problems = [];

for (const c of (SEED.collections || []).filter((c) => ONLY.includes(c.name))) {
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
        if (!target) { problems.push(`MISSING alias ${raw.alias} for ${t.name}`); continue; }
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
  log.push(`${c.name}: ${c.variables.length} variables, modes ${col.modes.map((m) => m.name).join("/")}`);
}

if (TEXT_STYLES && SEED.textStyles) {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const colById = new Map(cols.map((c) => [c.id, c]));
  const freshVars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map(freshVars.map((v) => [v.name, v]));
  const varById = new Map(freshVars.map((v) => [v.id, v]));
  // every lookup throws by name: a silently missing variable would bind nothing
  const need = (n) => { const v = varByName.get(n); if (!v) throw new Error(`missing variable ${n} — run the Primitives/Brand collections first`); return v; };
  // value in the collection's default mode, aliases followed to the bottom layer
  const defaultValue = (name) => {
    let v = need(name);
    let val = v.valuesByMode[colById.get(v.variableCollectionId).defaultModeId];
    for (let i = 0; i < 10 && val && typeof val === "object" && val.type === "VARIABLE_ALIAS"; i++) {
      v = varById.get(val.id);
      val = v.valuesByMode[colById.get(v.variableCollectionId).defaultModeId];
    }
    return val;
  };
  // every mode's value: binding fontFamily requires the fonts of ALL modes to be loaded (Main + Demo)
  const everyModeValue = (name) => {
    const v = need(name);
    return colById.get(v.variableCollectionId).modes.map((m) => v.valuesByMode[m.modeId]).filter((x) => typeof x === "string");
  };

  // real style names per family: Inter has "Semi Bold" (with a space), IBM Plex has "SemiBold", JetBrains Mono has neither
  const stylesByFamily = {};
  for (const f of await figma.listAvailableFontsAsync()) {
    (stylesByFamily[f.fontName.family] = stylesByFamily[f.fontName.family] || []).push(f.fontName.style);
  }
  const WEIGHT_STYLES = { 100: ["Thin"], 200: ["Extra Light", "ExtraLight"], 300: ["Light"], 400: ["Regular"], 500: ["Medium"], 600: ["Semi Bold", "SemiBold", "Semibold"], 700: ["Bold"], 800: ["Extra Bold", "ExtraBold"], 900: ["Black"] };
  const styleFor = (family, weight) => {
    const avail = stylesByFamily[family] || [];
    const hit = (WEIGHT_STYLES[weight] || []).find((s) => avail.includes(s));
    // never fall back to Regular: a heading that quietly loses its weight is worse than a failed run
    if (!hit) throw new Error(`no ${weight} style for "${family}" — available: ${avail.join(", ") || "font not installed"}`);
    return hit;
  };

  const needed = new Set();
  for (const s of SEED.textStyles) {
    const weight = defaultValue(s.fontWeight);
    for (const fam of everyModeValue(s.fontFamily)) needed.add(JSON.stringify({ family: fam, style: styleFor(fam, weight) }));
  }
  await Promise.all([...needed].map((f) => figma.loadFontAsync(JSON.parse(f))));

  const styles = await figma.getLocalTextStylesAsync();
  for (const s of SEED.textStyles) {
    const style = styles.find((x) => x.name === s.name) || figma.createTextStyle();
    style.name = s.name;
    const family = defaultValue(s.fontFamily);
    style.fontName = { family, style: styleFor(family, defaultValue(s.fontWeight)) };
    style.setBoundVariable("fontFamily", need(s.fontFamily));
    style.setBoundVariable("fontSize", need(s.fontSize));
    style.setBoundVariable("lineHeight", need(s.lineHeight));
    style.setBoundVariable("fontWeight", need(s.fontWeight));
    style.letterSpacing = { unit: "PERCENT", value: (s.letterSpacingEm || 0) * 100 };
  }
  log.push(`text styles: ${SEED.textStyles.length}, fonts loaded: ${[...needed].map((f) => { const x = JSON.parse(f); return `${x.family} ${x.style}`; }).join(", ")}`);
}

return { log, problems };
