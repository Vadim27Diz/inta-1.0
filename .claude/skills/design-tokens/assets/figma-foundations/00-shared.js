// Генератор страницы Foundations. Запускать через Figma MCP `use_figma` (скилл figma-use),
// целиком, одним прогоном: скрипт сначала чистит страницу Foundations, потом собирает её заново.
//
// Страница = восемь самостоятельных фреймов верхнего уровня (01 Palette … 08 Spacing),
// разложенных слева направо и сверху вниз с отступом 160. У каждого своя шапка с датой и
// коммитом tokens.json и свои явные режимы Brand и Theme — фрейм можно скопировать куда угодно,
// он не будет наследовать чужие режимы.
//
// Пересборка после правки токенов:
//   1. npm run tokens:build
//   2. node .claude/skills/design-tokens/assets/figma-foundations-data.mjs > /tmp/foundations-data.json
//   3. вставить содержимое /tmp/foundations-data.json в DATA ниже
//   4. прогнать этот файл через use_figma (он сам удалит содержимое страницы и соберёт заново)
//   5. проверить: assets/figma-foundations-check.js → unboundPaints: 0, textWithoutStyle: 0
//
// Что откуда берётся:
//   - цвета, радиусы, отступы, метрики текстовых стилей — читаются живьём из переменных и стилей
//     файла, поэтому внутри одной сборки подписи не могут разъехаться с Figma;
//   - WCAG/APCA — только из DATA (единственный источник правды — scripts/check-contrast.mjs);
//   - hex, числа радиусов и отступов попадают на холст как ТЕКСТ подписи. Это единственное место
//     в системе, где hex допустим: он документирует значение, а не задаёт его. Все заливки,
//     обводки, радиусы и шрифты на странице привязаны к переменным и стилям.

