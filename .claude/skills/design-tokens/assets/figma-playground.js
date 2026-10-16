// Генератор страницы Playground. Запускать через Figma MCP `use_figma` (скилл figma-use),
// целиком, одним прогоном: скрипт чистит все 4 фрейма страницы, потом собирает их заново.
//
// Назначение страницы: быстрая проверка бренд × тема — не каталог. Каталог — страница
// Components и Storybook. Поэтому здесь каждый компонент встречается в каждом контексте
// (surface / surface-raised / выборка / витрина / иконки) РОВНО ОДИН раз — никаких повторов
// одного и того же набора вариантов в нескольких местах.
//
// Структура одинакова во всех 4 фреймах (Main/Light, Main/Dark, Demo/Light, Demo/Dark):
//   1. Buttons — 10 вариантов в default одним рядом на surface; состояния
//      default/hover/pressed/focus/disabled и размеры sm/md/lg/icon — только у primary.
//   2. Одна карточка surface-raised (обводка color/border/default, подпись «на surface-raised»):
//      outline/ghost/link в focus (проверка «заплатки» на приподнятой поверхности),
//      Label + Input (value), Input invalid, Input disabled, Textarea focus (с курсором).
//   3. Selection — Checkbox, Radio Group, Switch: выкл / вкл / disabled.
//   4. Forms (группа 2, составные контролы) — Field default/invalid, Input Group
//      addon=start/end, Input OTP default, Native Select md/default, Select open (панель —
//      проверка Select/Item в контексте, отличном от его собственной секции Components).
//   5. Display — Badge (все варианты одним рядом), разделитель на всю ширину, под ним
//      Kbd, Spinner, Skeleton одним рядом.
//   6. Icons — 5 глифов одним размером (Size=16).
//
// Вся раскладка — auto layout (через helper'ы newFrame/row/sectionFrame), без единой ручной
// координаты внутри фрейма; сами 4 фрейма верхнего уровня расставлены по сетке 2×2 с отступом
// 160 между рамками бренда (абсолютные x/y — здесь это нормально, это верхний уровень страницы,
// не компонент-сет: см. figma.md → «Раскладка страницы Playground»).
//
// Пересборка после добавления компонента в группу 1 (или следующую группу — тогда структура
// секций расширяется): допиши вариант в нужный блок ниже и прогони скрипт заново целиком —
// он идемпотентен, чистит фреймы перед сборкой.
//
// Проверка после прогона: npm run figma:layout покрывает ОДНО правило на этой странице —
// ни один focus-ring нигде не обрезан предком (см. figma.md → «Страница Playground» и
// «Раскладка страницы Components» п.7). Остальное — глазами, скриншотом каждого из 4 фреймов.

const page = figma.root.children.find((p) => p.name === "Playground");
await figma.setCurrentPageAsync(page);

// id живут в файле; если компонент пересоздан — обнови здесь (см. Components page → секция
// компонента → id набора/компонента).
const REF = {
  Button: await figma.getNodeByIdAsync("87:298"),
  Input: await figma.getNodeByIdAsync("121:237"),
  Textarea: await figma.getNodeByIdAsync("121:263"),
  Label: await figma.getNodeByIdAsync("120:171"),
  Checkbox: await figma.getNodeByIdAsync("146:220"),
  RadioGroup: await figma.getNodeByIdAsync("148:203"),
  Switch: await figma.getNodeByIdAsync("148:218"),
  Badge: await figma.getNodeByIdAsync("173:222"),
  Separator: await figma.getNodeByIdAsync("173:227"),
  Kbd: await figma.getNodeByIdAsync("173:228"),
  Spinner: await figma.getNodeByIdAsync("173:230"),
  Skeleton: await figma.getNodeByIdAsync("173:233"),
  IconSet: await figma.getNodeByIdAsync("115:32"),
  Field: await figma.getNodeByIdAsync("207:213"),
  InputGroup: await figma.getNodeByIdAsync("214:208"),
  InputOTP: await figma.getNodeByIdAsync("217:238"),
  NativeSelect: await figma.getNodeByIdAsync("220:289"),
  Select: await figma.getNodeByIdAsync("223:268"),
};
// 5 глифов для секции Icons — id компонентов li:* из Icon / Glyphs
const GLYPHS = {
  "li:check": "114:35", "li:search": "114:195", "li:user": "114:243",
  "li:settings": "113:34", "li:mail": "114:171",
};

const captionStyle = (await figma.getLocalTextStylesAsync()).find((s) => s.name === "caption");
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const theme = collections.find((c) => c.name === "Theme");
const themeVars = await Promise.all(theme.variableIds.map((id) => figma.variables.getVariableByIdAsync(id)));
const byName = Object.fromEntries(themeVars.map((v) => [v.name, v]));
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "IBM Plex Sans", style: "Regular" });

