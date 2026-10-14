#!/usr/bin/env node
// Token linter for components. Usage: node check-tokens.mjs [dir=src/components]
// Fails (exit 1) on anything that bypasses tokens. Run after every component change.
import fs from "node:fs";
import path from "node:path";

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
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/^\s*(\/\/|\*|\/\*)/.test(line) || /^\s*import /.test(line)) return;
    if (/(#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\()/.test(line) && !/var\(--/.test(line))
      report("error", f, n, line.trim().slice(0, 60), "raw color value; use a semantic color token");
    if (/style=\{\{/.test(line)) report("warn", f, n, "style={{…}}", "inline style; prefer token classes, or var(--ds-…) only");
    for (const cls of line.split(/[\s"'`]+/)) {
      if (!/^[!\w:\-[\]/.%=#()&>*~+@,]+$/.test(cls) || !cls.includes("-")) continue;
      const { variants, util } = utility(cls);
      if (/(^|:)dark:/.test(cls) || variants.startsWith("dark:"))
        report("error", f, n, cls, "no dark: in components — tokens switch light/dark automatically");
      if (paletteRe.test(util)) report("error", f, n, cls, "raw Tailwind palette; use a semantic token (token-catalog.md)");
      const m = util.match(shadcnRe);
      if (m) report("error", f, n, cls, `shadcn token; use ${m[1]}-${SHADCN[m[2]]}`);
      if (/^(bg|text|border)-secondary(-|$)/.test(util) && /shadcn|ui\//.test(f))
        report("warn", f, n, cls, "check: shadcn 'secondary' (grey) is our 'neutral'; our 'secondary' is the brand's 2nd color");
      const arb = util.match(/^-?[\w-]+-\[(.+)\]$/) || util.match(/^\[(.+)\]$/);
      if (arb && !/^(var\(--|calc\(.*var\(--|--)/.test(arb[1]))
        report("error", f, n, cls, "arbitrary value; use the Tailwind scale or a token (var(--ds-…) only if no class exists)");
      if (/^(bg|text|border|ring)-[a-z-]+\/\d+$/.test(util) && !paletteRe.test(util) && !shadcnRe.test(util))
        report("warn", f, n, cls, "opacity on a token (e.g. bg-primary/90); states have their own tokens: -hover, -pressed");
      if (/^opacity-50$/.test(util) && /disabled/.test(variants))
        report("warn", f, n, cls, "disabled via opacity; use bg-disabled / text-on-disabled");
    }
  });
}
console.log(`\n${files.length} files · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
