// Проверка страницы Foundations: ни одного несвязанного цвета, ни одного ручного размера текста.
// Read-only, запускать через `use_figma` после каждой пересборки (assets/figma-foundations.js).
//
// Ожидаемый результат: unboundPaints: [], textWithoutStyle: [], unboundRadii: [], localEffects: [],
// textOverflow: [], primitivesInPaints: [], framesWithoutModes: [] и topFrames: 8 — по фрейму на тему,
// у каждого заданы оба режима (Brand и Theme), чтобы фрейм работал сам по себе при копировании.
// Единственное задокументированное исключение — цвета внутри эффект-стилей shadow/*: там чёрный
// с альфой Tailwind задан прямо в эффекте (привязка переменной тянет альфу 1.0 и делает тень
// непрозрачной). Скрипт проверяет, что тени приходят из стиля, а не нарисованы на месте.
const page = figma.root.children.find((p) => p.name === "Foundations");
if (!page) throw new Error("страницы Foundations нет");
await figma.setCurrentPageAsync(page);

const allVars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(allVars.map((v) => [v.id, v.name]));
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collById = new Map(collections.map((c) => [c.id, c.name]));
const varName = (id) => byId.get(id) || `(не локальная ${id})`;
const layerOf = (id) => {
  const v = allVars.find((x) => x.id === id);
  return v ? collById.get(v.variableCollectionId) : "?";
};

const path = (n) => {
  const parts = [];
  let cur = n;
  while (cur && cur.type !== "PAGE") { parts.unshift(cur.name); cur = cur.parent; }
  return parts.join(" / ");
};

const report = {
  counts: { nodes: 0, paints: 0, boundPaints: 0, texts: 0 },
  unboundPaints: [],
  textWithoutStyle: [],
  unboundRadii: [],
  localEffects: [],
  primitivesInPaints: [],
  explicitModeFrames: [],
  usedTokens: {},
  usedTextStyles: {},
  usedEffectStyles: {},
};

const RADII = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
const textStyles = await figma.getLocalTextStylesAsync();
const tsName = new Map(textStyles.map((s) => [s.id, s.name]));
const effectStyles = await figma.getLocalEffectStylesAsync();
const esName = new Map(effectStyles.map((s) => [s.id, s.name]));

function checkPaints(node, kind) {
  const paints = kind === "fills" ? node.fills : node.strokes;
  if (!paints || paints === figma.mixed || !paints.length) return;
  for (let i = 0; i < paints.length; i++) {
    const p = paints[i];
    if (p.visible === false) continue;
    report.counts.paints++;
    const bound = p.boundVariables && p.boundVariables.color;
    if (!bound) {
      report.unboundPaints.push(`${kind}[${i}] ${p.type} · ${path(node)}`);
      continue;
    }
    report.counts.boundPaints++;
    const name = varName(bound.id);
    report.usedTokens[name] = (report.usedTokens[name] || 0) + 1;
    // цвет из Primitives допустим только в секции 1 (образцы примитивов)
    if (layerOf(bound.id) === "Primitives" && !path(node).startsWith("Foundations / 1 · Primitives"))
      report.primitivesInPaints.push(`${name} · ${path(node)}`);
  }
}

