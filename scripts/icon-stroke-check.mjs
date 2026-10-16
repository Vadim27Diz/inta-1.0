#!/usr/bin/env node
// Толщина линии иконки в настоящем Chrome: lucide-react рендерится react-dom/server,
// разметка открывается в Chromium (playwright) и меряется двумя независимыми способами.
//
//   node scripts/icon-stroke-check.mjs [12 16 20 24 32 40]
//
// Глиф `minus` — одна горизонтальная линия, поэтому толщина = высота закрашенной полосы.
// getBoundingClientRect для этого не годится: Chrome отдаёт геометрию пути БЕЗ обводки
// (у горизонтальной линии высота 0). Поэтому меряем:
//   1. hit-test: path.isPointInStroke — сам движок говорит, попадает ли точка в обводку;
//      двоичным поиском находим верх и низ полосы в user space и умножаем на масштаб CTM;
//   2. пиксели: скриншот элемента, сумма непрозрачности по столбцу = толщина в px.
// Эти же числа должны стоять в Figma у слоя Vector внутри Icon Size=N (2 × size/24).
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Minus } from "lucide-react";

const args = process.argv.slice(2).map(Number).filter(Boolean);
const SIZES = args.length ? args : [12, 16, 20, 24, 32, 40];

const markup = SIZES.map((s) => `<div class="probe" data-size="${s}" style="display:inline-block">${renderToStaticMarkup(createElement(Minus, { size: s }))}</div>`).join("");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 600, height: 200 }, deviceScaleFactor: 1 });
await page.setContent(`<body style="margin:0;color:#000;background:#fff">${markup}</body>`);

// --- 1. hit-test обводки средствами самого движка ---
const hit = await page.evaluate(() =>
  [...document.querySelectorAll(".probe")].map((d) => {
    const svg = d.querySelector("svg");
    const path = svg.querySelector("path");
    const P = (x, y) => new DOMPoint(x, y);
    const inside = (y) => path.isPointInStroke(P(12, y)); // x = середина линии в user space
    // граница сверху и снизу от центра линии (y = 12 в user space)
    const edge = (dir) => {
      let a = 12, b = 12 + dir * 6; // заведомо снаружи
      for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (inside(m)) a = m; else b = m; }
      return (a + b) / 2;
    };
    const ctm = path.getScreenCTM();
    return {
      size: Number(d.dataset.size),
      userThickness: edge(1) - edge(-1),
      scale: ctm.a,
      computedStrokeWidth: getComputedStyle(path).strokeWidth,
      viewBox: svg.getAttribute("viewBox"),
      svgWidth: svg.getAttribute("width"),
    };
  }),
);

// --- 2. интеграл чернил по столбцу на реальном скриншоте ---
// DPR 1 — то, как линия реально легла в пиксели экрана (Chrome округляет полосу
// до целых пикселей: 1.333 превращается в 1.5). DPR 8 — та же полоса, измеренная
// в восемь раз точнее: здесь видно, что геометрия именно 2 × size / 24.
const DPR = 8;
const px = [];
for (const s of SIZES) px.push({ size: s, dpr1: await page.locator(`.probe[data-size="${s}"]`).screenshot() });
await page.close();
const hiPage = await browser.newPage({ viewport: { width: 600, height: 200 }, deviceScaleFactor: DPR });
await hiPage.setContent(`<body style="margin:0;color:#000;background:#fff">${markup}</body>`);
for (const row of px) row.hi = await hiPage.locator(`.probe[data-size="${row.size}"]`).screenshot();
await browser.close();

// минимальный разбор PNG через zlib: ширина, высота, покрытие чернилами
import zlib from "node:zlib";
function pngInk(buf) {
  let pos = 8, w = 0, h = 0, bitDepth = 0, colorType = 0, idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) throw new Error(`неожиданный PNG: depth ${bitDepth}, colorType ${colorType}`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = colorType === 6 ? 4 : 3, stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[y * stride + x] = v & 0xff;
    }
  }
  // чернила: с альфой — её значение, без альфы — чёрное по белому
  return { w, h, inkAt: (x, y) => (colorType === 6 ? out[y * stride + x * bpp + 3] : 255 - out[y * stride + x * bpp]) / 255 };
}

let bad = 0;
console.log("lucide-react @ Chromium · глиф minus · ожидание = 2 × size / 24\n");
console.log("size  ожидание   hit-test   пиксели DPR8   пиксели DPR1   stroke-width  viewBox");
for (let i = 0; i < SIZES.length; i++) {
  const h = hit[i];
  const expected = 2 * h.size / 24;
  const hitCss = h.userThickness * h.scale;
  const ink = (png, dpr) => {
    const img = pngInk(png);
    const col = Math.floor(img.w / 2);
    let sum = 0;
    for (let y = 0; y < img.h; y++) sum += img.inkAt(col, y);
    return sum / dpr;
  };
  const hi = ink(px[i].hi, DPR);
  const lo = ink(px[i].dpr1, 1);
  const ok = Math.abs(hitCss - expected) < 1e-3 && Math.abs(hi - expected) < 0.05;
  if (!ok) bad++;
  console.log(
    `${String(h.size).padStart(4)}  ${expected.toFixed(5).padStart(8)}  ${hitCss.toFixed(5).padStart(9)}  ${hi.toFixed(5).padStart(13)}  ${lo.toFixed(5).padStart(13)}  ` +
    `${String(h.computedStrokeWidth).padStart(12)}  ${h.viewBox}  ${ok ? "✓" : "✗"}`,
  );
}
console.log(`\n${SIZES.length} размеров · ${bad} расхождений (допуск: hit-test 0.001 px, пиксели DPR8 0.05 px)`);
console.log("пиксели DPR1 — как полоса легла в экранные пиксели: Chrome округляет её до полупикселя, это растеризация, а не геометрия");
process.exit(bad ? 1 : 0);
