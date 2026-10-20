#!/usr/bin/env node
// Скриншоты историй Storybook в четырёх комбинациях бренд × тема, 1x, в visual.local/.
//
//   npm run visual                  — собрать Storybook и снять список историй ниже
//   npm run visual -- --dev         — взять уже запущенный storybook dev на :6006
//   npm run visual -- --no-build    — не пересобирать, снять по готовому storybook-static/
//   npm run visual -- --story components/input--states   — только одна история
//
// Снимок делается с #storybook-root, то есть с тем же фоном bg-surface, что и в превью.
// Бренд и тема передаются глобалами Storybook (?globals=brand:demo;theme:dark) — ровно то же,
// что делает тулбар, поэтому проверяется настоящий путь переключения, а не отдельная обёртка.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(repo, "visual.local");
const STATIC = path.join(repo, "storybook-static");
const PORT = 6007;

const STORIES = [
  "components-button--variants",
  "components-button--states",
  "components-label--variants",
  "components-label--states",
  "components-label--content",
  "components-input--variants",
  "components-input--states",
  "components-input--content",
  "components-textarea--variants",
  "components-textarea--states",
  "components-textarea--content",
  "components-checkbox--variants",
  "components-checkbox--states",
  "components-checkbox--content",
  "components-radiogroup--states",
  "components-radiogroup--content",
  "components-switch--variants",
  "components-switch--states",
  "components-switch--content",
  "components-badge--variants",
  "components-badge--content",
  "components-separator--variants",
  "components-separator--content",
  "components-kbd--variants",
  "components-kbd--content",
  "components-spinner--variants",
  "components-spinner--content",
  "components-skeleton--variants",
  "components-skeleton--content",
  "components-field--variants",
  "components-field--states",
  "components-field--content",
  "components-input-group--variants",
  "components-input-group--states",
  "components-input-group--content",
  "components-input-otp--variants",
  "components-input-otp--states",
  "components-input-otp--content",
  "components-native-select--variants",
  "components-native-select--states",
  "components-native-select--content",
  "components-select--variants",
  "components-select--states",
  "components-select--content",
  "components-toggle--variants",
  "components-toggle--states",
  "components-toggle--content",
  "components-toggle-group--variants",
  "components-toggle-group--states",
  "components-toggle-group--content",
  "components-button-group--variants",
  "components-button-group--states",
  "components-button-group--content",
  "components-slider--variants",
  "components-slider--states",
  "components-slider--content",
  "components-progress--variants",
  "components-progress--states",
  "components-progress--content",
  "components-typography--variants",
  "components-typography--content",
  "components-avatar--variants",
  "components-avatar--states",
  "components-avatar--content",
  "components-avatar--badge",
  "components-avatar--group",
  "components-item--variants",
  "components-item--states",
  "components-item--content",
  "components-empty--variants",
  "components-empty--content",
  "components-card--variants",
  "components-card--content",
  "components-alert--variants",
  "components-alert--content",
  "components-aspect-ratio--default",
  "components-breadcrumb--default",
  "components-collapsible--default",
];
const COMBOS = [
  { brand: "main", theme: "light" },
  { brand: "main", theme: "dark" },
  { brand: "demo", theme: "light" },
  { brand: "demo", theme: "dark" },
];

const args = process.argv.slice(2);
const useDev = args.includes("--dev");
const only = args.includes("--story") ? args[args.indexOf("--story") + 1] : null;
const stories = only ? [only] : STORIES;

let base, server;
if (useDev) {
  base = "http://localhost:6006";
} else {
  if (!args.includes("--no-build")) {
    console.log("storybook build…");
    execFileSync("npx", ["storybook", "build", "--quiet"], { cwd: repo, stdio: "inherit" });
  }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
  server = http.createServer((req, res) => {
    const file = path.join(STATIC, decodeURIComponent(req.url.split("?")[0]));
    const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, "index.html") : file;
    if (!fs.existsSync(target)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": types[path.extname(target)] || "application/octet-stream" });
    fs.createReadStream(target).pipe(res);
  });
  await new Promise((r) => server.listen(PORT, r));
  base = `http://localhost:${PORT}`;
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
const made = [];
for (const id of stories) {
  for (const c of COMBOS) {
    const url = `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=brand:${c.brand};theme:${c.theme}`;
    await page.goto(url, { waitUntil: "load" });
    await page.waitForSelector("#storybook-root > *", { timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    // storybook-addon-pseudo-states навешивает классы pseudo-* после первого кадра:
    // без ожидания состояния hover/focus не попадают в снимок
    await page.waitForTimeout(500);
    const file = path.join(OUT, `${id}__${c.brand}-${c.theme}.png`);
    await page.locator("#storybook-root").screenshot({ path: file });
    made.push(path.relative(repo, file));
  }
}
await browser.close();
if (server) server.close();
console.log(`\n${made.length} снимков в visual.local/`);
for (const f of made) console.log(`  ${f}`);
