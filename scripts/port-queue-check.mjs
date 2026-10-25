#!/usr/bin/env node
// Сверка очереди переноса Figma → код (docs/internal/port-queue.md) с реальностью.
//
//   node scripts/port-queue-check.mjs        # проверка, код выхода 1 при ошибках
//   node scripts/port-queue-check.mjs --list # то же + печать очереди по статусам
//
// Зачем: «ничего не потеряется» должно быть машинной проверкой, а не обещанием памяти. Новый
// набор в Figma без строки в очереди, строка со снятым спеком без файла спека, статус `ported`
// без файла компонента — всё это ошибки, которые видно в `npm run verify`, а не через полгода.
//
// Что НЕ проверяется здесь: содержимое спека против Figma (это `npm run figma:diff`) и свежесть
// снимка раскладки (это `npm run figma:layout`). Здесь — только целостность самой очереди.
import fs from "node:fs";
import path from "node:path";

const QUEUE = "docs/internal/port-queue.md";
const SPECS = "docs/internal/specs";
const LAYOUT = "figma/layout.json";
const UI = "src/components/ui";

// Статусы строго по порядку движения записи. `code-only` и `figma-planned` — боковые ветки:
// компонент есть только в коде (и решено не заводить в Figma) либо только специфицирован.
const FLOW = ["figma-build", "figma-approved", "spec-captured", "queued", "ported", "verified"];
const ASIDE = ["code-only", "figma-planned"];
const STATUSES = new Set([...FLOW, ...ASIDE]);

// Статусы, при которых спек ОБЯЗАН лежать в specs/. Для `ported`/`verified` спек не требуется:
// 26 компонентов перенесены до появления этого процесса, у них спека нет и переписывать историю
// задним числом смысла нет — для них гарантия это код + figma:diff.
const NEEDS_SPEC = new Set(["spec-captured", "queued"]);
// Статусы, при которых обязан существовать файл компонента в коде.
const NEEDS_CODE = new Set(["ported", "verified", "code-only"]);

// Объекты страницы Components, которым строка в очереди не нужна. Явным списком с причиной —
// как EXEMPT_* в figma-layout-export.js, а не молчаливым фильтром.
const EXCLUDE = {
  "Icon": "в коде нет: иконки берутся из lucide-react напрямую, размер классом size-*",
  "Icon base": "мастер слота иконки, служебный — не компонент продукта",
  "Utility / Focus ring": "служебный набор кольца фокуса; в коде это outline-2 outline-offset-2",
  "Input OTP / Slot": "локальная часть Input OTP, отдельно в код не переносится",
  "Select / Item": "локальная часть Select, отдельно в код не переносится",
};

const errors = [];
const warnings = [];

// ---- очередь
if (!fs.existsSync(QUEUE)) {
  console.error(`нет ${QUEUE} — очередь переноса обязательна (см. docs/internal/specs/README.md)`);
  process.exit(1);
}
const raw = fs.readFileSync(QUEUE, "utf8");
const start = raw.indexOf("<!-- queue:start -->");
const end = raw.indexOf("<!-- queue:end -->");
if (start === -1 || end === -1 || end < start) {
  console.error(`${QUEUE}: нет маркеров <!-- queue:start --> / <!-- queue:end -->`);
  process.exit(1);
}

const rows = [];
for (const line of raw.slice(start, end).split("\n")) {
  const t = line.trim();
  if (!t.startsWith("|")) continue;
  const cells = t.split("|").slice(1, -1).map((c) => c.trim());
  if (cells.length < 6) continue;
  if (/^-+$/.test(cells[0]) || cells[1] === "slug") continue; // заголовок и разделитель таблицы
  const [figma, slug, status, date, code, note] = cells;
  rows.push({ figma, slug, status, date, code, note, line: t });
}
if (!rows.length) errors.push(`${QUEUE}: между маркерами нет ни одной строки таблицы`);

