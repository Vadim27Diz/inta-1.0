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
  "tokensCommit": "55b4a91",
  "tokensCommitDate": "2026-10-15",
  "builtAt": "2026-10-15",
  "pairs": 37,
  "checks": 148,
  "combos": ["Main/Light", "Main/Dark", "Demo/Light", "Demo/Dark"]
 },
 "contrast": {
  "on-surface|surface|default": "19.90/105.9/p|19.06/-104.5/p|19.90/105.9/p|19.06/-104.5/p",
  "on-surface-raised|surface-raised|default": "19.90/105.9/p|16.97/-103.4/p|19.90/105.9/p|16.97/-103.4/p",
  "on-surface-overlay|surface-overlay|default": "19.90/105.9/p|16.97/-103.4/p|19.90/105.9/p|16.97/-103.4/p",
  "on-surface-muted|surface-muted|default": "7.02/80.3/p|5.68/-47.4/w|7.02/80.3/p|5.68/-47.4/w",
  "on-surface-hover|surface-hover|default": "16.12/98.0/p|14.27/-101.3/p|16.12/98.0/p|14.27/-101.3/p",
  "on-primary|primary/default|default": "5.25/-80.4/p|5.25/-80.4/p|5.36/-81.5/p|5.36/-81.5/p",
  "on-primary|primary/hover|hover": "6.94/-89.9/p|6.94/-89.9/p|7.52/-92.4/p|7.52/-92.4/p",
  "on-primary|primary/pressed|pressed": "8.59/-97.0/p|8.59/-97.0/p|10.37/-102.6/p|10.37/-102.6/p",
  "on-secondary|secondary/default|default": "5.75/-83.9/p|5.75/-83.9/p|4.60/-74.6/p|4.60/-74.6/p",
  "on-secondary|secondary/hover|hover": "7.43/-92.0/p|7.43/-92.0/p|6.23/-86.0/p|6.23/-86.0/p",
  "on-secondary|secondary/pressed|pressed": "9.05/-98.6/p|9.05/-98.6/p|8.59/-97.2/p|8.59/-97.2/p",
  "on-neutral|neutral/default|default": "16.12/98.0/p|14.27/-101.3/p|16.12/98.0/p|14.27/-101.3/p",
  "on-neutral|neutral/hover|hover": "14.11/92.8/p|11.33/-93.2/p|14.11/92.8/p|11.33/-93.2/p",
  "on-neutral|neutral/pressed|pressed": "11.22/84.5/p|8.17/-80.3/p|11.22/84.5/p|8.17/-80.3/p",
  "on-danger|danger/default|default": "4.83/-77.5/p|4.83/-77.5/p|4.83/-77.5/p|4.83/-77.5/p",
  "on-danger|danger/hover|hover": "6.23/-86.0/p|6.23/-86.0/p|6.23/-86.0/p|6.23/-86.0/p",
  "on-danger|danger/pressed|pressed": "7.73/-93.2/p|7.73/-93.2/p|7.73/-93.2/p|7.73/-93.2/p",
  "on-disabled|disabled|default": "1.88/26.4/x|2.45/-30.8/x|1.88/26.4/x|2.45/-30.8/x",
  "on-success|success/default|default": "5.07/-79.3/p|5.07/-79.3/p|5.07/-79.3/p|5.07/-79.3/p",
  "on-success-subtle|success/subtle|default": "7.16/80.6/p|8.31/-92.9/p|7.16/80.6/p|8.31/-92.9/p",
  "on-warning|warning/default|default": "7.52/90.8/p|7.52/90.8/p|7.52/90.8/p|7.52/90.8/p",
  "on-warning-subtle|warning/subtle|default": "7.47/81.9/p|8.45/-93.8/p|7.47/81.9/p|8.45/-93.8/p",
  "on-info|info/default|default": "5.25/-80.5/p|5.25/-80.5/p|5.25/-80.5/p|5.25/-80.5/p",
  "on-info-subtle|info/subtle|default": "7.14/80.2/p|8.21/-92.2/p|7.14/80.2/p|8.21/-92.2/p",
  "on-danger-subtle|danger/subtle|default": "7.12/80.0/p|8.06/-91.3/p|7.12/80.0/p|8.06/-91.3/p",
  "on-danger-subtle|danger/subtle-hover|hover": "6.33/75.9/p|6.68/-83.6/p|6.33/75.9/p|6.68/-83.6/p",
  "on-danger-subtle|danger/subtle-pressed|pressed": "5.31/69.3/p|4.98/-71.7/p|5.31/69.3/p|4.98/-71.7/p",
  "on-inverse|inverse/default|default": "19.06/-104.5/p|19.90/105.9/p|19.06/-104.5/p|19.90/105.9/p",
  "on-inverse|inverse/hover|hover": "14.27/-101.3/p|16.12/98.0/p|14.27/-101.3/p|16.12/98.0/p",
  "on-inverse|inverse/pressed|pressed": "10.18/-94.7/p|11.22/84.5/p|10.18/-94.7/p|11.22/84.5/p",
  "on-primary-subtle|primary/subtle|default": "8.37/85.8/p|6.42/-82.6/p|8.14/84.6/p|7.34/-88.4/p",
  "on-primary-subtle|primary/subtle-hover|hover": "7.13/79.3/p|8.37/-93.6/p|6.52/75.7/p|9.93/-99.5/p",
  "on-primary-subtle|primary/subtle-pressed|pressed": "5.72/57.7/w|10.07/-99.1/p|4.87/64.2/p|9.93/-99.5/p",
  "link/default|surface|default": "6.94/89.9/p|7.54/-50.7/w|7.52/92.4/p|8.21/-54.9/w",
  "link/hover|surface|hover": "8.59/97.0/p|5.37/-62.0/p|10.37/102.6/p|5.46/-67.5/p",
  "link-danger/default|surface|default": "7.73/93.2/p|6.89/-47.4/w|7.73/93.2/p|6.89/-47.4/w",
  "link-danger/hover|surface|hover": "9.73/100.0/p|4.72/-56.9/p|9.73/100.0/p|4.72/-56.9/p"
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
  const f = figma.createFrame();
  f.name = (Array.isArray(fillNames) ? fillNames.join(" + ") : fillNames) || o.border || "sample";
  f.resize(w, h);
  f.clipsContent = false;
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
  head.appendChild(await T("numeric/2xs", "подписи статичны — после правки токенов пересобрать генератором assets/figma-foundations.js", "color/on-surface-muted"));
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

// ---------- 01 Palette ----------
{
  const f = await topFrame("01", "Palette", "Слой Primitives: сырые значения, scopes пустые, в пикерах они не видны, и компоненты их не используют. Подпись — имя переменной и её hex.");
  const SCALES = ["blue", "violet", "teal", "orange", "zinc", "red", "green", "amber", "sky"];
  for (const scale of SCALES) {
    const g = cell(8, `color/${scale}`);
    g.appendChild(await T("label/md", `color/${scale}`, "color/on-surface"));
    const r = rowOf(8);
    const steps = allVars
      .filter((v) => v.name.startsWith(`color/${scale}/`))
      .map((v) => v.name.split("/")[2])
      .sort((a, b) => Number(a) - Number(b));
    for (const step of steps) {
      const name = `color/${scale}/${step}`;
      const c = cell(4);
      c.appendChild(block(84, 52, name));
      c.appendChild(await T("label/sm", step, "color/on-surface"));
      c.appendChild(await T("numeric/2xs", hex(resolve(name, "Main", "Light")), "color/on-surface-muted"));
      r.appendChild(c);
    }
    g.appendChild(r);
    f.appendChild(g);
  }
  const g = cell(8, "одиночные и альфа");
  g.appendChild(await T("label/md", "одиночные и альфа", "color/on-surface"));
  const r = rowOf(8);
  for (const spec of [
    { name: "color/white", fills: ["color/white"] },
    { name: "color/black", fills: ["color/black"] },
    { name: "color/black-alpha/50", fills: ["color/white", "color/black-alpha/50"] },
    { name: "color/black-alpha/80", fills: ["color/white", "color/black-alpha/80"] },
  ]) {
    const c = cell(4);
    c.appendChild(block(140, 52, spec.fills));
    c.appendChild(await T("label/sm", spec.name.replace("color/", ""), "color/on-surface"));
    c.appendChild(await T("numeric/2xs", hex(resolve(spec.name, "Main", "Light")), "color/on-surface-muted"));
    r.appendChild(c);
  }
  g.appendChild(r);
  f.appendChild(g);
}

// ---------- 02 Brand ----------
{
  const f = await topFrame("02", "Brand", "Роль → Main / Demo. У каждой ячейки режим Brand задан явно, Theme = Light. Если образец не перекрасился между ячейками — в нём не переменная, а значение.");
  const row = rowOf(32, "brands");
  for (const brand of ["Main", "Demo"]) {
    const cellFrame = await modeCell(brand, "Light");
    const addRow = async (label, build) => {
      const g = cell(8);
      g.appendChild(await T("label/sm", label, "color/on-surface-muted"));
      g.appendChild(await build());
      cellFrame.appendChild(g);
    };
    for (const family of ["primary", "secondary"]) {
      await addRow(`color/${family}/* + color/on-${family}`, async () => {
        const r = rowOf(10);
        for (const state of ["default", "hover", "pressed"]) {
          const name = `color/${family}/${state}`;
          const c = cell(4);
          c.appendChild(await plate(name, `color/on-${family}`, `Aa on-${family}`));
          c.appendChild(await T("numeric/2xs", `${state} · ${hex(resolve(name, brand, "Light"))}`, "color/on-surface-muted"));
          r.appendChild(c);
        }
        return r;
      });
    }
    await addRow("font/sans · текст стилем body/md", async () => {
      const c = cell(4);
      c.appendChild(await T("body/md", "Съешь ещё этих мягких булок Aa 123", "color/on-surface"));
      c.appendChild(await T("numeric/2xs", `font/sans → ${resolve("font/sans", brand, "Light")}`, "color/on-surface-muted"));
      return c;
    });
    await addRow("font/heading · текст стилем heading/4", async () => {
      const c = cell(4);
      c.appendChild(await T("heading/4", "Заголовок Aa Яя", "color/on-surface"));
      c.appendChild(await T("numeric/2xs", `font/heading → ${resolve("font/heading", brand, "Light")}`, "color/on-surface-muted"));
      return c;
    });
    await addRow("radius/sm…xl", async () => {
      const r = rowOf(10);
      for (const size of ["sm", "md", "lg", "xl"]) {
        const c = cell(4);
        c.appendChild(block(56, 56, "color/primary/default", { radius: `radius/${size}`, border: false }));
        c.appendChild(await T("numeric/2xs", `${size} · ${resolve(`radius/${size}`, brand, "Light")}`, "color/on-surface-muted"));
        r.appendChild(c);
      }
      return r;
    });
    row.appendChild(cellFrame);
  }
  f.appendChild(row);
}

// ---------- 03 Color roles ----------
{
  const f = await topFrame("03", "Color roles",
    "Слой Theme, пары X / on-X. Сетка 2 × 2: колонки Main / Demo, строки Light / Dark, режимы заданы на каждой ячейке. Под каждым образцом — WCAG и APCA из npm run tokens:contrast для этой комбинации. ⚠ APCA = |Lc| < 60 (предупреждение, не ошибка); exempt — WCAG 1.4.3 не требует контраста от выключенных контролов.");
  f.appendChild(await grid2x2(async (c, brand, theme, combo) => {
    for (const fam of FAMILIES) {
      const g = cell(6);
      g.appendChild(await T("numeric/xs", `${fam[0]}  +  ${fam[1].replace("color/", "")}`, "color/on-surface-muted"));
      const r = rowOf(8);
      for (const st of fam[2]) {
        const cc = cell(4);
        cc.appendChild(await plate(st[1], fam[1], `Aa ${fam[1].replace("color/", "")}`));
        cc.appendChild(await T("numeric/2xs", `${st[0]} · ${st[1].replace("color/", "")}`, "color/on-surface-muted"));
        cc.appendChild(await T("numeric/2xs", contrastCaption(fam[1], st[1], st[0], combo), "color/on-surface-muted"));
        r.appendChild(cc);
      }
      g.appendChild(r);
      c.appendChild(g);
    }
    for (const link of LINKS) {
      const g = cell(6);
      g.appendChild(await T("numeric/xs", `${link[0]}  на  color/surface`, "color/on-surface-muted"));
      const r = rowOf(8);
      for (const st of link[1]) {
        const cc = cell(4);
        cc.appendChild(await plate("color/surface", st[1], `Aa ${st[1].replace("color/", "")}`));
        cc.appendChild(await T("numeric/2xs", `${st[0]} · ${st[1].replace("color/", "")}`, "color/on-surface-muted"));
        cc.appendChild(await T("numeric/2xs", contrastCaption(st[1], "color/surface", st[0], combo), "color/on-surface-muted"));
        r.appendChild(cc);
      }
      g.appendChild(r);
      c.appendChild(g);
    }
  }));
}

// ---------- 04 Surfaces & single roles ----------
{
  const f = await topFrame("04", "Surfaces & single roles",
    "Поверхности с их on-токеном и контрастом, а ниже — роли, у которых пары on-* нет: обводки, кольцо фокуса, затемнение и шкала dataviz. Та же сетка 2 × 2, режимы на каждой ячейке.");
  f.appendChild(await grid2x2(async (c, brand, theme, combo) => {
    const surf = cell(10, "surfaces");
    surf.appendChild(await T("label/md", "Поверхности", "color/on-surface"));
    for (const sp of SURFACES) {
      const cc = cell(4);
      cc.appendChild(await plate(sp[0], sp[1], `Aa ${sp[1].replace("color/", "")}`));
      cc.appendChild(await T("numeric/2xs", `${sp[0].replace("color/", "")} · ${contrastCaption(sp[1], sp[0], "default", combo)}`, "color/on-surface-muted"));
      surf.appendChild(cc);
    }
    c.appendChild(surf);

    const single = cell(10, "singles");
    single.appendChild(await T("label/md", "Одиночные роли (пары on-* нет)", "color/on-surface"));
    const sr = rowOf(8);
    for (const sg of SINGLES) {
      const cc = cell(4);
      cc.appendChild(sg.kind === "stroke"
        ? block(104, 40, [], { border: sg.name, borderWeight: 2 })
        : block(104, 40, sg.name, { border: sg.border ? "color/border/default" : false }));
      cc.appendChild(await para("numeric/2xs", sg.name.replace("color/", ""), "color/on-surface-muted", 104));
      sr.appendChild(cc);
    }
    single.appendChild(sr);
    c.appendChild(single);
  }));
}

// ---------- 05 Typography ----------
{
  const f = await topFrame("05", "Typography",
    "18 текстовых стилей 1:1 с классами typo-*. Образец набран стилем (ручных размеров нет), поэтому семейство меняется вместе с брендом: слева Main, справа Demo.");
  const sample = (name) =>
    name.startsWith("heading") ? "Заголовок Aa Яя" :
    name.startsWith("numeric") || name === "code" ? "0123456789 · −12,5 %" :
    name.startsWith("label") ? "Подпись контрола Aa" :
    "Съешь ещё этих мягких французских булок Aa Яя";
  const row = rowOf(32, "brands");
  for (const brand of ["Main", "Demo"]) {
    const c = await modeCell(brand, "Light");
    for (const st of textStyles) {
      const g = cell(2);
      g.appendChild(await T(st.name, sample(st.name), "color/on-surface"));
      const famVar = st.boundVariables && st.boundVariables.fontFamily ? byId.get(st.boundVariables.fontFamily.id) : null;
      const wVar = st.boundVariables && st.boundVariables.fontWeight ? byId.get(st.boundVariables.fontWeight.id) : null;
      const lh = typeof st.lineHeight === "object" && st.lineHeight.unit === "PIXELS" ? st.lineHeight.value : "auto";
      const weight = wVar ? resolve(wVar.name, brand, "Light") : st.fontName.style;
      g.appendChild(await T("numeric/2xs",
        `typo-${st.name.replace(/\//g, "-")} · ${famVar ? famVar.name + " → " + resolve(famVar.name, brand, "Light") : st.fontName.family} · ${st.fontSize}/${lh} · ${weight}`,
        "color/on-surface-muted"));
      c.appendChild(g);
    }
    row.appendChild(c);
  }
  f.appendChild(row);
}

// ---------- 06 Radius ----------
{
  const f = await topFrame("06", "Radius", "radius/none и radius/full живут в Primitives, radius/sm…xl — в Brand: они меняются вместе с брендом. Подпись — значение в этом бренде.");
  const row = rowOf(32, "brands");
  for (const brand of ["Main", "Demo"]) {
    const c = await modeCell(brand, "Light");
    const r = rowOf(12, "radii");
    for (const size of ["none", "sm", "md", "lg", "xl", "full"]) {
      const cc = cell(4);
      cc.appendChild(block(72, 72, "color/primary/default", { radius: `radius/${size}`, border: false }));
      cc.appendChild(await T("numeric/2xs", `${size} · ${resolve(`radius/${size}`, brand, "Light")}`, "color/on-surface-muted"));
      r.appendChild(cc);
    }
    c.appendChild(r);
    row.appendChild(c);
  }
  f.appendChild(row);
}

// ---------- 07 Shadows ----------
{
  const f = await topFrame("07", "Shadows", "Эффект-стили shadow/xs…xl со значениями Tailwind. Цвет тени задан в эффекте (чёрный с альфой Tailwind), а не переменной: привязка переменной к цвету эффекта тянет её альфу 1.0 и делает тень непрозрачной.");
  const r = AL("HORIZONTAL", { name: "shadows", itemSpacing: 32, paddingTop: 24, paddingBottom: 32, paddingLeft: 8, paddingRight: 8, counterAxisAlignItems: "MIN" });
  for (const name of ["shadow/xs", "shadow/sm", "shadow/md", "shadow/lg", "shadow/xl"]) {
    const st = ES.get(name);
    if (!st) throw new Error(`нет эффект-стиля ${name}`);
    const c = cell(10);
    const card = block(140, 88, "color/surface-raised", { radius: "radius/lg" });
    card.clipsContent = true; // иначе Figma не рисует тень фрейма вовсе
    await card.setEffectStyleIdAsync(st.id);
    c.appendChild(card);
    c.appendChild(await T("numeric/2xs", name, "color/on-surface-muted"));
    r.appendChild(c);
  }
  f.appendChild(r);
}

// ---------- 08 Spacing ----------
{
  const f = await topFrame("08", "Spacing", "spacing/* = шкала Tailwind (spacing/4 = 16 = p-4). Ширина полоски привязана к переменной, подпись — её значение.");
  const spacings = allVars
    .filter((v) => v.name.startsWith("spacing/"))
    .map((v) => ({ name: v.name, value: resolve(v.name, "Main", "Light") }))
    .sort((a, b) => a.value - b.value);
  const grid = rowOf(40, "spacing-scale");
  const perCol = Math.ceil(spacings.length / 2);
  for (let i = 0; i < 2; i++) {
    const colBox = cell(6);
    for (const sp of spacings.slice(i * perCol, (i + 1) * perCol)) {
      const r = AL("HORIZONTAL", { name: sp.name, itemSpacing: 12, counterAxisAlignItems: "CENTER" });
      r.appendChild(await para("numeric/xs", sp.name, "color/on-surface", 112));
      const bar = figma.createFrame();
      bar.name = sp.name;
      bar.resize(Math.max(sp.value, 0.01), 14);
      bar.fills = [paint("color/primary/default")];
      bindRadius(bar, "radius/sm");
      bar.clipsContent = false;
      r.appendChild(bar);
      try {
        bar.setBoundVariable("width", need(sp.name));
      } catch (e) {
        log.warnings.push(`ширина не привязалась к ${sp.name}: ${e.message}`);
      }
      r.appendChild(await T("numeric/xs", String(sp.value), "color/on-surface-muted"));
      colBox.appendChild(r);
    }
    grid.appendChild(colBox);
  }
  f.appendChild(grid);
}

// ---------- раскладка: слева направо, сверху вниз, отступ 160 ----------
const GAP = 160;
const MAX_ROW = 5200;
let x = 0, y = 0, rowH = 0;
for (const f of frames) {
  if (x > 0 && x + f.width > MAX_ROW) { x = 0; y += rowH + GAP; rowH = 0; }
  f.x = x;
  f.y = y;
  x += f.width + GAP;
  rowH = Math.max(rowH, f.height);
}

log.createdNodeIds.push(...frames.map((f) => f.id));
return {
  createdNodeIds: log.createdNodeIds,
  pageId: page.id,
  frames: frames.map((f) => `${f.name} = ${f.id} · ${Math.round(f.width)}×${Math.round(f.height)} @${Math.round(f.x)},${Math.round(f.y)}`),
  notes: log.notes,
  warnings: log.warnings,
};
