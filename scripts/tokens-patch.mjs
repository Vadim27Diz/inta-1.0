#!/usr/bin/env node
// Применяет дельту из assets/figma-export-delta.js к tokens/tokens.json — вместо полной
// перезаписи файла при правке одного-двух токенов. Переменные патчатся по (коллекция, имя),
// текстовые и эффект-стили — по имени; added и changed — upsert, removed — удаление.
//
//   node scripts/tokens-manifest.mjs tokens/tokens.json --out /tmp/tokens-manifest.json
//   # ... вставить манифест в MANIFEST внутри figma-export-delta.js, прогнать через use_figma,
//   # сохранить ответ в /tmp/tokens-delta.json ...
//   node scripts/tokens-patch.mjs tokens/tokens.json /tmp/tokens-delta.json
//   npm run tokens:build
//
// Новая коллекция не создаётся этим скриптом (CLAUDE.md: новый глобальный токен/бренд — только
// после согласования с человеком) — при добавлении переменной в коллекцию, которой нет в файле,
// скрипт предупреждает и пропускает её; заведи коллекцию полным экспортом/вручную.
// Порядок новых переменных внутри коллекции — в конец массива, не на позицию из Figma: для
// добавленных это не важно (порядок важен только для чтения diff'а человеком), следующий полный
// экспорт восстановит порядок Figma, если это понадобится.
import fs from "node:fs";

const [tokensPath, deltaPath] = process.argv.slice(2);
if (!tokensPath || !deltaPath) { console.error("нужны пути: tokens.json delta.json"); process.exit(1); }

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const delta = JSON.parse(fs.readFileSync(deltaPath, "utf8"));

if (delta._problems && delta._problems.length) {
  console.error(`дельта содержит ${delta._problems.length} problem(s) — проверь перед патчем:`);
  for (const p of delta._problems) console.error(`  - ${p}`);
}

const byCollection = new Map(tokens.collections.map((c) => [c.name, c]));
let upserted = 0, removedCount = 0, skipped = 0;

for (const entry of [...(delta.added || []), ...(delta.changed || [])]) {
  const col = byCollection.get(entry.collection);
  if (!col) {
    console.error(`коллекция «${entry.collection}» не найдена в ${tokensPath} — токен ${entry.token.name} пропущен, добавь коллекцию вручную`);
    skipped++;
    continue;
  }
  const i = col.variables.findIndex((v) => v.name === entry.token.name);
  if (i === -1) col.variables.push(entry.token); else col.variables[i] = entry.token;
  upserted++;
}
for (const key of delta.removed || []) {
  const [collectionName, varName] = key.split("::");
  const col = byCollection.get(collectionName);
  if (!col) continue;
  const i = col.variables.findIndex((v) => v.name === varName);
  if (i !== -1) { col.variables.splice(i, 1); removedCount++; }
}

const ts = delta.textStyles || { added: [], changed: [], removed: [] };
tokens.textStyles = tokens.textStyles || [];
for (const t of [...(ts.added || []), ...(ts.changed || [])]) {
  const i = tokens.textStyles.findIndex((x) => x.name === t.name);
  if (i === -1) tokens.textStyles.push(t); else tokens.textStyles[i] = t;
  upserted++;
}
for (const name of ts.removed || []) {
  const i = tokens.textStyles.findIndex((x) => x.name === name);
  if (i !== -1) { tokens.textStyles.splice(i, 1); removedCount++; }
}

const es = delta.effectStyles || { added: [], changed: [], removed: [] };
tokens.effectStyles = tokens.effectStyles || [];
for (const e of [...(es.added || []), ...(es.changed || [])]) {
  const i = tokens.effectStyles.findIndex((x) => x.name === e.name);
  if (i === -1) tokens.effectStyles.push(e); else tokens.effectStyles[i] = e;
  upserted++;
}
for (const name of es.removed || []) {
  const i = tokens.effectStyles.findIndex((x) => x.name === name);
  if (i !== -1) { tokens.effectStyles.splice(i, 1); removedCount++; }
}

fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2) + "\n");
console.error(`патч применён: upsert ${upserted}, removed ${removedCount}, пропущено ${skipped} → ${tokensPath}`);
