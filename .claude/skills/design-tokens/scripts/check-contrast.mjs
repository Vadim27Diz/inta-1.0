#!/usr/bin/env node
// Contrast checker for the semantic layer.
// Usage: node check-contrast.mjs [tokens.json] [--all]
//
// For every content token (color/on-*) it finds the surfaces that token is meant to sit on —
// including the hover and pressed states of that surface — and measures the pair in all four
// brand × theme combinations. Link-style tokens have no surface of their own, so they are
// measured against color/surface.
//
// Two numbers per pair:
//   WCAG 2 contrast ratio      — the legal/compliance number, threshold 4.5:1 for body text
//   APCA (APCA-W3 0.1.9) Lc    — the perceptual number, |Lc| >= 60 for normal-weight body text
// WCAG below the threshold is an error (exit 1) — it is the number we are held to.
// APCA below the threshold is a warning: it is the better model of readability, but it is not
// the standard anyone audits against, and chasing it would push the dark theme into repaints
// nobody asked for. Warnings are there to be read, not to block.
import fs from "node:fs";

const args = process.argv.slice(2);
const SHOW_ALL = args.includes("--all");
const inFile = args.find((a) => !a.startsWith("--")) || "tokens/tokens.json";
const WCAG_MIN = 4.5;
const APCA_MIN = 60;

// Pairs that are meant to be low contrast. WCAG 2 §1.4.3 exempts inactive controls outright,
// and a disabled button that reads as clearly as an active one defeats the state.
const EXEMPT = [
  { content: "color/on-disabled", surface: "color/disabled", why: "WCAG 1.4.3 exempts inactive controls" },
];
const isExempt = (content, surface) => EXEMPT.some((e) => e.content === content && e.surface === surface);

const data = JSON.parse(fs.readFileSync(inFile, "utf8"));
const byName = new Map();
for (const c of data.collections) for (const v of c.variables) byName.set(v.name, { ...v, collection: c.name, modes: c.modes });

// ---------- resolve a token down to a hex, for one brand × theme ----------
function resolve(name, brand, theme, depth = 0) {
  const v = byName.get(name);
  if (!v) throw new Error(`unknown token ${name}`);
  if (depth > 12) throw new Error(`alias loop at ${name}`);
  const mode = v.collection === "Brand" ? brand : v.collection === "Theme" ? theme : v.modes[0];
  const raw = v.valuesByMode[mode];
  if (raw && typeof raw === "object" && "alias" in raw) return resolve(raw.alias, brand, theme, depth + 1);
  return raw;
}
const rgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

