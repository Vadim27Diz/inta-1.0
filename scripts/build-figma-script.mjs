#!/usr/bin/env node
// Собирает скрипт для use_figma из блоков по секциям — замена редактированию одного огромного
// figma-foundations.js/figma-playground.js целиком. Правка одного фрейма/секции — правка одного
// файла в .claude/skills/design-tokens/assets/figma-<блок>/NN-название.js (десятки строк, не
// сотни); сборка — эта команда, результат — готовый скрипт, целиком вставляется в use_figma один
// раз (страница чистится вся за один прогон — частичный запуск не поддерживается ни одним из
// генераторов, см. .claude/skills/figma-script-build/SKILL.md).
//
//   node scripts/build-figma-script.mjs foundations            # печатает в stdout
//   node scripts/build-figma-script.mjs foundations --out /tmp/foundations.build.js
//   node scripts/build-figma-script.mjs playground --out /tmp/playground.build.js
//
// Блоки склеиваются в порядке имён файлов (00-shared.js первым — там общие helper'ы и данные),
// через пустую строку между ними. Результат побайтово совпадает с тем, что раньше жило одним
// файлом (см. коммит разбиения) — сборка не меняет поведение, только место правки.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "..", ".claude", "skills", "design-tokens", "assets");

const KNOWN = ["foundations", "playground"];
const [block, ...rest] = process.argv.slice(2);
if (!KNOWN.includes(block)) {
  console.error(`нужен блок: ${KNOWN.join(" | ")}`);
  process.exit(1);
}
let out = null;
const outFlag = rest.indexOf("--out");
if (outFlag !== -1) out = rest[outFlag + 1];

const dir = path.join(ASSETS, `figma-${block}`);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort();
if (files.length === 0) {
  console.error(`нет блоков в ${dir}`);
  process.exit(1);
}
const script = files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");

if (out) {
  fs.writeFileSync(out, script);
  console.error(`${files.length} блок(ов) → ${out} (${script.length} байт)`);
} else {
  process.stdout.write(script);
}