// ===== DATA — вывод assets/figma-foundations-data.mjs, заменять целиком при пересборке =====
const DATA = {
 "meta": {
  "tokensFile": "tokens/tokens.json",
  "tokensCommit": "79c8bff",
  "tokensCommitDate": "2026-10-15",
  "builtAt": "2026-10-15",
  "pairs": 38,
  "checks": 152,
  "combos": [
   "Main/Light",
   "Main/Dark",
   "Demo/Light",
   "Demo/Dark"
  ]
 },
 "contrast": {
  "on-surface|surface|default": "19.90/105.9/p|19.06/-104.5/p|19.90/105.9/p|19.06/-104.5/p",
  "on-surface-raised|surface-raised|default": "19.90/105.9/p|16.97/-103.4/p|19.90/105.9/p|16.97/-103.4/p",
  "on-surface-overlay|surface-overlay|default": "19.90/105.9/p|16.97/-103.4/p|19.90/105.9/p|16.97/-103.4/p",
  "on-surface-muted|surface-muted|default": "7.02/80.3/p|5.68/-47.4/w|7.02/80.3/p|5.68/-47.4/w",
  "on-surface-hover|surface-hover|default": "16.12/98.0/p|14.27/-101.3/p|16.12/98.0/p|14.27/-101.3/p",
  "on-primary|primary/default|default": "5.25/-80.4/p|5.25/-80.4/p|5.36/-81.5/p|5.36/-81.5/p",
  "on-primary|primary/hover|hover": "6.83/-87.5/p|6.83/-87.5/p|7.54/-90.5/p|7.54/-90.5/p",
  "on-primary|primary/pressed|pressed": "8.82/-93.8/p|8.82/-93.8/p|9.41/-95.7/p|9.41/-95.7/p",
  "on-secondary|secondary/default|default": "5.89/-83.0/p|5.89/-83.0/p|5.22/-79.8/p|5.22/-79.8/p",
  "on-secondary|secondary/hover|hover": "7.30/-88.1/p|7.30/-88.1/p|7.37/-89.3/p|7.37/-89.3/p",
  "on-secondary|secondary/pressed|pressed": "9.17/-93.8/p|9.17/-93.8/p|9.44/-95.3/p|9.44/-95.3/p",
  "on-neutral|neutral/default|default": "16.12/98.0/p|14.27/-101.3/p|16.12/98.0/p|14.27/-101.3/p",
  "on-neutral|neutral/hover|hover": "13.96/88.7/p|10.01/-94.9/p|13.96/88.7/p|10.01/-94.9/p",
  "on-neutral|neutral/pressed|pressed": "11.99/79.6/p|7.40/-88.3/p|11.99/79.6/p|7.40/-88.3/p",
  "on-danger|danger/default|default": "4.77/-75.6/p|4.77/-75.6/p|4.77/-75.6/p|4.77/-75.6/p",
  "on-danger|danger/hover|hover": "6.42/-84.3/p|6.42/-84.3/p|6.42/-84.3/p|6.42/-84.3/p",
  "on-danger|danger/pressed|pressed": "8.36/-91.3/p|8.36/-91.3/p|8.36/-91.3/p|8.36/-91.3/p",
  "on-disabled|disabled|default": "2.39/44.7/x|3.09/-24.9/x|2.39/44.7/x|3.09/-24.9/x",
  "on-success|success/default|default": "4.95/-79.0/p|4.95/-79.0/p|4.95/-79.0/p|4.95/-79.0/p",
  "on-success-subtle|success/subtle|default": "6.81/81.0/p|12.37/-90.5/p|6.81/81.0/p|12.37/-90.5/p",
  "on-warning|warning/default|default": "9.32/62.4/p|9.32/62.4/p|9.32/62.4/p|9.32/62.4/p",
  "on-warning-subtle|warning/subtle|default": "8.73/87.6/p|12.05/-88.3/p|8.73/87.6/p|12.05/-88.3/p",
  "on-info|info/default|default": "5.86/-83.9/p|5.86/-83.9/p|5.86/-83.9/p|5.86/-83.9/p",
  "on-info-subtle|info/subtle|default": "7.05/81.1/p|10.44/-82.8/p|7.05/81.1/p|10.44/-82.8/p",
  "on-danger-subtle|danger/subtle|default": "7.64/80.3/p|11.12/-78.9/p|7.64/80.3/p|11.12/-78.9/p",
  "on-danger-subtle|danger/subtle-hover|hover": "6.85/73.3/p|6.90/-70.0/p|6.85/73.3/p|6.90/-70.0/p",
  "on-danger-subtle|danger/subtle-pressed|pressed": "5.75/62.7/p|5.75/-65.2/p|5.75/62.7/p|5.75/-65.2/p",
  "on-inverse|inverse/default|default": "19.90/-107.8/p|19.90/105.9/p|19.90/-107.8/p|19.90/105.9/p",
  "on-inverse|inverse/hover|hover": "14.89/-104.6/p|15.68/90.1/p|14.89/-104.6/p|15.68/90.1/p",
  "on-inverse|inverse/pressed|pressed": "10.44/-98.3/p|13.46/81.0/p|10.44/-98.3/p|13.46/81.0/p",
  "on-primary-subtle|primary/subtle|default": "8.50/80.2/p|7.23/-79.1/p|11.54/86.0/p|7.49/-79.2/p",
  "on-primary-subtle|primary/subtle-hover|hover": "7.29/70.9/p|8.50/-82.9/p|9.82/76.6/p|11.54/-87.5/p",
  "on-primary-subtle|primary/subtle-pressed|pressed": "5.72/57.7/w|12.11/-89.6/p|7.77/64.3/p|11.54/-87.5/p",
  "on-surface-danger|surface|default": "6.42/79.1/p|6.89/-47.4/w|6.42/79.1/p|6.89/-47.4/w",
  "link/default|surface|default": "6.83/82.4/p|7.54/-50.7/w|7.54/85.7/p|8.21/-54.9/w",
  "link/hover|surface|hover": "8.82/89.3/p|10.97/-68.8/p|9.41/91.4/p|10.67/-67.9/p",
  "link-danger/default|surface|default": "6.42/79.1/p|6.89/-47.4/w|6.42/79.1/p|6.89/-47.4/w",
  "link-danger/hover|surface|hover": "8.36/86.5/p|10.37/-65.9/p|8.36/86.5/p|10.37/-65.9/p"
 }
};
// ===== /DATA =====

const log = { createdNodeIds: [], notes: [], warnings: [] };

