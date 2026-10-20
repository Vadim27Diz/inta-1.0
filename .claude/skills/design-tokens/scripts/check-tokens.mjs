#!/usr/bin/env node
// Token linter for components. Usage: node check-tokens.mjs [dir=src/components]
// Fails (exit 1) on anything that bypasses tokens. Run after every component change.
import fs from "node:fs";
import path from "node:path";

// Every `var(--x)` / Tailwind v4 shorthand `util-(--x)` in component code must resolve to a real
// CSS custom property — a typo'd or hallucinated token name silently falls back to Tailwind's
// default and nobody notices until a screenshot looks wrong. Build the set of names tokens.css
// actually declares (left-hand side of a declaration only — not var(--x) references on the right).
const TOKENS_CSS = "src/styles/tokens.css";
const definedVars = new Set();
if (fs.existsSync(TOKENS_CSS)) {
  for (const m of fs.readFileSync(TOKENS_CSS, "utf8").matchAll(/^\s*(--[\w-]+)\s*:/gm)) definedVars.add(m[1]);
}
// Radix/Base UI inject their own CSS vars at runtime (--radix-select-trigger-width, --anchor-width);
// they're never in tokens.css and that's fine — see shadcn-mapping.md: "не дизайн-решения".
const EXEMPT_VAR_PREFIXES = ["--radix-", "--anchor-"];
// Tailwind v4's own theme scale variable (defined by Tailwind itself, e.g. `--spacing: 0.25rem`),
// not a ds design decision — used in upstream shadcn components for computed arbitrary values
// like `calc(var(--spacing)*4)`. Exact name, not a prefix: don't widen this into a loophole.
const EXEMPT_VAR_NAMES = ["--spacing"];

const root = process.argv[2] || "src/components";
const PALETTE = "slate|gray|zinc|neutral-\\d|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black|mauve|olive|mist|taupe";
const COLOR_UTIL = "bg|text|border|border-[trblxy]|ring|ring-offset|fill|stroke|outline|from|via|to|shadow|decoration|divide|placeholder|caret|accent";
const paletteRe = new RegExp(`^(${COLOR_UTIL})-(${PALETTE})(-\\d+)?(\\/\\d+)?$`);

// shadcn token → our token (see references/shadcn-mapping.md)
const SHADCN = {
  "background": "surface", "foreground": "on-surface",
  "card": "surface-raised", "card-foreground": "on-surface-raised",
  "popover": "surface-overlay", "popover-foreground": "on-surface-overlay",
  "primary-foreground": "on-primary",
  "secondary-foreground": "on-neutral",
  "muted": "surface-muted", "muted-foreground": "on-surface-muted",
  "accent": "surface-hover", "accent-foreground": "on-surface-hover",
  "destructive": "danger", "destructive-foreground": "on-danger",
  "input": "border-input", "ring": "focus-ring",
  "sidebar": "sidebar-surface", "sidebar-foreground": "sidebar-on-surface",
  "sidebar-primary-foreground": "sidebar-on-primary",
  "sidebar-accent": "sidebar-hover", "sidebar-accent-foreground": "sidebar-on-hover",
  "sidebar-ring": "sidebar-focus-ring",
};
for (let i = 1; i <= 5; i++) SHADCN[`chart-${i}`] = `dataviz-${i}`;
const shadcnRe = new RegExp(`^(${COLOR_UTIL})-(${Object.keys(SHADCN).sort((a, b) => b.length - a.length).join("|")})(\\/\\d+)?$`);

const files = [];
(function walk(d) {
  if (!fs.existsSync(d)) { console.error(`No such folder: ${d}`); process.exit(2); }
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|jsx|ts|js|css)$/.test(e.name) && !/\.stories\./.test(e.name)) files.push(p);
  }
})(root);

// split "hover:data-[state=open]:bg-x" → utility part after the last top-level ":"
const utility = (cls) => {
  let depth = 0, cut = 0;
  for (let i = 0; i < cls.length; i++) {
    if (cls[i] === "[" || cls[i] === "(") depth++;
    else if (cls[i] === "]" || cls[i] === ")") depth--;
    else if (cls[i] === ":" && depth === 0) cut = i + 1;
  }
  return { variants: cls.slice(0, cut), util: cls.slice(cut).replace(/^!/, "") };
};

