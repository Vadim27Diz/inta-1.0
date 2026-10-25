// Run with Figma MCP `use_figma` (Plugin API). Load the /figma-use skill first. READ-ONLY.
// Proof for "add-only" edits (references/figma.md → «Добавление токенов в существующий файл»):
// one canonical line per variable and text style → djb2 hash per collection + one for styles.
// Run before the add-only script, then again after with EXCLUDE = [...new names]: every hash must match.
// Counters are not enough — they don't see a changed value, scope or code syntax.

const EXCLUDE = []; // names created by the add-only run; excluded so the "after" hashes stay comparable

const djb2 = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(16); };
const hex = ({ r, g, b, a }) => { const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0"); return `#${h(r)}${h(g)}${h(b)}${a === undefined || a === 1 ? "" : h(a)}`; };

// Один getLocalVariablesAsync() вместо getVariableByIdAsync() на каждую переменную — те же данные
// без 267 последовательных IPC-раундтрипов (gotchas /figma-use → «Sequential awaits»). Набор
// канонических строк и, значит, хеши от этой правки не меняются: ниже те же объекты.
const allVars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(allVars.map((v) => [v.id, v]));
const nameById = new Map(allVars.map((v) => [v.id, v.name]));
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const out = { collections: {}, counts: {} };

for (const c of collections) {
  const modeName = Object.fromEntries(c.modes.map((m) => [m.modeId, m.name]));
  const lines = [];
  for (const id of c.variableIds) {
    const v = byId.get(id);
    // не «пропустить тихо»: пропуск изменил бы набор канонических строк и, значит, хеш —
    // а хеш здесь и есть доказательство «ничего не задели».
    if (!v) throw new Error(`${c.name}: variable ${id} not in getLocalVariablesAsync()`);
    if (EXCLUDE.includes(v.name)) continue;
    const values = Object.entries(v.valuesByMode)
      .map(([modeId, raw]) => [modeName[modeId], raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS"
        ? `->${nameById.get(raw.id) || raw.id}` : v.resolvedType === "COLOR" ? hex(raw) : String(raw)])
      .sort((a, b) => a[0].localeCompare(b[0])).map(([m, x]) => `${m}=${x}`).join(",");
    lines.push([v.name, v.resolvedType, values, [...v.scopes].sort().join("+"), v.codeSyntax.WEB || "", v.description || ""].join("|"));
  }
  lines.sort();
  out.collections[c.name] = djb2(lines.join("\n"));
  out.counts[c.name] = lines.length;
}

const styleLines = (await figma.getLocalTextStylesAsync()).map((s) => {
  const b = s.boundVariables || {};
  const ref = (k) => (b[k] ? nameById.get(b[k].id) || b[k].id : "");
  return [s.name, `${s.fontName.family} ${s.fontName.style}`, s.fontSize, `${s.lineHeight.unit}:${s.lineHeight.value}`,
    `${s.letterSpacing.unit}:${s.letterSpacing.value}`, ["fontFamily", "fontSize", "lineHeight", "fontWeight"].map(ref).join(">")].join("|");
}).sort();
out.textStyles = djb2(styleLines.join("\n"));
out.counts.textStyles = styleLines.length;

const effectLines = (await figma.getLocalEffectStylesAsync()).map((s) =>
  [s.name, s.effects.map((e) => `${e.type}:${e.color ? hex(e.color) : ""}:${e.offset ? `${e.offset.x},${e.offset.y}` : ""}:${e.radius}:${e.spread}`).join(";")].join("|")).sort();
out.effectStyles = djb2(effectLines.join("\n"));
out.counts.effectStyles = effectLines.length;

return out;