// ---------- шрифты: оба бренда, все веса из текстовых стилей ----------
const FONTS = [
  ["Inter", "Regular"], ["Inter", "Medium"], ["Inter", "Semi Bold"],
  ["IBM Plex Sans", "Regular"], ["IBM Plex Sans", "Medium"], ["IBM Plex Sans", "SemiBold"],
  ["IBM Plex Serif", "Regular"], ["IBM Plex Serif", "Medium"], ["IBM Plex Serif", "SemiBold"],
  ["JetBrains Mono", "Regular"],
];
const available = await figma.listAvailableFontsAsync();
for (const [family, style] of FONTS) {
  if (!available.some((f) => f.fontName.family === family && f.fontName.style === style))
    throw new Error(`нет начертания ${family} ${style} — страница собралась бы с подменой шрифта`);
}
await Promise.all(FONTS.map(([family, style]) => figma.loadFontAsync({ family, style })));

// ---------- коллекции, режимы, переменные, стили ----------
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const C = {};
for (const c of collections) C[c.name] = c;
const modeId = (coll, name) => {
  const m = C[coll].modes.find((x) => x.name === name);
  if (!m) throw new Error(`в коллекции ${coll} нет режима ${name}`);
  return m.modeId;
};
const MODE = { Main: modeId("Brand", "Main"), Demo: modeId("Brand", "Demo"), Light: modeId("Theme", "Light"), Dark: modeId("Theme", "Dark") };

const allVars = await figma.variables.getLocalVariablesAsync();
const V = new Map(allVars.map((v) => [v.name, v]));
const byId = new Map(allVars.map((v) => [v.id, v]));
const collById = new Map(collections.map((c) => [c.id, c]));
const need = (name) => {
  const v = V.get(name);
  if (!v) throw new Error(`нет переменной ${name}`);
  return v;
};

