#!/usr/bin/env node
// Дайджесты текущего tokens/tokens.json — вход для дельта-экспорта из Figma
// (assets/figma-export-delta.js) и для патча (scripts/tokens-patch.mjs). Без дайджеста
// дельта-экспорт не может узнать, что из Figma совпадает с уже закоммиченным файлом, и был бы
// вынужден тащить все ~92 КБ заново при правке хоть одного токена — как полный
// assets/figma-export.js.
//
//   node scripts/tokens-manifest.mjs tokens/tokens.json > /tmp/tokens-manifest.json
//   node scripts/tokens-manifest.mjs tokens/tokens.json --out /tmp/tokens-manifest.json
//
// Вставь содержимое вывода в MANIFEST в начале assets/figma-export-delta.js. Алгоритм дайджеста
// (FNV-1a) и канонизация объекта токена — буквальная копия того файла: у use_figma нет
// node:crypto и нет импортов, общий код не вынести в модуль. Правишь canonVar/canonText/
// canonEffect здесь — правь то же в figma-export-delta.js, иначе дайджесты разойдутся и дельта
// станет бессмысленной (всё будет казаться изменившимся).
import fs from "node:fs";

const [input, ...rest] = process.argv.slice(2);
if (!input) { console.error("нужен путь к tokens.json"); process.exit(1); }
let out = null;
const outFlag = rest.indexOf("--out");
if (outFlag !== -1) out = rest[outFlag + 1];

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

const tokens = JSON.parse(fs.readFileSync(input, "utf8"));
const manifest = { variables: {}, textStyles: {}, effectStyles: {} };
for (const c of tokens.collections) {
  for (const v of c.variables) manifest.variables[`${c.name}::${v.name}`] = hash(canonVar(v));
}
for (const t of tokens.textStyles || []) manifest.textStyles[t.name] = hash(canonText(t));
for (const e of tokens.effectStyles || []) manifest.effectStyles[e.name] = hash(canonEffect(e));

const json = JSON.stringify(manifest);
if (out) {
  fs.writeFileSync(out, json);
  console.error(`${Object.keys(manifest.variables).length} переменных, ${Object.keys(manifest.textStyles).length} текстовых стилей, ${Object.keys(manifest.effectStyles).length} эффект-стилей → ${out} (${json.length} байт)`);
} else {
  process.stdout.write(json);
}