// ---------- WCAG 2 ----------
const srgbToLin = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const relLum = ([r, g, b]) => 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
function wcag(fg, bg) {
  const a = relLum(fg), b = relLum(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// ---------- APCA-W3 0.1.9 ----------
const APCA = { trc: 2.4, Rco: 0.2126729, Gco: 0.7151522, Bco: 0.0721750, normBG: 0.56, normTXT: 0.57, revTXT: 0.62, revBG: 0.65, blkThrs: 0.022, blkClmp: 1.414, scale: 1.14, loOffset: 0.027, deltaYmin: 0.0005, loClip: 0.1 };
const apcaY = ([r, g, b]) =>
  APCA.Rco * Math.pow(r / 255, APCA.trc) + APCA.Gco * Math.pow(g / 255, APCA.trc) + APCA.Bco * Math.pow(b / 255, APCA.trc);
function apca(fg, bg) {
  const clamp = (Y) => (Y >= APCA.blkThrs ? Y : Y + Math.pow(APCA.blkThrs - Y, APCA.blkClmp));
  const txtY = clamp(apcaY(fg)), bgY = clamp(apcaY(bg));
  if (Math.abs(bgY - txtY) < APCA.deltaYmin) return 0;
  let sapc, out;
  if (bgY > txtY) {
    sapc = (Math.pow(bgY, APCA.normBG) - Math.pow(txtY, APCA.normTXT)) * APCA.scale;
    out = sapc < APCA.loClip ? 0 : sapc - APCA.loOffset;
  } else {
    sapc = (Math.pow(bgY, APCA.revBG) - Math.pow(txtY, APCA.revTXT)) * APCA.scale;
    out = sapc > -APCA.loClip ? 0 : sapc + APCA.loOffset;
  }
  return out * 100;
}

// ---------- which content token sits on which surfaces ----------
const has = (n) => byName.has(n);
const STATE_SUFFIX = { default: "default", hover: "hover", pressed: "pressed" };

function surfacesFor(onToken) {
  // color/on-primary → primary ; color/on-danger-subtle → danger-subtle ; color/on-surface-hover → surface-hover
  const base = onToken.replace(/^color\/on-/, "");
  const out = [];
  // family with explicit states: color/<base>/default|hover|pressed
  if (has(`color/${base}/default`)) {
    for (const [state, suffix] of Object.entries(STATE_SUFFIX)) {
      const n = `color/${base}/${suffix}`;
      if (has(n)) out.push({ state, surface: n });
    }
  }
  // "<family>-subtle" lives as color/<family>/subtle(+-hover/-pressed)
  const sub = base.match(/^(.+)-subtle$/);
  if (sub) {
    const f = sub[1];
    for (const [state, n] of [["default", `color/${f}/subtle`], ["hover", `color/${f}/subtle-hover`], ["pressed", `color/${f}/subtle-pressed`]])
      if (has(n)) out.push({ state, surface: n });
  }
  // flat surfaces: color/surface, color/surface-hover, color/disabled …
  if (!out.length && has(`color/${base}`)) out.push({ state: "default", surface: `color/${base}` });
  return out;
}

const pairs = [];
for (const name of byName.keys()) {
  const v = byName.get(name);
  if (v.collection !== "Theme" || v.type !== "COLOR") continue;
  if (!/^color\/on-/.test(name)) continue;
  for (const s of surfacesFor(name)) pairs.push({ content: name, ...s });
}
// link-style tokens have no surface of their own — they are text on the page
for (const [family, states] of [["link", ["default", "hover"]], ["link-danger", ["default", "hover"]]]) {
  for (const state of states) {
    const n = `color/${family}/${state}`;
    if (has(n)) pairs.push({ content: n, state, surface: "color/surface" });
  }
}

// ---------- run ----------
const COMBOS = [];
for (const brand of data.collections.find((c) => c.name === "Brand").modes)
  for (const theme of data.collections.find((c) => c.name === "Theme").modes) COMBOS.push({ brand, theme });

const rows = [];
for (const p of pairs) {
  for (const { brand, theme } of COMBOS) {
    const fgHex = resolve(p.content, brand, theme);
    const bgHex = resolve(p.surface, brand, theme);
    if (typeof fgHex !== "string" || typeof bgHex !== "string") continue;
    const fg = rgb(fgHex), bg = rgb(bgHex);
    const w = wcag(fg, bg), a = apca(fg, bg);
    const status = isExempt(p.content, p.surface) ? "exempt"
      : w < WCAG_MIN ? "error"
      : Math.abs(a) < APCA_MIN ? "warn"
      : "pass";
    rows.push({ content: p.content, surface: p.surface, state: p.state, brand, theme, fg: fgHex, bg: bgHex, wcag: w, apca: a, status });
  }
}

const pad = (s, n) => String(s).padEnd(n);
const num = (x, n) => String(x).padStart(n);
const MARK = { pass: "✓", warn: "⚠", error: "✗", exempt: "–" };
const line = (r) =>
  `${MARK[r.status]} ${pad(r.content.replace("color/", ""), 22)} on ${pad(r.surface.replace("color/", ""), 24)} ${pad(r.state, 8)} ${pad(`${r.brand}/${r.theme}`, 12)} ${pad(r.fg, 8)}→${pad(r.bg, 8)} WCAG ${num(r.wcag.toFixed(2), 6)}  APCA ${num(r.apca.toFixed(1), 7)}`;

const errors = rows.filter((r) => r.status === "error");
const warns = rows.filter((r) => r.status === "warn");
const exempt = rows.filter((r) => r.status === "exempt");

if (SHOW_ALL) {
  console.log(`All pairs (${rows.length}); WCAG < ${WCAG_MIN} is an error, |APCA| < ${APCA_MIN} a warning\n`);
  for (const r of rows) console.log(line(r));
} else {
  if (errors.length) {
    console.log(`Errors — WCAG < ${WCAG_MIN} (${errors.length})\n`);
    for (const r of errors) console.log(line(r));
    console.log("");
  }
  if (warns.length) {
    console.log(`Warnings — |APCA| < ${APCA_MIN} (${warns.length})\n`);
    for (const r of warns) console.log(line(r));
  }
}
console.log(
  `\n${pairs.length} pairs × ${COMBOS.length} combinations = ${rows.length} checks · ` +
  `${rows.length - errors.length - warns.length - exempt.length} pass · ${warns.length} warn · ${errors.length} error · ${exempt.length} exempt`
);
for (const e of EXEMPT) console.log(`  exempt: ${e.content.replace("color/", "")} on ${e.surface.replace("color/", "")} — ${e.why}`);
process.exit(errors.length ? 1 : 0);