// Новый фрейм в Figma по умолчанию clipsContent=true — ловушка №6 (SKILL.md → «Топ-5 ловушек»):
// ряд ровно по высоте контента обрезает кольцо фокуса, которое на 2px больше с каждой стороны.
// Единая точка создания фрейма — чтобы её нельзя было забыть.
function newFrame() {
  const f = figma.createFrame();
  f.clipsContent = false;
  return f;
}
// находит вариант набора по набору свойств, независимо от порядка в имени
function pick(set, props) {
  const entries = Object.entries(props);
  const v = set.children.find((c) =>
    entries.every(([k, val]) => new RegExp(`(^|, )${k}=${val}(,|$)`).test(c.name))
  );
  if (!v) throw new Error(`вариант не найден: ${JSON.stringify(props)} в ${set.name}`);
  return v;
}
function inst(component, overrides) {
  const i = component.createInstance();
  if (overrides) i.setProperties(overrides);
  return i;
}
function row(parent, { wrap = false, spacing = 12, align = "CENTER" } = {}) {
  const f = newFrame();
  f.layoutMode = "HORIZONTAL";
  if (wrap) { f.layoutWrap = "WRAP"; f.counterAxisSpacing = spacing; }
  f.itemSpacing = spacing;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.counterAxisAlignItems = align;
  f.fills = [];
  parent.appendChild(f);
  if (wrap) { f.primaryAxisSizingMode = "FIXED"; f.layoutSizingHorizontal = "FILL"; }
  return f;
}
function caption(text) {
  const cap = figma.createText();
  cap.fontName = { family: "Inter", style: "Regular" };
  cap.textStyleId = captionStyle.id;
  cap.characters = text;
  cap.fills = [figma.variables.setBoundVariableForPaint(cap.fills[0], "color", byName["color/on-surface-muted"])];
  return cap;
}
function sectionFrame(parent, title) {
  const s = newFrame();
  s.name = title;
  s.layoutMode = "VERTICAL";
  s.itemSpacing = 12;
  s.primaryAxisSizingMode = "AUTO";
  s.counterAxisSizingMode = "AUTO";
  s.fills = [];
  parent.appendChild(s);
  s.layoutSizingHorizontal = "FILL";
  const cap = caption(title);
  s.appendChild(cap);
  cap.layoutSizingHorizontal = "FILL";
  return s;
}

