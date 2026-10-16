#!/usr/bin/env node
// Every Tailwind class that appears in src/components must actually exist in the compiled CSS —
// Tailwind v4 silently drops a candidate it doesn't recognize (typo, or the class of a token that
// got renamed/removed in tokens.css) instead of erroring. Usage: node check-tailwind-classes.mjs [dir=src/components]
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { __unstable__loadDesignSystem } from "@tailwindcss/node";

const root = process.argv[2] || "src/components";
const GLOBALS_CSS = "src/styles/globals.css";

const files = [];
(function walk(d) {
  if (!fs.existsSync(d)) { console.error(`No such folder: ${d}`); process.exit(2); }
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name) && !/\.stories\./.test(e.name)) files.push(p);
  }
})(root);

// candidate class string -> Set<"file:line"> (one class can legitimately recur across files)
const occurrences = new Map();
const record = (cls, file, line) => {
  if (!occurrences.has(cls)) occurrences.set(cls, new Set());
  occurrences.get(cls).add(`${file}:${line}`);
};

// A class string can span a template literal quasi (no backticks currently in src/components, but
// handled defensively) — interpolation boundaries aren't split on, so a quasi adjacent to `${…}`
// can yield a truncated token at that edge. Not exercised today; flag if it ever is.
function collectStrings(node, sf, out) {
  if (ts.isStringLiteralLike(node)) {
    out.push([node.text, sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1]);
  } else if (ts.isTemplateExpression(node)) {
    const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
    out.push([node.head.text, line]);
    for (const span of node.templateSpans) out.push([span.literal.text, line]);
  } else if (ts.isParenthesizedExpression(node)) {
    collectStrings(node.expression, sf, out);
  } else if (ts.isConditionalExpression(node)) {
    collectStrings(node.whenTrue, sf, out);
    collectStrings(node.whenFalse, sf, out);
  } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    collectStrings(node.left, sf, out);
    collectStrings(node.right, sf, out);
  } else if (ts.isCallExpression(node) && /^(cn|clsx)$/.test(node.expression.getText(sf))) {
    for (const arg of node.arguments) collectStrings(arg, sf, out);
  } else if (ts.isArrayLiteralExpression(node)) {
    for (const el of node.elements) collectStrings(el, sf, out);
  } else if (ts.isObjectLiteralExpression(node)) {
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) collectStrings(prop.initializer, sf, out);
    }
  }
}

function visitCva(callExpr, sf, out) {
  const [base, options] = callExpr.arguments;
  if (base) collectStrings(base, sf, out);
  if (!options || !ts.isObjectLiteralExpression(options)) return;
  for (const prop of options.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name.getText(sf).replace(/^["']|["']$/g, "");
    if (name === "variants" && ts.isObjectLiteralExpression(prop.initializer)) {
      for (const category of prop.initializer.properties) {
        if (!ts.isPropertyAssignment(category) || !ts.isObjectLiteralExpression(category.initializer)) continue;
        for (const variant of category.initializer.properties) {
          if (ts.isPropertyAssignment(variant)) collectStrings(variant.initializer, sf, out);
        }
      }
    } else if (name === "compoundVariants" && ts.isArrayLiteralExpression(prop.initializer)) {
      for (const entry of prop.initializer.elements) {
        if (!ts.isObjectLiteralExpression(entry)) continue;
        for (const field of entry.properties) {
          if (!ts.isPropertyAssignment(field)) continue;
          const fieldName = field.name.getText(sf).replace(/^["']|["']$/g, "");
          if (fieldName === "class" || fieldName === "className") collectStrings(field.initializer, sf, out);
        }
      }
    }
    // "defaultVariants" intentionally skipped: its values are variant *keys* ("sm", "inline-start"), not classes.
  }
}

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const strings = [];

  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "className" && node.initializer) {
      if (ts.isStringLiteral(node.initializer)) {
        strings.push([node.initializer.text, sf.getLineAndCharacterOfPosition(node.initializer.getStart(sf)).line + 1]);
      } else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
        collectStrings(node.initializer.expression, sf, strings);
      }
    } else if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sf);
      if (callee === "cva") visitCva(node, sf, strings);
      else if (/^(cn|clsx)$/.test(callee)) for (const arg of node.arguments) collectStrings(arg, sf, strings);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  for (const [text, line] of strings) {
    for (const cls of text.split(/\s+/)) {
      if (!cls) continue;
      record(cls.replace(/^!/, ""), file, line);
    }
  }
}

const base = path.resolve(path.dirname(GLOBALS_CSS));
const css = fs.readFileSync(GLOBALS_CSS, "utf8");
const designSystem = await __unstable__loadDesignSystem(css, { base, onDependency: () => {} });

// `group`/`peer`(`/name`) are pure markers consumed by `group-*`/`peer-*` variants elsewhere —
// they never produce a CSS rule of their own, so candidatesToCss legitimately returns null for them.
const MARKER = /^(group|peer)(\/[\w-]+)?$/;
const candidates = [...occurrences.keys()].filter((c) => !MARKER.test(c));
const results = designSystem.candidatesToCss(candidates);

let errors = 0;
candidates.forEach((cls, i) => {
  if (results[i] !== null) return;
  errors++;
  const locations = [...occurrences.get(cls)].sort();
  console.log(`✗ ${cls}  → not in compiled CSS (typo, or a removed token's class)`);
  for (const loc of locations) console.log(`    ${loc}`);
});

console.log(`\n${files.length} files · ${candidates.length} classes checked · ${errors} errors`);
process.exit(errors ? 1 : 0);
