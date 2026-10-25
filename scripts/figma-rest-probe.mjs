#!/usr/bin/env node
// Пробник Figma REST: отвечает на единственный вопрос, который нельзя было решить по докам —
// отдаёт ли REST поддерево INSTANCE и скрытые узлы (аналог figma.skipInvisibleInstanceChildren
// = false в Plugin API), и присутствуют ли поля, которые читает figma-layout-export.js.
//
//   npm run figma:probe                 # страница Components
//   node scripts/figma-rest-probe.mjs 637:1285    # конкретные узлы через запятую
//
// Токен берётся из .env.local (FIGMA_TOKEN, FIGMA_FILE_KEY) — файл под *.local в .gitignore.
// Сырой ответ кладётся в figma/cache.local/ (тоже игнорируется) — чтобы порт экспортёра можно
// было отлаживать на реальном фикстуре, а не ходить в сеть на каждый прогон.
import fs from "node:fs";
import path from "node:path";

const ENV = ".env.local";
if (fs.existsSync(ENV)) {
  for (const line of fs.readFileSync(ENV, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
const TOKEN = process.env.FIGMA_TOKEN;
const KEY = process.env.FIGMA_FILE_KEY;
if (!TOKEN || !KEY) {
  console.error(`нет FIGMA_TOKEN/FIGMA_FILE_KEY (${ENV} или переменные среды)`);
  process.exit(1);
}

const CACHE = "figma/cache.local";
const api = async (url) => {
  const r = await fetch(url, { headers: { "X-Figma-Token": TOKEN } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText} — ${url}`);
  return r.json();
};

// 1. страницы одним дешёвым запросом (depth=1 — только верхний уровень)
const file = await api(`https://api.figma.com/v1/files/${KEY}?depth=1`);
const pages = (file.document.children || []).map((p) => ({ id: p.id, name: p.name }));
console.log(`файл: ${file.name} · version ${file.version}`);
console.log(`страницы: ${pages.map((p) => `${p.name} (${p.id})`).join(", ")}`);

const arg = process.argv[2];
const target = arg || (pages.find((p) => p.name === "Components") || {}).id;
if (!target) { console.error("нет страницы Components и не передан id узла"); process.exit(1); }

// 2. поддерево целиком
const t0 = Date.now();
const res = await api(`https://api.figma.com/v1/files/${KEY}/nodes?ids=${encodeURIComponent(target)}`);
const ms = Date.now() - t0;
fs.mkdirSync(CACHE, { recursive: true });
const out = path.join(CACHE, `nodes-${target.replace(/[^\w.-]/g, "_")}.json`);
fs.writeFileSync(out, JSON.stringify(res));
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`\nвыгружено ${target}: ${kb} КБ за ${ms} мс → ${out}`);

// 3. обход и подсчёт
const stats = {
  nodes: 0, instances: 0, instancesWithChildren: 0, hidden: 0, hiddenInsideInstance: 0,
  componentSets: 0, texts: 0,
};
const fields = {
  isExposedInstance: 0, exposedInstances: 0, componentPropertyReferences: 0,
  componentPropertyDefinitions: 0, layoutSizingHorizontal: 0, layoutPositioning: 0,
  clipsContent: 0, absoluteRenderBounds: 0, absoluteBoundingBox: 0, rectangleCornerRadii: 0,
  strokeWeight: 0, maxLines: 0, textTruncation: 0, strokesIncludedInLayout: 0,
  componentId: 0, relativeTransform: 0, size: 0, boundVariables: 0,
};
let boundRadius = 0, boundFill = 0;

const walk = (n, insideInstance) => {
  stats.nodes++;
  if (n.type === "INSTANCE") { stats.instances++; if ((n.children || []).length) stats.instancesWithChildren++; }
  if (n.type === "COMPONENT_SET") stats.componentSets++;
  if (n.type === "TEXT") stats.texts++;
  if (n.visible === false) { stats.hidden++; if (insideInstance) stats.hiddenInsideInstance++; }
  for (const f of Object.keys(fields)) if (n[f] !== undefined) fields[f]++;
  const bv = n.boundVariables || {};
  if (bv.topLeftRadius || bv.bottomLeftRadius) boundRadius++;
  if (bv.fills) boundFill++;
  for (const c of n.children || []) walk(c, insideInstance || n.type === "INSTANCE");
};
for (const k of Object.keys(res.nodes)) walk(res.nodes[k].document, false);

console.log(`\nузлов ${stats.nodes} · наборов ${stats.componentSets} · текстов ${stats.texts}`);
console.log(`ИНСТАНСЫ: ${stats.instances}, из них с раскрытыми детьми ${stats.instancesWithChildren}` +
  ` → поддерево INSTANCE ${stats.instancesWithChildren ? "РАСКРЫВАЕТСЯ" : "НЕ раскрывается"}`);
console.log(`СКРЫТЫЕ (visible:false): ${stats.hidden}, из них внутри инстансов ${stats.hiddenInsideInstance}` +
  ` → скрытые узлы ${stats.hidden ? "ВИДНЫ" : "НЕ видны"}`);
console.log(`привязки переменных: радиусы на ${boundRadius} узлах, заливки на ${boundFill}`);
console.log("\nполя (сколько узлов их имеют):");
for (const [k, v] of Object.entries(fields).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${v ? "✓" : "✗"} ${k.padEnd(30)} ${v}`);
}
