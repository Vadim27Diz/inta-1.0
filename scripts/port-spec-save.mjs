#!/usr/bin/env node
// Сохраняет спек компонента (JSON, который возвращает assets/figma-spec-export.js через use_figma)
// в docs/internal/specs/<slug>.json. Всегда через этот скрипт, не руками — он добавляет
// layoutSignature из figma/layout.json и печатает сводку (как figma-layout-save.mjs добавляет
// exporterHash).
//
//   node scripts/port-spec-save.mjs tab < spec.json
//   node scripts/port-spec-save.mjs tab spec.json
import fs from "node:fs";
import path from "node:path";

const [slug, inArg] = process.argv.slice(2);
if (!slug) {
  console.error("нужен slug: node scripts/port-spec-save.mjs <slug> [файл]");
  process.exit(1);
}

const raw = inArg ? fs.readFileSync(inArg, "utf8") : fs.readFileSync(0, "utf8");
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error(`вход не JSON: ${e.message}`);
  process.exit(1);
}
if (!data.component || !Array.isArray(data.properties)) {
  console.error("это не спек: нет полей component/properties (ожидается вывод figma-spec-export.js)");
  process.exit(1);
}

const djb2 = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(16); };

// layoutSignature — хеш строки набора и его секции из снимка раскладки. Ловит структурные правки
// набора (размер, состав секции); цветовые правки внутри варианта ловит figma:diff.
const LAYOUT = "figma/layout.json";
let signature = null;
if (fs.existsSync(LAYOUT)) {
  const layout = JSON.parse(fs.readFileSync(LAYOUT, "utf8"));
  const section = (layout.sections || []).find((s) =>
    (s.c || []).some((c) => c[0] === data.component && (c[1] === "COMPONENT_SET" || c[1] === "COMPONENT")));
  if (section) signature = djb2(JSON.stringify(section));
  else console.log(`⚠ ${data.component} нет в ${LAYOUT} — снимок устарел либо набор собран после него; layoutSignature=null`);
} else {
  console.log(`⚠ нет ${LAYOUT} — layoutSignature=null`);
}
data.figma = { ...(data.figma || {}), layoutSignature: signature };

const out = path.join("docs/internal/specs", `${slug}.json`);
const existed = fs.existsSync(out);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");

const rows = (k) => (Array.isArray(data[k]) ? data[k].length : 0);
console.log(
  `${existed ? "перезаписан" : "сохранён"} ${out} · ${Math.round(fs.statSync(out).size / 1024)} КБ · ` +
  `${data.component}: вариантов ${data.figma.variantCount ?? "?"} → строк geometry ${rows("geometry")}, ` +
  `tokens ${rows("tokens")}, radius ${rows("radius")} · layoutSignature ${signature ?? "null"}`,
);
console.log("дальше: строку компонента в docs/internal/port-queue.md перевести в spec-captured → queued (только через Edit)");
