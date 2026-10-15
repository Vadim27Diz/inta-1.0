#!/usr/bin/env node
// Готовит DATA для assets/figma-foundations.js — то, что генератор страницы не может
// прочитать из Figma сам: контраст (его считает check-contrast.mjs) и происхождение сборки.
//
//   node .claude/skills/design-tokens/assets/figma-foundations-data.mjs > /tmp/foundations-data.json
//
// Всё остальное (hex примитивов, значения радиусов и отступов, метрики текстовых стилей)
// генератор читает живьём из переменных и стилей файла — поэтому оно не может разъехаться
// с Figma внутри одной сборки. Контраст так получить нельзя: единственный источник правды
// по WCAG/APCA — check-contrast.mjs, и дублировать его формулы в плагин-скрипте нельзя.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../../..");
const tokensPath = process.argv[2] || path.join(repo, "tokens/tokens.json");
const checker = path.join(here, "../scripts/check-contrast.mjs");

// ---------- контраст: один прогон check-contrast.mjs --all, разбор строк ----------
let raw;
try {
  raw = execFileSync(process.execPath, [checker, tokensPath, "--all"], { encoding: "utf8" });
} catch (e) {
  // exit 1 = есть ошибки WCAG; вывод всё равно полный, но сборку страницы по нему не делаем
  if (!e.stdout) throw e;
  raw = e.stdout;
  process.stderr.write("check-contrast вернул ошибки WCAG — исправь токены до пересборки Foundations\n");
}

const LINE = /^(\S)\s+(\S+)\s+on\s+(\S+)\s+(default|hover|pressed)\s+(\w+)\/(\w+)\s+(#[0-9A-Fa-f]{6})\s*→\s*(#[0-9A-Fa-f]{6})\s+WCAG\s+([\d.]+)\s+APCA\s+(-?[\d.]+)\s*$/;
const MARK_TO_STATUS = { "✓": "p", "⚠": "w", "✗": "e", "–": "x" };
const COMBOS = ["Main/Light", "Main/Dark", "Demo/Light", "Demo/Dark"];

const rows = [];
for (const line of raw.split("\n")) {
  const m = LINE.exec(line.trim());
  if (m) rows.push({ content: m[2], surface: m[3], state: m[4], combo: `${m[5]}/${m[6]}`, wcag: m[9], apca: m[10], status: MARK_TO_STATUS[m[1]] || "?" });
}
if (!rows.length) throw new Error("не разобрал ни одной строки check-contrast --all — изменился формат вывода?");

// ключ «контент|поверхность|состояние» → "wcag/apca/статус" по четырём комбинациям в порядке COMBOS
const contrast = {};
for (const r of rows) {
  const key = `${r.content}|${r.surface}|${r.state}`;
  (contrast[key] = contrast[key] || {})[r.combo] = `${r.wcag}/${r.apca}/${r.status}`;
}
const contrastFlat = {};
for (const [key, byCombo] of Object.entries(contrast)) {
  const missing = COMBOS.filter((c) => !byCombo[c]);
  if (missing.length) throw new Error(`у пары ${key} нет комбинаций: ${missing.join(", ")}`);
  contrastFlat[key] = COMBOS.map((c) => byCombo[c]).join("|");
}

// ---------- происхождение: дата сборки и коммит tokens.json ----------
const git = (args, fallback) => {
  try {
    return execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim() || fallback;
  } catch {
    return fallback;
  }
};
const rel = path.relative(repo, tokensPath);
const tokensCommit = git(["log", "-1", "--format=%h", "--", rel], "—");
const tokensDate = git(["log", "-1", "--format=%ad", "--date=short", "--", rel], "—");
const dirty = git(["status", "--porcelain", "--", rel], "") ? " (есть незакоммиченные правки)" : "";

const data = {
  meta: {
    tokensFile: rel,
    tokensCommit: tokensCommit + dirty,
    tokensCommitDate: tokensDate,
    builtAt: new Date().toISOString().slice(0, 10),
    pairs: Object.keys(contrastFlat).length,
    checks: rows.length,
    combos: COMBOS,
  },
  contrast: contrastFlat,
};
process.stdout.write(JSON.stringify(data, null, 1) + "\n");