for (const node of page.findAll(() => true)) {
  report.counts.nodes++;
  if ("fills" in node) checkPaints(node, "fills");
  if ("strokes" in node) checkPaints(node, "strokes");

  if (node.type === "TEXT") {
    report.counts.texts++;
    const id = node.textStyleId;
    if (id === figma.mixed || !id) report.textWithoutStyle.push(path(node));
    else {
      const n = tsName.get(id) || `(не локальный ${id})`;
      report.usedTextStyles[n] = (report.usedTextStyles[n] || 0) + 1;
    }
  }

  for (const f of RADII) {
    if (!(f in node)) continue;
    const bound = node.boundVariables && node.boundVariables[f];
    if (!bound && node[f] > 0) report.unboundRadii.push(`${f}=${node[f]} · ${path(node)}`);
    else if (bound) report.usedTokens[varName(bound.id)] = (report.usedTokens[varName(bound.id)] || 0) + 1;
  }

  if ("effects" in node && node.effects.length) {
    if (!node.effectStyleId) report.localEffects.push(path(node));
    else report.usedEffectStyles[esName.get(node.effectStyleId) || node.effectStyleId] = 1;
  }

  if ("explicitVariableModes" in node && node.explicitVariableModes && Object.keys(node.explicitVariableModes).length) {
    const modes = Object.entries(node.explicitVariableModes).map(([cid, mid]) => {
      const c = collections.find((x) => x.id === cid);
      const m = c && c.modes.find((x) => x.modeId === mid);
      return `${c ? c.name : cid}=${m ? m.name : mid}`;
    });
    report.explicitModeFrames.push(`${path(node)} → ${modes.join(", ")}`);
  }
}

// восемь тем = восемь фреймов верхнего уровня, у каждого свои явные режимы Brand и Theme
const EXPECTED_FRAMES = 8;
const brandId = (collections.find((c) => c.name === "Brand") || {}).id;
const themeId = (collections.find((c) => c.name === "Theme") || {}).id;
report.topFrames = [];
report.framesWithoutModes = [];
for (const node of page.children) {
  if (node.type !== "FRAME") { report.framesWithoutModes.push(`${node.name}: не FRAME, а ${node.type}`); continue; }
  const modes = node.explicitVariableModes || {};
  const nameOf = (cid, mid) => {
    const c = collections.find((x) => x.id === cid);
    const m = c && c.modes.find((x) => x.modeId === mid);
    return m ? m.name : "?";
  };
  const miss = [];
  if (!modes[brandId]) miss.push("Brand");
  if (!modes[themeId]) miss.push("Theme");
  if (miss.length) report.framesWithoutModes.push(`${node.name}: нет режимов ${miss.join(", ")}`);
  report.topFrames.push(`${node.name} · Brand=${modes[brandId] ? nameOf(brandId, modes[brandId]) : "—"} · Theme=${modes[themeId] ? nameOf(themeId, modes[themeId]) : "—"} · ${Math.round(node.width)}×${Math.round(node.height)} @${Math.round(node.x)},${Math.round(node.y)}`);
}
if (report.topFrames.length !== EXPECTED_FRAMES)
  report.framesWithoutModes.push(`фреймов верхнего уровня ${report.topFrames.length}, ожидалось ${EXPECTED_FRAMES}`);

// текст, вылезший за родителя: подпись шире плашки = обрезка или наезд на соседа
const overflow = [];
for (const node of page.findAll((n) => n.type === "TEXT")) {
  const p = node.parent;
  if (!p || !("width" in p) || !p.layoutMode || p.layoutMode === "NONE") continue;
  const avail = p.width - (p.paddingLeft || 0) - (p.paddingRight || 0);
  if (node.width > avail + 0.5) overflow.push(`${Math.round(node.width)} > ${Math.round(avail)} · ${path(node)}`);
}
report.textOverflow = overflow;

report.summary =
  `узлов ${report.counts.nodes} · заливок и обводок ${report.counts.paints} (привязано ${report.counts.boundPaints}) · ` +
  `текстов ${report.counts.texts} · несвязанных цветов ${report.unboundPaints.length} · ` +
  `текста без стиля ${report.textWithoutStyle.length} · несвязанных радиусов ${report.unboundRadii.length} · ` +
  `локальных эффектов ${report.localEffects.length} · примитивов вне секции 1: ${report.primitivesInPaints.length} · текста за границами родителя ${report.textOverflow.length} · фреймов верхнего уровня ${report.topFrames.length} · без режимов ${report.framesWithoutModes.length} · всего рамок с режимами ${report.explicitModeFrames.length}`;
report.usedTokenCount = Object.keys(report.usedTokens).length;
delete report.usedTokens;
return report;