let errors = 0, warnings = 0;
const report = (lvl, f, n, cls, msg) => {
  lvl === "error" ? errors++ : warnings++;
  console.log(`${lvl === "error" ? "✗" : "⚠"} ${f}:${n}  ${cls}  → ${msg}`);
};

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  // The "is this shadcn's grey secondary?" hint only makes sense while the file still carries
  // shadcn's own token next to it. In a file already on our tokens, our secondary IS the brand's
  // second colour and the warning is pure noise.
  const hasShadcnSecondary = /-secondary-foreground\b/.test(src);
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/^\s*(\/\/|\*|\/\*)/.test(line) || /^\s*import /.test(line)) return;
    if (/(#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\()/.test(line) && !/var\(--/.test(line))
      report("error", f, n, line.trim().slice(0, 60), "raw color value; use a semantic color token");
    if (/style=\{\{/.test(line)) report("warn", f, n, "style={{…}}", "inline style; prefer token classes, or var(--ds-…) only");
    for (const vm of line.matchAll(/\(--([\w-]+)\)/g)) {
      const varName = `--${vm[1]}`;
      if (EXEMPT_VAR_PREFIXES.some((p) => varName.startsWith(p)) || EXEMPT_VAR_NAMES.includes(varName)) continue;
      if (!definedVars.has(varName)) report("error", f, n, varName, "no such CSS variable in tokens.css; typo, or a token that was never added");
    }
    for (const cls of line.split(/[\s"'`]+/)) {
      // "rounded" is the one dash-free class worth checking: since --radius-*: initial it compiles to nothing.
      if (!/^[!\w:\-[\]/.%=#()&>*~+@,]+$/.test(cls) || (!cls.includes("-") && !/(^|:)rounded$/.test(cls))) continue;
      const { variants, util } = utility(cls);
      if (/(^|:)dark:/.test(cls) || variants.startsWith("dark:"))
        report("error", f, n, cls, "no dark: in components — tokens switch light/dark automatically");
      if (paletteRe.test(util)) report("error", f, n, cls, "raw Tailwind palette; use a semantic token (token-catalog.md)");
      const m = util.match(shadcnRe);
      if (m) report("error", f, n, cls, `shadcn token; use ${m[1]}-${SHADCN[m[2]]}`);
      if (/^(bg|text|border)-secondary(-|$)/.test(util) && hasShadcnSecondary)
        report("warn", f, n, cls, "check: shadcn 'secondary' (grey) is our 'neutral'; our 'secondary' is the brand's 2nd color");
      const arb = util.match(/^-?[\w-]+-\[(.+)\]$/) || util.match(/^\[(.+)\]$/);
      // grid-rows-[auto_auto] / grid-cols-[1fr_auto] / grid-cols-[0_1fr]: track-sizing keywords
      // (auto/fr/minmax/repeat) plus a bare `0` (dimensionless zero-width track, e.g. Alert's
      // icon column collapsing to nothing when there's no icon) — none of these are a design
      // magnitude, there's no spacing/color scale for "two rows, content-sized" or "zero-or-icon
      // column", and Tailwind has no non-arbitrary utility for asymmetric grid templates.
      // Still rejects a smuggled raw length (px/rem/%) in the same bracket, which IS tokenizable.
      const isGridTrackList = /^grid-(rows|cols)-\[(.+)\]$/.test(util) &&
        util.match(/^grid-(rows|cols)-\[(.+)\]$/)[2].split("_").every((t) =>
          /^(auto|none|subgrid)$/i.test(t) || /^0$/.test(t) || /^[\d.]+fr$/i.test(t) || /^(minmax|repeat)\(.+\)$/i.test(t));
      if (arb && !isGridTrackList && !/^(var\(--|calc\(.*var\(--|--)/.test(arb[1]))
        report("error", f, n, cls, "arbitrary value; use the Tailwind scale or a token (var(--ds-…) only if no class exists)");
      if (/^(bg|text|border|ring)-[a-z-]+\/\d+$/.test(util) && !paletteRe.test(util) && !shadcnRe.test(util))
        report("warn", f, n, cls, "opacity on a token (e.g. bg-primary/90); states have their own tokens: -hover, -pressed");
      // Brand defines radius/sm…xl only; --radius-*: initial removes the rest, so these classes compile to nothing.
      const SIDE = "(t|r|b|l|s|e|tl|tr|br|bl|ss|se|ee|es)";
      if (new RegExp(`^rounded(-${SIDE})?-(xs|2xl|3xl|4xl)$`).test(util))
        report("error", f, n, cls, "radius outside the brand scale; use rounded-sm|md|lg|xl (radius/* from Brand). Need a bigger one — agree radius/2xl in Brand first");
      if (new RegExp(`^rounded(-${SIDE})?$`).test(util))
        report("error", f, n, cls, "bare rounded has no value since --radius-*: initial; name the step: rounded-sm|md|lg|xl");
      if (/^opacity-50$/.test(util) && /disabled/.test(variants))
        report("warn", f, n, cls, "disabled via opacity; use bg-disabled / text-on-disabled");
    }
  });
}
console.log(`\n${files.length} files · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
