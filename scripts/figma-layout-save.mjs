#!/usr/bin/env node
// Сохраняет снимок раскладки (JSON, который возвращает figma-layout-export.js через use_figma) в
// figma/layout.json. Всегда через этот скрипт, не руками — он проставляет exporterHash (хеш
// ТЕКУЩЕГО figma-layout-export.js), чтобы npm run figma:layout падал, если экспортёр поправили
// после снимка (см. комментарий в начале figma-layout-check.mjs).
//
//   node scripts/figma-layout-save.mjs < snapshot.json
//   node scripts/figma-layout-save.mjs snapshot.json
//   node scripts/figma-layout-save.mjs snapshot.json figma/layout.json   # нестандартный путь
import fs from "node:fs";

const EXPORTER_PATH = ".claude/skills/design-tokens/assets/figma-layout-export.js";
const [inArg, outArg] = process.argv.slice(2);
const out = outArg || "figma/layout.json";

const raw = inArg ? fs.readFileSync(inArg, "utf8") : fs.readFileSync(0, "utf8");
const data = JSON.parse(raw);

const djb2 = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(16); };
// Хеш данных — ДО exporterHash, чтобы совпадать с тем, что печатает use_figma-вызов (он не знает
// про exporterHash) и с `node scripts/figma-layout-check.mjs --hash` (тот же порядок там).
const dataHash = djb2(JSON.stringify(data));
data.exporterHash = djb2(fs.readFileSync(EXPORTER_PATH, "utf8"));

fs.writeFileSync(out, JSON.stringify(data));
console.log(`сохранено ${out} · данные ${dataHash} · exporterHash ${data.exporterHash}`);
