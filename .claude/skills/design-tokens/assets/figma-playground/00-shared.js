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
//      Label + Input (value), Input invalid, Input disabled, Textarea focus (с курсором),
//      Slider focus, Progress 40% (трек — border/input, та же причина, что у Input/Textarea;
//      добавлены по просьбе человека, вне общего правила «ровно один раз», см. п.4 ниже).
//   3. Selection — Checkbox, Radio Group, Switch: выкл / вкл / disabled.
//   4. Forms (группа 2, составные контролы) — Field default/invalid, Input Group
//      addon=start/end, Input OTP default, Native Select md/default, Select open (панель —
//      проверка Select/Item в контексте, отличном от его собственной секции Components),
//      Toggle pressed, Toggle Group, Button Group horizontal, Slider default, Progress 40%.
//   5. Display — Badge (все варианты одним рядом), разделитель на всю ширину, под ним
//      Kbd, Spinner, Skeleton одним рядом.
//   6. Icons — 5 глифов одним размером (Size=16).
//
// Вся раскладка — auto layout (через helper'ы newFrame/row/sectionFrame), без единой ручной
// координаты внутри фрейма; сами 4 фрейма верхнего уровня расставлены по сетке 2×2 с отступом
// 160 между рамками бренда (абсолютные x/y — здесь это нормально, это верхний уровень страницы,
// не компонент-сет: см. figma.md → «Раскладка страницы Playground»).
//
// Файл собирается из этой папки (блок на секцию) скриптом
// `node scripts/build-figma-script.mjs playground` — редактируй нужный блок точечно, не весь
// файл; собранный результат идёт в use_figma целиком (страница чистится вся за один прогон).
//
// Пересборка после добавления компонента в группу 1 (или следующую группу — тогда структура
// секций расширяется): допиши вариант в нужный блок и пересобери скрипт — он идемпотентен,
// чистит фреймы перед сборкой.
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
  Toggle: await figma.getNodeByIdAsync("265:411"),
  ToggleGroup: await figma.getNodeByIdAsync("271:387"),
  ButtonGroup: await figma.getNodeByIdAsync("274:431"),
  Slider: await figma.getNodeByIdAsync("277:1110"),
  Progress: await figma.getNodeByIdAsync("279:387"),
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
