// Дельта-экспорт токенов: вместо полного тела каждого токена (assets/figma-export.js, ~92 КБ
// при полном экспорте на момент написания) возвращает только то, что изменилось относительно
// MANIFEST — дайджестов уже закоммиченного tokens/tokens.json (scripts/tokens-manifest.mjs).
// Run with Figma MCP `use_figma`. Load /figma-use first.
//
//   1. node scripts/tokens-manifest.mjs tokens/tokens.json > /tmp/tokens-manifest.json
//   2. вставь содержимое в MANIFEST ниже (замени целиком, как DATA в figma-foundations)
//   3. прогони через use_figma — вернёт { added, changed, removed, textStyles, effectStyles,
//      _problems }, обычно много меньше 92 КБ, если поменялось немного токенов
//   4. сохрани результат в /tmp/tokens-delta.json, затем:
//        node scripts/tokens-patch.mjs tokens/tokens.json /tmp/tokens-delta.json
//   5. npm run tokens:build как обычно — патченный tokens.json тот же формат, что и полный экспорт
//
// Если дельта пустая (added/changed/removed и все три textStyles/effectStyles-поля — []) —
// в Figma ничего не поменялось с последнего коммита tokens.json, патчить не нужно.
// Если дельта велика (переименование коллекции, массовая правка затронула почти все токены) —
// дешевле вернуться к полному assets/figma-export.js: дельта экономит только когда изменилось
// меньшинство токенов, а не большинство.
//
// Новая коллекция сюда не попадает отдельной веткой: добавленные в неё переменные придут в
// `added` как обычно, но scripts/tokens-patch.mjs откажется патчить токен в коллекцию,
// которой нет в tokens.json — новая коллекция создаётся вручную (согласование по CLAUDE.md:
// новый глобальный токен/бренд — только после обсуждения с человеком).

// ===== MANIFEST — вывод scripts/tokens-manifest.mjs, заменять целиком при обновлении =====
const MANIFEST = { "variables": {}, "textStyles": {}, "effectStyles": {} };
// ===== /MANIFEST =====

const PREFIX = "ds";
const ORDER = ["Primitives", "Brand", "Theme", "Component"];
const hex = ({ r, g, b, a }) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}${a === undefined || a === 1 ? "" : h(a)}`;
};
const cssName = (n) => `--${PREFIX}-${n.replace(/\/default$/, "").replace(/\//g, "-")}`;

// Дайджест и канонизация — буквальная копия scripts/tokens-manifest.mjs (нет общего модуля:
// use_figma не поддерживает импорты). Правишь одно — правь другое, иначе дайджесты разойдутся.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
const sortedModes = (vbm) => Object.fromEntries(Object.entries(vbm).sort(([a], [b]) => a.localeCompare(b)));
const canonVar = (t) => JSON.stringify({
  name: t.name, type: t.type, valuesByMode: sortedModes(t.valuesByMode),
  description: t.description || null, scopes: [...(t.scopes || [])].sort(), codeSyntax: t.codeSyntax || null,
});
const canonText = (t) => JSON.stringify({
  name: t.name, fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight,
  fontWeight: t.fontWeight, letterSpacingEm: t.letterSpacingEm, fontName: t.fontName,
});
const canonEffect = (t) => JSON.stringify({ name: t.name, description: t.description || null, effects: t.effects });

// Один getLocalVariablesAsync() вместо getVariableByIdAsync() на каждую переменную — см.
// комментарий в figma-export.js (коммит A1): независимые await в цикле иначе сериализуются.
const collections = (await figma.variables.getLocalVariableCollectionsAsync())
  .sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));
const allVars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(allVars.map((v) => [v.id, v]));
const nameById = new Map(allVars.map((v) => [v.id, v.name]));

const problems = [];
const added = [];
const changed = [];
const seenVarKeys = new Set();

for (const c of collections) {
  const modeName = Object.fromEntries(c.modes.map((m) => [m.modeId, m.name]));
  for (const id of c.variableIds) {
    const v = byId.get(id);
    if (!v) { problems.push(`${c.name}: variable ${id} not in getLocalVariablesAsync() — remote or deleted`); continue; }
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
    t.scopes = [...v.scopes];
    t.codeSyntax = v.codeSyntax.WEB || null;
    if (t.scopes.includes("ALL_SCOPES")) problems.push(`${v.name}: scopes left at ALL_SCOPES — pick real scopes`);
    if (!t.codeSyntax) problems.push(`${v.name}: no WEB code syntax`);
    else if (t.codeSyntax !== `var(${cssName(v.name)})`) problems.push(`${v.name}: code syntax ${t.codeSyntax} != var(${cssName(v.name)})`);

    const key = `${c.name}::${v.name}`;
    seenVarKeys.add(key);
    const digest = hash(canonVar(t));
    const prev = MANIFEST.variables[key];
    if (prev === undefined) added.push({ collection: c.name, token: t });
    else if (prev !== digest) changed.push({ collection: c.name, token: t });
  }
}
const removed = Object.keys(MANIFEST.variables).filter((k) => !seenVarKeys.has(k));

const textAdded = [], textChanged = [], seenText = new Set();
for (const s of await figma.getLocalTextStylesAsync()) {
  const b = s.boundVariables || {};
  const ref = (k) => (b[k] ? nameById.get(b[k].id) : null);
  for (const k of ["fontFamily", "fontSize", "lineHeight", "fontWeight"]) if (!ref(k)) problems.push(`text style ${s.name}: ${k} not bound to a variable`);
  const t = {
    name: s.name, fontFamily: ref("fontFamily"), fontSize: ref("fontSize"), lineHeight: ref("lineHeight"), fontWeight: ref("fontWeight"),
    letterSpacingEm: s.letterSpacing.unit === "PERCENT" ? s.letterSpacing.value / 100 : 0,
    fontName: `${s.fontName.family} ${s.fontName.style}`,
  };
  seenText.add(t.name);
  const digest = hash(canonText(t));
  const prev = MANIFEST.textStyles[t.name];
  if (prev === undefined) textAdded.push(t);
  else if (prev !== digest) textChanged.push(t);
}
const textRemoved = Object.keys(MANIFEST.textStyles).filter((n) => !seenText.has(n));

const effectAdded = [], effectChanged = [], seenEffect = new Set();
for (const s of await figma.getLocalEffectStylesAsync()) {
  const t = {
    name: s.name,
    description: s.description || undefined,
    effects: s.effects.map((e) => ({
      type: e.type, color: e.color ? hex(e.color) : undefined,
      offsetX: e.offset ? e.offset.x : undefined, offsetY: e.offset ? e.offset.y : undefined,
      radius: e.radius, spread: e.spread,
    })),
  };
  seenEffect.add(t.name);
  const digest = hash(canonEffect(t));
  const prev = MANIFEST.effectStyles[t.name];
  if (prev === undefined) effectAdded.push(t);
  else if (prev !== digest) effectChanged.push(t);
}
const effectRemoved = Object.keys(MANIFEST.effectStyles).filter((n) => !seenEffect.has(n));

return JSON.stringify({
  added, changed, removed,
  textStyles: { added: textAdded, changed: textChanged, removed: textRemoved },
  effectStyles: { added: effectAdded, changed: effectChanged, removed: effectRemoved },
  _problems: problems,
});
