#!/usr/bin/env node
// Строит тему Storybook (manager + docs) из того же tokens.json, что и build-tokens.mjs.
// Usage: node build-manager-theme.mjs <tokens.json> <out.ts> [<tokens.css for sanity-check>]
//
// Manager — отдельный бандл без доступа к нашим CSS-переменным: значения нужны буквально
// (resolve-им цепочку алиасов Theme → Brand → Primitives до конца).
// Docs (parameters.docs.theme) — рендерится внутри preview-iframe, где наш tokens.css уже
// загружен: цветам достаточно var(--ds-...), бренд/тема переключаются браузером сами, без смены
// JS-объекта темы. Числовые поля (border radius) — не CSS, var() для них невозможен: берём
// значения бренда Main как разумный дефолт (см. README в начале .storybook/theme.generated.ts).
import fs from "node:fs";

const [, , inFile, outFile, cssFile] = process.argv;
if (!inFile || !outFile) {
  console.error("Usage: node build-manager-theme.mjs <tokens.json> <out.ts> [tokens.css]");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(inFile, "utf8"));
const P = data.prefix || "ds";

// Figma name → CSS var key — та же формула, что в build-tokens.mjs (держать в синхроне вручную,
// это единственное повторение: оба скрипта маленькие самостоятельные файлы, без общего модуля).
const key = (name) => name.replace(/\/default$/, "").replace(/\//g, "-").replace(/\./g, "-");
const cssVar = (name) => `var(--${P}-${key(name)})`;

// name → { v, collection } по всем 4 коллекциям — алиас не знает, из какой коллекции он сам,
// поэтому коллекция нужна отдельно, чтобы выбрать режим (Theme → light/dark, Brand → main/demo).
const byName = new Map();
for (const c of data.collections) for (const v of c.variables) byName.set(v.name, { v, collection: c.name });

function modeFor(collection, ctx) {
  if (collection === "Theme") return ctx.themeMode;
  if (collection === "Brand") return ctx.brandMode;
  return "Value"; // Primitives и Component — один режим
}

// Идёт по цепочке алиасов до конца, возвращает { type, raw } сырого (не-алиас) значения.
function resolveRaw(name, ctx) {
  const entry = byName.get(name);
  if (!entry) throw new Error(`Токен не найден: ${name}`);
  const { v, collection } = entry;
  const mode = modeFor(collection, ctx);
  const val = v.valuesByMode[mode];
  if (val === undefined) throw new Error(`${name}: нет значения для режима ${mode} (коллекция ${collection})`);
  if (val && typeof val === "object" && "alias" in val) return resolveRaw(val.alias, ctx);
  return { type: v.type, raw: val };
}

const hex = (val) => {
  if (typeof val === "string") return val;
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0").toUpperCase();
  const a = val.a === undefined || val.a === 1 ? "" : h(val.a);
  return `#${h(val.r)}${h(val.g)}${h(val.b)}${a}`;
};
const fontStack = (family, name) => {
  const fallback = /mono/.test(name) ? "ui-monospace, monospace" : "ui-sans-serif, system-ui, sans-serif";
  return `"${family}", ${fallback}`;
};

// Резолвит до буквального значения (hex/число/строка шрифта) — для темы manager.
function literal(name, ctx) {
  const { type, raw } = resolveRaw(name, ctx);
  if (type === "COLOR") return hex(raw);
  if (type === "STRING") return fontStack(raw, name);
  if (type === "FLOAT") return Math.round(raw);
  return raw;
}

const BRANDS = [["main", "Main"], ["demo", "Demo"]];
const THEMES = [["light", "Light"], ["dark", "Dark"]];

// Таблица соответствия: поле темы Storybook → наш токен (Figma name). Решение дизайна, не
// механически выводится из tokens.json — проверено по references/token-catalog.md.
const COLOR_FIELDS = {
  colorPrimary: "color/primary/default",
  colorSecondary: "color/secondary/default",
  appBg: "color/surface",
  appContentBg: "color/surface",
  appHoverBg: "color/surface-hover",
  appPreviewBg: "color/surface",
  appBorderColor: "color/border/default",
  textColor: "color/on-surface",
  textInverseColor: "color/on-inverse",
  textMutedColor: "color/on-surface-muted",
  barTextColor: "color/on-surface-muted",
  barHoverColor: "color/on-surface",
  barSelectedColor: "color/primary/default",
  barBg: "color/surface-raised",
  buttonBg: "color/surface-raised",
  buttonBorder: "color/border/default",
  booleanBg: "color/surface-muted",
  booleanSelectedBg: "color/primary/default",
  inputBg: "color/surface",
  inputBorder: "color/border/input",
  inputTextColor: "color/on-surface",
};
// Числовые поля — как есть (px), не через COLOR_FIELDS/hex
const RADIUS_FIELDS = { appBorderRadius: "radius/md", inputBorderRadius: "radius/sm" };
const FONT_FIELDS = { fontBase: "font/sans" };
const FONT_CODE = "font/mono"; // Primitives, не Brand — своего fontCode-токена в Theme/Brand нет

function buildManagerTheme(brandMode, themeMode) {
  const ctx = { brandMode, themeMode };
  const out = { base: themeMode.toLowerCase() };
  for (const [field, tokenName] of Object.entries(COLOR_FIELDS)) out[field] = literal(tokenName, ctx);
  for (const [field, tokenName] of Object.entries(RADIUS_FIELDS)) out[field] = literal(tokenName, ctx);
  for (const [field, tokenName] of Object.entries(FONT_FIELDS)) out[field] = literal(tokenName, ctx);
  out.fontCode = literal(FONT_CODE, ctx);
  out.brandTitle = "Inta 1.0";
  return out;
}

// Проверено эмпирически (Playwright, DocsContainer/отдельные Styled-компоненты реально падали с
// "Couldn't parse the color string") и затем исчерпывающе по собранным бандлам:
//   grep -noE "curried(Opacify|Darken|Lighten|Transparentize)(\$[0-9]+)*\([^)]*\)" <chunk>.js
// (суффиксы `$1`/`$1$1`/… — у каждого чанка свои после Vite-дедупликации, обычный grep на
// `curriedOpacify$1(` пропускает `curriedOpacify$1$1(` и т.п. — важно (\$[0-9]+)* с нулём и более
// повторов, а не ровно один необязательный индекс). На blocks-*.js и theming-*.js (addon-docs +
// core theming — единственные два чанка, которые рендерят Docs) это даёт ровно 8 базовых полей,
// которые где-то прогоняются через polished-функции без guard на var()/gradient/calc (он есть
// только в create()/isValidColorForPolished): appBorderColor, appBg (как background.app),
// appContentBg (как background.content), inputBg (как input.background), textColor (как
// color.defaultText), colorSecondary (как color.secondary), barSelectedColor, textMutedColor.
// Других таких мест в этих двух чанках нет — если в новой версии Storybook здесь снова упадёт
// "Couldn't parse the color string", см. стек: он называет ровно то производное поле (theme.*),
// которое нужно добавить сюда.
const DOCS_LITERAL_COLOR_FIELDS = new Set([
  "appBorderColor",
  "appBg",
  "appContentBg",
  "inputBg",
  "textColor",
  "colorSecondary",
  "barSelectedColor",
  "textMutedColor",
]);

// Docs-тема: цвета — var(--ds-...) (бренд/тема следуют браузером через data-brand/.dark на
// preview-iframe, менять JS-объект при переключении тулбара не нужно), кроме исключения выше.
// Числа — бренд Main (известное ограничение, см. комментарий в начале файла и roadmap.md).
function buildDocsTheme(themeMode) {
  const ctx = { brandMode: "Main", themeMode };
  const out = { base: themeMode.toLowerCase() };
  for (const [field, tokenName] of Object.entries(COLOR_FIELDS))
    out[field] = DOCS_LITERAL_COLOR_FIELDS.has(field) ? literal(tokenName, ctx) : cssVar(tokenName);
  for (const [field, tokenName] of Object.entries(RADIUS_FIELDS)) out[field] = literal(tokenName, ctx);
  for (const [field, tokenName] of Object.entries(FONT_FIELDS)) out[field] = literal(tokenName, ctx);
  out.fontCode = literal(FONT_CODE, ctx);
  out.brandTitle = "Inta 1.0";
  return out;
}

const managerThemes = {};
for (const [brandKey, brandMode] of BRANDS) {
  for (const [themeKey, themeMode] of THEMES) {
    managerThemes[`${brandKey}-${themeKey}`] = buildManagerTheme(brandMode, themeMode);
  }
}
const docsThemes = { light: buildDocsTheme("Light"), dark: buildDocsTheme("Dark") };

// Санити-чек: каждый var(--ds-...), который мы вставили в docsThemes, должен реально
// существовать в собранном tokens.css — иначе таблица соответствия выше расходится с реальными
// именами переменных (например, после переименования токена в Figma).
if (cssFile && fs.existsSync(cssFile)) {
  const css = fs.readFileSync(cssFile, "utf8");
  const known = new Set([...css.matchAll(/--ds-[a-z0-9-]+/g)].map((m) => m[0]));
  const used = new Set();
  for (const theme of Object.values(docsThemes)) {
    for (const v of Object.values(theme)) {
      const m = typeof v === "string" && v.match(/--ds-[a-z0-9-]+/);
      if (m) used.add(m[0]);
    }
  }
  const missing = [...used].filter((v) => !known.has(v));
  if (missing.length) {
    console.error(`✗ CSS-переменные из таблицы соответствия отсутствуют в ${cssFile}: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const header = `/* GENERATED by scripts/build-manager-theme.mjs from ${inFile.split("/").pop()} — do not edit by hand.
 *
 * managerThemes — буквальные значения (hex/px/строка шрифта) для .storybook/manager.ts:
 * addons.setConfig({ theme }) — manager рендерится в отдельном бандле без доступа к нашим
 * CSS-переменным, поэтому значения зашиты как литералы на момент сборки темы.
 *
 * docsThemes — для parameters.docs.theme в .storybook/preview.tsx: цвета — var(--ds-...),
 * resolve-ятся браузером внутри preview-iframe (тот же документ, что и tokens.css) — бренд/тема
 * переключаются тулбаром сами, без смены объекта темы. Числовые поля (appBorderRadius,
 * inputBorderRadius) — не CSS-значения, var() для них невозможен: зафиксированы на бренд Main
 * (см. docs/roadmap.md — известное ограничение до отдельной доработки).
 */
`;
const body =
  `export const managerThemes = ${JSON.stringify(managerThemes, null, 2)} as const;\n\n` +
  `export const docsThemes = ${JSON.stringify(docsThemes, null, 2)} as const;\n`;

fs.writeFileSync(outFile, header + "\n" + body);
console.log(`✓ ${outFile}: ${Object.keys(managerThemes).length} manager-темы, ${Object.keys(docsThemes).length} docs-темы`);
