#!/usr/bin/env node
// Цифровая сверка Figma ↔ код для контролов группы 1.
//
//   node scripts/figma-code-diff.mjs [--no-build]
//
// Слева — числа из Figma (геометрия вариантов и имена привязанных переменных,
// прочитанные через Figma MCP и зафиксированные в EXPECT).
// Справа — то, что реально считает Chrome на собранном Storybook: getComputedStyle
// у настоящего элемента в каждой из четырёх комбинаций бренд × тема.
// Цвета не хардкодим: ожидание — значение CSS-переменной в том же документе,
// поэтому проверяется именно «класс ведёт к токену», а не совпадение с хексом Main/Light.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = path.join(repo, "storybook-static");
const PORT = 6009;

// px — число из Figma; token — имя CSS-переменной, значение которой должно совпасть
const EXPECT = [
  { story: "components-input--variants", title: "Input", probes: [
    { sel: "input:nth-of-type(1)", at: 0, name: "sm value",      height: 32, padX: 12, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [14, 20, 400] },
    { sel: "input", at: 2, name: "md value",                     height: 36, padX: 16, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [14, 20, 400] },
    { sel: "input", at: 4, name: "lg value",                     height: 40, padX: 16, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [16, 24, 400] },
  ] },
  { story: "components-input--states", title: "Input states", probes: [
    { sel: "input", at: 0, name: "default",       height: 36, padX: 16, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface" },
    { sel: "input", at: 2, name: "focus",         height: 36, border: "--ds-color-border-input", outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "input", at: 3, name: "invalid",       height: 36, border: "--ds-color-danger" },
    { sel: "input", at: 4, name: "invalid+focus", height: 36, border: "--ds-color-danger", outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "input", at: 5, name: "disabled",      height: 36, bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
  ] },
  { story: "components-textarea--states", title: "Textarea", probes: [
    { sel: "textarea", at: 0, name: "default",       minHeight: 64, padX: 12, padY: 8, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [14, 20, 400] },
    { sel: "textarea", at: 2, name: "focus",         outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "textarea", at: 3, name: "invalid",       border: "--ds-color-danger" },
    { sel: "textarea", at: 5, name: "disabled",      bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
  ] },
  { story: "components-label--variants", title: "Label", probes: [
    { sel: "label", at: 0, name: "default",  height: 20, color: "--ds-color-on-surface", font: [14, 20, 500], gap: 4 },
    { sel: "label", at: 1, name: "required", height: 20, color: "--ds-color-on-surface", font: [14, 20, 500], gap: 4, markColor: "--ds-color-on-surface-danger" },
  ] },
];
const COMBOS = [
  { brand: "main", theme: "light" },
  { brand: "main", theme: "dark" },
  { brand: "demo", theme: "light" },
  { brand: "demo", theme: "dark" },
];

const args = process.argv.slice(2);
if (!args.includes("--no-build")) execFileSync("npx", ["storybook", "build", "--quiet"], { cwd: repo, stdio: "inherit" });
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const f = path.join(STATIC, decodeURIComponent(req.url.split("?")[0]));
  const t = fs.existsSync(f) && fs.statSync(f).isDirectory() ? path.join(f, "index.html") : f;
  if (!fs.existsSync(t)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(t)] || "application/octet-stream" });
  fs.createReadStream(t).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
const rows = [];
for (const group of EXPECT) {
  for (const c of COMBOS) {
    await page.goto(`http://localhost:${PORT}/iframe.html?id=${group.story}&viewMode=story&globals=brand:${c.brand};theme:${c.theme}`, { waitUntil: "load" });
    await page.waitForSelector("#storybook-root > *", { timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const measured = await page.evaluate((probes) => {
      const root = document.documentElement;
      const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();
      const toPx = (v) => (v.endsWith("px") ? parseFloat(v) : parseFloat(v));
      const rgb = (v) => { const d = document.createElement("div"); d.style.color = v; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
      // размеры токенов объявлены в rem — переводим в px так же, как это делает браузер
      const px = (v) => { const d = document.createElement("div"); d.style.width = v; document.body.appendChild(d); const w = getComputedStyle(d).width; d.remove(); return parseFloat(w); };
      return probes.map((p) => {
        const el = document.querySelectorAll(p.sel)[p.at];
        if (!el) return { missing: true };
        const s = getComputedStyle(el);
        const mark = el.querySelector("span[aria-hidden]");
        return {
          height: el.getBoundingClientRect().height,
          minHeight: toPx(s.minHeight),
          padLeft: toPx(s.paddingLeft), padRight: toPx(s.paddingRight),
          padTop: toPx(s.paddingTop), padBottom: toPx(s.paddingBottom),
          radius: toPx(s.borderTopLeftRadius),
          borderColor: s.borderTopColor, borderWidth: toPx(s.borderTopWidth),
          color: s.color, bg: s.backgroundColor,
          outlineColor: s.outlineColor, outlineWidth: toPx(s.outlineWidth), outlineStyle: s.outlineStyle, outlineOffset: toPx(s.outlineOffset),
          fontSize: toPx(s.fontSize), lineHeight: toPx(s.lineHeight), fontWeight: Number(s.fontWeight), fontFamily: s.fontFamily.split(",")[0].replace(/["']/g, ""),
          gap: toPx(s.columnGap),
          markColor: mark ? getComputedStyle(mark).color : null,
          vars: Object.fromEntries([...new Set(probes.flatMap((x) => [x.radius, x.border, x.color, x.bg, x.outline, x.markColor].filter(Boolean)))].map((n) => [n, n.includes("color") ? rgb(cssVar(n)) : String(px(cssVar(n)))])),
        };
      });
    }, group.probes);

    group.probes.forEach((p, i) => {
      const m = measured[i];
      const checks = [];
      const eq = (label, got, want) => checks.push({ label, got, want, ok: got === want });
      const near = (label, got, want) => checks.push({ label, got, want, ok: Math.abs(got - want) < 0.51 });
      if (m.missing) { rows.push({ group: group.title, combo: `${c.brand}/${c.theme}`, probe: p.name, checks: [{ label: "элемент", got: "нет", want: p.sel, ok: false }] }); return; }
      if (p.height != null) near("height", m.height, p.height);
      if (p.minHeight != null) near("min-height", m.minHeight, p.minHeight);
      if (p.padX != null) { near("padding-x", m.padLeft, p.padX); near("padding-x", m.padRight, p.padX); }
      if (p.padY != null) { near("padding-y", m.padTop, p.padY); near("padding-y", m.padBottom, p.padY); }
      if (p.radius) near("radius", m.radius, parseFloat(m.vars[p.radius]));
      if (p.border) eq("border-color", m.borderColor, m.vars[p.border]);
      if (p.borderTransparent) eq("border-color", m.borderColor, "rgba(0, 0, 0, 0)");
      if (p.bg) eq("background", m.bg, m.vars[p.bg]);
      if (p.color) eq("color", m.color, m.vars[p.color]);
      if (p.markColor) eq("звёздочка", m.markColor, m.vars[p.markColor]);
      if (p.outline) { eq("outline-color", m.outlineColor, m.vars[p.outline]); eq("outline-style", m.outlineStyle, "solid"); near("outline-width", m.outlineWidth, p.outlineWidth); near("outline-offset", m.outlineOffset, p.outlineOffset); }
      if (p.font) { near("font-size", m.fontSize, p.font[0]); near("line-height", m.lineHeight, p.font[1]); near("font-weight", m.fontWeight, p.font[2]); checks.push({ label: "font-family", got: m.fontFamily, want: c.brand === "main" ? "Inter" : "IBM Plex Sans", ok: m.fontFamily === (c.brand === "main" ? "Inter" : "IBM Plex Sans") }); }
      if (p.gap != null) near("gap", m.gap, p.gap);
      rows.push({ group: group.title, combo: `${c.brand}/${c.theme}`, probe: p.name, checks });
    });
  }
}
await browser.close();
server.close();

let bad = 0, total = 0;
let lastGroup = null;
for (const r of rows) {
  if (r.group !== lastGroup) { console.log(`\n=== ${r.group} ===`); lastGroup = r.group; }
  const fails = r.checks.filter((c) => !c.ok);
  total += r.checks.length;
  bad += fails.length;
  const mark = fails.length ? "✗" : "✓";
  console.log(`${mark} ${r.combo.padEnd(11)} ${r.probe.padEnd(14)} ${r.checks.length} проверок${fails.length ? ": " + fails.map((f) => `${f.label} ${f.got} ≠ ${f.want}`).join("; ") : ""}`);
}
console.log(`\n${rows.length} срезов · ${total} проверок · ${bad} расхождений`);
process.exit(bad ? 1 : 0);