const bySlug = new Map();
for (const r of rows) {
  if (!STATUSES.has(r.status)) {
    errors.push(`${r.figma}: статус «${r.status}» не из словаря (${[...STATUSES].join(", ")})`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) {
    errors.push(`${r.figma}: дата «${r.date}» не в формате YYYY-MM-DD`);
  }
  if (bySlug.has(`${r.slug}|${r.figma}`)) errors.push(`${r.figma}: дубль строки в очереди`);
  bySlug.set(`${r.slug}|${r.figma}`, r);

  const spec = path.join(SPECS, `${r.slug}.json`);
  if (NEEDS_SPEC.has(r.status)) {
    if (!fs.existsSync(spec)) {
      errors.push(`${r.figma}: статус ${r.status}, но нет ${spec} — спек снимается в ТОЙ ЖЕ сессии Figma`);
    } else if (fs.statSync(spec).size < 64) {
      errors.push(`${r.figma}: ${spec} пустой или заглушка`);
    }
  }
  if (NEEDS_CODE.has(r.status) && r.code !== "—") {
    const file = path.join(UI, r.code);
    if (!fs.existsSync(file)) errors.push(`${r.figma}: статус ${r.status}, но нет ${file}`);
  }
}

// ---- Figma: каждый набор со страницы Components либо в очереди, либо в EXCLUDE
if (fs.existsSync(LAYOUT)) {
  const layout = JSON.parse(fs.readFileSync(LAYOUT, "utf8"));
  const inFigma = (layout.components || [])
    .map((c) => ({ name: c[0], type: c[1] }))
    .filter((c) => !/^li:/.test(c.name)); // глифы иконок — не компоненты продукта
  const known = new Set(rows.map((r) => r.figma));
  for (const c of inFigma) {
    if (EXCLUDE[c.name] || known.has(c.name)) continue;
    errors.push(`Figma: ${c.type} «${c.name}» есть на странице Components, но нет строки в очереди`);
  }
  // обратная сторона: строка есть, в снимке набора нет. Это НЕ ошибка — снимок мог устареть
  // (ровно так сейчас с Tab/Tabs: собраны в Figma после последнего figma:pull).
  const figmaNames = new Set(inFigma.map((c) => c.name));
  for (const r of rows) {
    if (ASIDE.includes(r.status)) continue;
    if (!figmaNames.has(r.figma)) {
      warnings.push(`${r.figma}: в очереди есть, в снимке ${LAYOUT} нет — либо набор ещё не собран в Figma, либо снимок устарел`);
    }
  }
} else {
  warnings.push(`нет ${LAYOUT} — сверка с Figma пропущена`);
}

// ---- код: файл компонента есть, а строки в очереди нет
if (fs.existsSync(UI)) {
  const codeFiles = fs.readdirSync(UI).filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"));
  const claimed = new Set(rows.map((r) => r.code).filter((c) => c && c !== "—"));
  for (const f of codeFiles) {
    if (!claimed.has(f)) errors.push(`код: ${path.join(UI, f)} есть, но ни одна строка очереди на него не ссылается`);
  }
}

// ---- порог батча: считает сам скрипт, чтобы напоминание не зависело от памяти агента
const queued = rows.filter((r) => r.status === "queued");
let queuedBytes = 0;
for (const r of queued) {
  const spec = path.join(SPECS, `${r.slug}.json`);
  if (fs.existsSync(spec)) queuedBytes += fs.statSync(spec).size;
}
const THRESHOLD_COUNT = 3;
const THRESHOLD_BYTES = 40 * 1024;

if (process.argv.includes("--list")) {
  for (const s of [...FLOW, ...ASIDE]) {
    const group = rows.filter((r) => r.status === s);
    if (group.length) console.log(`${s}: ${group.map((r) => r.figma).join(", ")}`);
  }
}

for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);

const batch = queued.length >= THRESHOLD_COUNT || queuedBytes >= THRESHOLD_BYTES;
if (queued.length) {
  console.log(
    `${batch ? "➜ ПОРА ПЕРЕНОСИТЬ" : "в очереди"}: ${queued.length} шт (${queued.map((r) => r.figma).join(", ")}), спеки ${Math.round(queuedBytes / 1024)} КБ` +
    (batch ? ` — порог ${THRESHOLD_COUNT} шт / ${THRESHOLD_BYTES / 1024} КБ достигнут` : ""),
  );
}
console.log(`${rows.length} записей · ${errors.length} ошибок · ${warnings.length} предупреждений`);
process.exit(errors.length ? 1 : 0);