function resolve(name, brand, theme, depth) {
  const v = need(name);
  if ((depth || 0) > 12) throw new Error(`цикл алиасов на ${name}`);
  const cname = collById.get(v.variableCollectionId).name;
  const m = cname === "Brand" ? MODE[brand] : cname === "Theme" ? MODE[theme] : C[cname].modes[0].modeId;
  const raw = v.valuesByMode[m];
  if (raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS") return resolve(byId.get(raw.id).name, brand, theme, (depth || 0) + 1);
  return raw;
}
const h2 = (n) => Math.round(n * 255).toString(16).padStart(2, "0").toUpperCase();
const hex = (c) => `#${h2(c.r)}${h2(c.g)}${h2(c.b)}` + (c.a != null && c.a < 0.999 ? ` ${Math.round(c.a * 100)}%` : "");

const textStyles = await figma.getLocalTextStylesAsync();
const TS = new Map(textStyles.map((s) => [s.name, s]));
const styleId = (name) => {
  const s = TS.get(name);
  if (!s) throw new Error(`нет текстового стиля ${name}`);
  return s.id;
};
const effectStyles = await figma.getLocalEffectStylesAsync();
const ES = new Map(effectStyles.map((s) => [s.name, s]));

// ---------- строительные блоки ----------
const RADII = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
const paint = (name) => figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", need(name));
const bindRadius = (node, name) => { for (const f of RADII) node.setBoundVariable(f, need(name)); };
const setModes = (node, brand, theme) => {
  node.setExplicitVariableModeForCollection(C.Brand, MODE[brand]);
  node.setExplicitVariableModeForCollection(C.Theme, MODE[theme]);
};

// Новый фрейм в Figma по умолчанию clipsContent=true — ловушка (SKILL.md → «Топ-5 ловушек»):
// контейнер ровно по размеру контента режет тень/кольцо фокуса, которые выходят за его границы.
// Единая точка создания простого (не auto-layout) фрейма — чтобы её нельзя было забыть.
// Тот же helper дословно — в figma-playground/00-shared.js.
function newFrame() {
  const f = figma.createFrame();
  f.clipsContent = false;
  return f;
}
function AL(dir, props) {
  const f = figma.createAutoLayout(dir, props || {});
  f.fills = [];
  f.clipsContent = false; // контейнеры не режут тени и кольца фокуса
  return f;
}
async function T(style, chars, colorName) {
  const t = figma.createText();
  t.characters = chars;
  await t.setTextStyleIdAsync(styleId(style));
  t.fills = [paint(colorName)];
  t.name = `${chars.slice(0, 24)} · ${style}`;
  return t;
}
async function para(style, chars, colorName, width) {
  const t = await T(style, chars, colorName);
  t.textAutoResize = "HEIGHT";
  t.resize(width, t.height);
  return t;
}
// плашка-образец: заливка + радиус + обводка, всё переменными
function block(w, h, fillNames, opts) {
  const o = opts || {};
  const f = newFrame();
  f.name = (Array.isArray(fillNames) ? fillNames.join(" + ") : fillNames) || o.border || "sample";
  f.resize(w, h);
  f.fills = (Array.isArray(fillNames) ? fillNames : [fillNames]).map(paint);
  bindRadius(f, o.radius || "radius/md");
  if (o.border !== false) {
    f.strokes = [paint(o.border || "color/border/default")];
    f.strokeWeight = o.borderWeight || 1;
    f.strokeAlign = "INSIDE";
  }
  return f;
}
const cell = (gap, name) => AL("VERTICAL", { name: name || "cell", itemSpacing: gap == null ? 6 : gap, counterAxisAlignItems: "MIN" });
const rowOf = (gap, name) => AL("HORIZONTAL", { name: name || "row", itemSpacing: gap == null ? 12 : gap, counterAxisAlignItems: "MIN" });

// образец роли: плашка хватает по содержимому, иначе длинная подпись вылезает за край
async function plate(surfaceName, contentName, label) {
  const p = AL("HORIZONTAL", {
    name: surfaceName, itemSpacing: 0,
    paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 12,
    primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER",
  });
  p.fills = [paint(surfaceName)];
  bindRadius(p, "radius/md");
  if (surfaceName.startsWith("color/surface")) {
    p.strokes = [paint("color/border/default")];
    p.strokeWeight = 1;
  }
  p.appendChild(await T("label/sm", label, contentName));
  return p;
}

// контраст из DATA
const COMBOS = DATA.meta.combos;
function contrastCaption(contentName, surfaceName, state, combo) {
  const key = `${contentName.replace("color/", "")}|${surfaceName.replace("color/", "")}|${state}`;
  const row = DATA.contrast[key];
  if (!row) { log.warnings.push(`нет контраста для ${key}`); return "контраст не посчитан"; }
  const parts = row.split("|")[COMBOS.indexOf(combo)].split("/");
  const mark = parts[2] === "w" ? "  ⚠ APCA" : parts[2] === "e" ? "  ✗ WCAG" : parts[2] === "x" ? "  exempt" : "";
  return `W ${parts[0]} · A ${parts[1]}${mark}`;
}

// ---------- наборы ролей ----------
const FAMILIES = [
  ["color/primary/*", "color/on-primary", [["default", "color/primary/default"], ["hover", "color/primary/hover"], ["pressed", "color/primary/pressed"]]],
  ["color/primary/subtle*", "color/on-primary-subtle", [["default", "color/primary/subtle"], ["hover", "color/primary/subtle-hover"], ["pressed", "color/primary/subtle-pressed"]]],
  ["color/secondary/*", "color/on-secondary", [["default", "color/secondary/default"], ["hover", "color/secondary/hover"], ["pressed", "color/secondary/pressed"]]],
  ["color/neutral/*", "color/on-neutral", [["default", "color/neutral/default"], ["hover", "color/neutral/hover"], ["pressed", "color/neutral/pressed"]]],
  ["color/inverse/*", "color/on-inverse", [["default", "color/inverse/default"], ["hover", "color/inverse/hover"], ["pressed", "color/inverse/pressed"]]],
  ["color/danger/*", "color/on-danger", [["default", "color/danger/default"], ["hover", "color/danger/hover"], ["pressed", "color/danger/pressed"]]],
  ["color/danger/subtle*", "color/on-danger-subtle", [["default", "color/danger/subtle"], ["hover", "color/danger/subtle-hover"], ["pressed", "color/danger/subtle-pressed"]]],
  ["color/success/*", "color/on-success", [["default", "color/success/default"]]],
  ["color/success/subtle", "color/on-success-subtle", [["default", "color/success/subtle"]]],
  ["color/warning/*", "color/on-warning", [["default", "color/warning/default"]]],
  ["color/warning/subtle", "color/on-warning-subtle", [["default", "color/warning/subtle"]]],
  ["color/info/*", "color/on-info", [["default", "color/info/default"]]],
  ["color/info/subtle", "color/on-info-subtle", [["default", "color/info/subtle"]]],
  ["color/disabled", "color/on-disabled", [["default", "color/disabled"]]],
];
const LINKS = [
  ["color/link/*", [["default", "color/link/default"], ["hover", "color/link/hover"]]],
  ["color/link-danger/*", [["default", "color/link-danger/default"], ["hover", "color/link-danger/hover"]]],
  // красный текст на поверхности без собственной подложки: звёздочка обязательного поля, текст ошибки
  ["color/on-surface-danger", [["default", "color/on-surface-danger"]]],
];
const SURFACES = [
  ["color/surface", "color/on-surface"],
  ["color/surface-raised", "color/on-surface-raised"],
  ["color/surface-overlay", "color/on-surface-overlay"],
  ["color/surface-muted", "color/on-surface-muted"],
  ["color/surface-hover", "color/on-surface-hover"],
];
const SINGLES = [
  { name: "color/border/default", kind: "stroke" },
  { name: "color/border/input", kind: "stroke" },
  { name: "color/focus-ring", kind: "stroke" },
  { name: "color/scrim", kind: "fill", border: true },
  { name: "color/dataviz/1", kind: "fill" }, { name: "color/dataviz/2", kind: "fill" },
  { name: "color/dataviz/3", kind: "fill" }, { name: "color/dataviz/4", kind: "fill" },
  { name: "color/dataviz/5", kind: "fill" },
];

// ---------- страница ----------
let page = figma.root.children.find((p) => p.name === "Foundations");
if (!page) {
  page = figma.createPage();
  page.name = "Foundations";
  const after = figma.root.children.findIndex((p) => p.name === "Components");
  figma.root.insertChild(after > 0 ? after : figma.root.children.length - 1, page);
  log.notes.push("страница Foundations создана");
} else {
  log.notes.push(`страница Foundations очищена (было ${page.children.length} объектов)`);
}
await figma.setCurrentPageAsync(page);
for (const child of [...page.children]) child.remove();

const STAMP = `${DATA.meta.tokensFile} @ ${DATA.meta.tokensCommit} · ${DATA.meta.tokensCommitDate}   →   собрано ${DATA.meta.builtAt}`;
const frames = [];

// Каждая тема — самостоятельный фрейм верхнего уровня: своя шапка, свои режимы Brand и Theme.
// Режимы заданы на самом фрейме (не на общей обёртке), поэтому фрейм можно скопировать
// в другой файл или на другую страницу — он останется в Main / Light и не станет наследовать чужое.
async function topFrame(num, title, note) {
  const f = AL("VERTICAL", {
    name: `${num} ${title}`, itemSpacing: 28,
    paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 40,
    counterAxisAlignItems: "MIN",
  });
  f.fills = [paint("color/surface")];
  f.strokes = [paint("color/border/default")];
  f.strokeWeight = 1;
  bindRadius(f, "radius/xl");
  setModes(f, "Main", "Light");
  page.appendChild(f);

  const head = cell(8, "header");
  head.appendChild(await T("heading/2", `${num} ${title}`, "color/on-surface"));
  head.appendChild(await T("numeric/xs", STAMP, "color/on-surface-muted"));
  if (note) head.appendChild(await para("body/sm", note, "color/on-surface-muted", 880));
  head.appendChild(await T("numeric/2xs", "подписи статичны — после правки токенов пересобрать: node scripts/build-figma-script.mjs foundations", "color/on-surface-muted"));
  f.appendChild(head);
  frames.push(f);
  return f;
}
// ячейка с явными режимами внутри темы
async function modeCell(brand, theme) {
  const f = AL("VERTICAL", {
    name: `Brand = ${brand} · Theme = ${theme}`, itemSpacing: 18,
    paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20,
    counterAxisAlignItems: "MIN",
  });
  f.fills = [paint("color/surface")];
  f.strokes = [paint("color/border/default")];
  f.strokeWeight = 1;
  bindRadius(f, "radius/lg");
  setModes(f, brand, theme);
  f.appendChild(await T("label/lg", `Brand = ${brand} · Theme = ${theme}`, "color/on-surface"));
  return f;
}
// сетка 2 × 2: колонки Main / Demo, строки Light / Dark
async function grid2x2(fill) {
  const g = cell(24, "2×2");
  for (const theme of ["Light", "Dark"]) {
    const r = rowOf(24, `Theme = ${theme}`);
    for (const brand of ["Main", "Demo"]) {
      const c = await modeCell(brand, theme);
      await fill(c, brand, theme, `${brand}/${theme}`);
      r.appendChild(c);
    }
    g.appendChild(r);
  }
  return g;
}