function buildFrame(frame) {
  for (const c of [...frame.children]) c.remove();

  const topCap = caption(frame.name.toLowerCase() + " · на surface");
  frame.appendChild(topCap);
  topCap.layoutSizingHorizontal = "FILL";

  // ---------- 1. Buttons ----------
  const buttons = sectionFrame(frame, "Buttons");
  const variantsRow = row(buttons, { wrap: true });
  for (const v of ["primary", "secondary", "neutral", "outline", "ghost", "danger", "danger-subtle", "inverse", "link", "link-danger"]) {
    variantsRow.appendChild(inst(pick(REF.Button, { Variant: v, Size: "md", State: "default" })));
  }
  const statesRow = row(buttons, { wrap: true });
  for (const st of ["default", "hover", "pressed", "focus", "disabled"]) {
    statesRow.appendChild(inst(pick(REF.Button, { Variant: "primary", Size: "md", State: st })));
  }
  const sizesRow = row(buttons, { wrap: true });
  for (const sz of ["sm", "md", "lg"]) {
    sizesRow.appendChild(inst(pick(REF.Button, { Variant: "primary", Size: sz, State: "default" })));
  }
  sizesRow.appendChild(inst(pick(REF.Button, { Variant: "primary", Size: "icon", State: "default" }), { "Icon left#87:181": true }));

  // ---------- 2. card on surface-raised ----------
  const card = newFrame();
  card.name = "surface-raised";
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 12;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "AUTO";
  card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 16;
  card.cornerRadius = 8;
  frame.appendChild(card);
  card.layoutSizingHorizontal = "FILL";
  card.fills = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", byName["color/surface-raised"])];
  card.strokes = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", byName["color/border/default"])];
  card.strokeWeight = 1;

  const cardCap = caption("на surface-raised");
  card.appendChild(cardCap);
  cardCap.layoutSizingHorizontal = "FILL";

  const focusRow = row(card, { wrap: true });
  for (const v of ["outline", "ghost", "link"]) {
    focusRow.appendChild(inst(pick(REF.Button, { Variant: v, Size: "md", State: "focus" })));
  }
  const labelInputRow = row(card);
  labelInputRow.appendChild(inst(pick(REF.Label, { State: "default" })));
  labelInputRow.appendChild(inst(pick(REF.Input, { Size: "md", State: "default", Content: "value" })));
  row(card).appendChild(inst(pick(REF.Input, { Size: "md", State: "invalid", Content: "value" })));
  row(card).appendChild(inst(pick(REF.Input, { Size: "md", State: "disabled", Content: "value" })));
  row(card).appendChild(inst(pick(REF.Textarea, { State: "focus", Content: "value" })));

  // ---------- 3. Selection ----------
  const selection = sectionFrame(frame, "Selection");
  const cbRow = row(selection);
  cbRow.appendChild(inst(pick(REF.Checkbox, { State: "default", Checked: "unchecked" })));
  cbRow.appendChild(inst(pick(REF.Checkbox, { State: "default", Checked: "checked" })));
  cbRow.appendChild(inst(pick(REF.Checkbox, { State: "disabled", Checked: "unchecked" })));
  const rgRow = row(selection);
  rgRow.appendChild(inst(pick(REF.RadioGroup, { State: "default", Checked: "unchecked" })));
  rgRow.appendChild(inst(pick(REF.RadioGroup, { State: "default", Checked: "checked" })));
  rgRow.appendChild(inst(pick(REF.RadioGroup, { State: "disabled", Checked: "unchecked" })));
  const swRow = row(selection);
  swRow.appendChild(inst(pick(REF.Switch, { State: "default", Checked: "off" })));
  swRow.appendChild(inst(pick(REF.Switch, { State: "default", Checked: "on" })));
  swRow.appendChild(inst(pick(REF.Switch, { State: "disabled", Checked: "off" })));

  // ---------- 4. Forms (группа 2, составные контролы) ----------
  const forms = sectionFrame(frame, "Forms");
  const formsRow = row(forms, { wrap: true });
  formsRow.appendChild(inst(pick(REF.Field, { State: "default" })));
  formsRow.appendChild(inst(pick(REF.Field, { State: "invalid" })));
  formsRow.appendChild(inst(pick(REF.InputGroup, { Addon: "start" })));
  formsRow.appendChild(inst(pick(REF.InputGroup, { Addon: "end" })));
  formsRow.appendChild(inst(pick(REF.InputOTP, { State: "default" })));
  formsRow.appendChild(inst(pick(REF.NativeSelect, { Size: "md", State: "default" })));
  formsRow.appendChild(inst(pick(REF.Select, { State: "open" })));

  // ---------- 5. Display ----------
  const display = sectionFrame(frame, "Display");
  const badgeRow = row(display, { wrap: true });
  for (const v of ["primary", "secondary", "neutral", "outline", "danger", "danger-subtle", "success", "warning", "info"]) {
    badgeRow.appendChild(inst(pick(REF.Badge, { Variant: v })));
  }
  // разделитель на всю ширину ряда, остальные три — строкой под ним (не рядом: вертикальный
  // Separator высотой 64 рядом с иконкой 16px давал пустой на вид прямоугольник)
  const sepInst = inst(pick(REF.Separator, { Orientation: "horizontal" }));
  display.appendChild(sepInst);
  sepInst.layoutSizingHorizontal = "FILL";
  const miscRow = row(display);
  miscRow.appendChild(inst(REF.Kbd));
  miscRow.appendChild(inst(REF.Spinner));
  miscRow.appendChild(inst(REF.Skeleton));

  // ---------- 6. Icons ----------
  const icons = sectionFrame(frame, "Icons");
  const iconsRow = row(icons);
  for (const key of Object.keys(GLYPHS)) {
    const iconInst = inst(pick(REF.IconSet, { Size: "16" }));
    const nested = iconInst.findOne((n) => n.type === "INSTANCE");
    nested.setProperties({ "glyph#115:0": GLYPHS[key] });
    iconsRow.appendChild(iconInst);
  }

  return { name: frame.name, sections: frame.children.map((c) => c.name), height: frame.height };
}

const results = page.children.map((f) => buildFrame(f));

// 4 фрейма верхнего уровня — сетка 2×2, отступ 160, без пересечений
const order = ["Main / Light", "Main / Dark", "Demo / Light", "Demo / Dark"];
const frames = order.map((n) => page.children.find((f) => f.name === n));
const GAP = 160;
const maxW = Math.max(...frames.map((f) => f.width));
const maxH = Math.max(...frames.map((f) => f.height));
frames[0].x = 0; frames[0].y = 0;
frames[1].x = maxW + GAP; frames[1].y = 0;
frames[2].x = 0; frames[2].y = maxH + GAP;
frames[3].x = maxW + GAP; frames[3].y = maxH + GAP;

return results;
