#!/usr/bin/env node
// Проверка раскладки страницы Components по снимку figma/layout.json.
//
//   node scripts/figma-layout-check.mjs [figma/layout.json]
//
// Снимок снимается из Figma скриптом .claude/skills/design-tokens/assets/figma-layout-export.js
// через `use_figma`, сохраняется через scripts/figma-layout-save.mjs (не руками — он же проставляет
// exporterHash, см. ниже). Тот же use_figma-вызов печатает djb2-хеш данных — он должен совпасть с
// хешем сохранённого файла (`node scripts/figma-layout-check.mjs --hash`), иначе снимок устарел
// относительно Figma и проверка валидирует прошлое — это сверяется руками (CI не ходит в Figma).
// Правило раскладки — references/figma.md → «Раскладка страницы Components».
import fs from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--")) || "figma/layout.json";
if (!fs.existsSync(file)) {
  console.error(`нет снимка ${file} — сними его figma-layout-export.js через use_figma`);
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const djb2 = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(16); };
// exporterHash не часть «данных» для целей сверки с use_figma (тот хеш печатается ДО сохранения,
// exporterHash добавляется только при сохранении — см. figma-layout-save.mjs) — исключаем явно,
// иначе --hash никогда не совпадёт с тем, что вернул use_figma.
const { exporterHash, ...dataWithoutExporterHash } = data;
if (args.includes("--hash")) { console.log(djb2(JSON.stringify(dataWithoutExporterHash))); process.exit(0); }

// Снимок устаревает не только относительно Figma (это не автоматизировать без живого похода в
// Figma из CI — сверяется руками, см. комментарий выше), но и относительно ЛОГИКИ экспортёра: если
// figma-layout-export.js поправили (например, как ownerName() ловушка 8 в SKILL.md), а снимок не
// пересняли, старые данные это молча не ловят. exporterHash — хеш файла экспортёра на момент
// сохранения (проставляет figma-layout-save.mjs) — здесь сверяется с текущим файлом на диске.
const EXPORTER_PATH = ".claude/skills/design-tokens/assets/figma-layout-export.js";
if (fs.existsSync(EXPORTER_PATH)) {
  const currentExporterHash = djb2(fs.readFileSync(EXPORTER_PATH, "utf8"));
  if (data.exporterHash !== currentExporterHash) {
    console.error(
      data.exporterHash
        ? `снимок устарел: exporterHash снимка ${data.exporterHash} ≠ текущий ${currentExporterHash} — ` +
          `figma-layout-export.js менялся после последнего снимка. Пересними через use_figma и сохрани ` +
          `через scripts/figma-layout-save.mjs.`
        : `в снимке нет exporterHash (сохранён не через scripts/figma-layout-save.mjs) — пересними и сохрани через него.`
    );
    process.exit(2);
  }
}

// 9 колонок слева направо (x — реальный якорь колонки в Figma), в каждой — порядок секций сверху
// вниз. Раскладка-грид принята решением человека 2026-10-22 (см. handoff.md), сменила прежнюю
// «одна колонка».
const COLUMNS = [
  { x: -2236, order: ["Typography", "Utility"] },
  { x: -1222, order: ["Icon", "Icon / Glyphs"] },
  { x: -64, order: ["Button", "Toggle", "Toggle Group", "Button Group"] },
  { x: 1204, order: ["Label", "Input", "Textarea", "Field", "Input Group", "Input OTP", "Native Select", "Select"] },
  { x: 2598, order: ["Checkbox", "Radio Group", "Switch", "Slider", "Progress"] },
  { x: 3656, order: ["Separator", "Kbd", "Spinner", "Skeleton"] },
  { x: 4714, order: ["Badge"] },
  { x: 5772, order: ["Avatar", "Avatar Group"] },
  { x: 6830, order: ["Item", "Empty", "Card", "Alert"] },
];
const PAD = 64, GAP = 160, GAP_TOLERANCE = 2, PITCH = 64;
const box = (a) => ({ name: a[0], type: a[1], x: a[2], y: a[3], w: a[4], h: a[5] });

const errors = [];
const fail = (m) => errors.push(m);
const inside = (a, b) => a.x >= b.x - 0.5 && a.y >= b.y - 0.5 && a.x + a.w <= b.x + b.w + 0.5 && a.y + a.h <= b.y + b.h + 0.5;
const overlap = (a, b) => {
  const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return ox > 0 && oy > 0 ? `${ox}×${oy}` : null;
};

const sections = data.sections.map((s) => ({ ...box(s.s), children: s.c.map(box) }));

// 1. на странице верхнего уровня только секции
for (const n of data.loose) fail(`вне секций на странице: ${n[0]} [${n[1]}]`);

// 2. каждый компонент и набор лежит в секции
for (const c of data.components) if (c[3] !== "SECTION") fail(`${c[0]} [${c[1]}] лежит в ${c[2]} [${c[3]}], а не в секции`);

// 3. содержимое внутри рамки, отступ ровно 64 со всех сторон
for (const s of sections) {
  if (!s.children.length) { fail(`секция ${s.name} пустая`); continue; }
  for (const c of s.children) if (!inside(c, s)) fail(`${s.name}: ${c.name} выходит за рамку секции`);
  const pads = {
    слева: Math.min(...s.children.map((c) => c.x)) - s.x,
    сверху: Math.min(...s.children.map((c) => c.y)) - s.y,
    справа: s.x + s.w - Math.max(...s.children.map((c) => c.x + c.w)),
    снизу: s.y + s.h - Math.max(...s.children.map((c) => c.y + c.h)),
  };
  for (const [side, v] of Object.entries(pads)) if (Math.abs(v - PAD) > 0.5) fail(`${s.name}: отступ ${side} ${v} ≠ ${PAD}`);
}

// 4. секции не пересекаются
for (let i = 0; i < sections.length; i++) for (let j = i + 1; j < sections.length; j++) {
  const o = overlap(sections[i], sections[j]);
  if (o) fail(`секции пересекаются: ${sections[i].name} ↔ ${sections[j].name} (${o})`);
}

// 5. 9 колонок слева направо, в каждой — порядок сверху вниз и зазор 160 (±2)
const actualXs = [...new Set(sections.map((s) => s.x))].sort((a, b) => a - b);
const expectedXs = COLUMNS.map((c) => c.x);
if (actualXs.join(",") !== expectedXs.join(",")) fail(`колонки по x: ${actualXs.join(", ")} ≠ ${expectedXs.join(", ")}`);
for (const col of COLUMNS) {
  const inCol = sections.filter((s) => s.x === col.x).sort((a, b) => a.y - b.y);
  const names = inCol.map((s) => s.name);
  if (names.join(" | ") !== col.order.join(" | ")) fail(`колонка x=${col.x}: ${names.join(" | ")} ≠ ${col.order.join(" | ")}`);
  inCol.slice(1).forEach((s, i) => {
    const gap = s.y - (inCol[i].y + inCol[i].h);
    if (Math.abs(gap - GAP) > GAP_TOLERANCE) fail(`зазор ${inCol[i].name} → ${s.name}: ${gap} ≠ ${GAP} (±${GAP_TOLERANCE})`);
  });
}

// 6. у каждой секции заголовок, описание и хотя бы один компонент
for (const s of sections) {
  for (const need of ["title", "description"]) if (!s.children.some((c) => c.type === "TEXT" && c.name === need)) fail(`${s.name}: нет текста «${need}»`);
  if (!s.children.some((c) => c.type === "COMPONENT_SET" || c.type === "COMPONENT")) fail(`${s.name}: нет ни одного компонента или набора`);
}

// 7. глифы: сетка с шагом 64 и подпись под каждым
const gs = sections.find((s) => s.name === "Icon / Glyphs");
if (!gs) fail("нет секции Icon / Glyphs");
else {
  const glyphs = gs.children.filter((c) => c.name.startsWith("li:"));
  const captions = gs.children.filter((c) => c.name.startsWith("caption "));
  if (glyphs.length !== captions.length) fail(`Icon / Glyphs: глифов ${glyphs.length}, подписей ${captions.length}`);
  for (const g of glyphs) {
    const cap = captions.find((c) => c.name === `caption ${g.name.replace(/^li:/, "")}`);
    if (!cap) { fail(`Icon / Glyphs: нет подписи под ${g.name}`); continue; }
    if (cap.y < g.y + g.h - 0.5) fail(`Icon / Glyphs: подпись ${cap.name} не под иконкой`);
    if (Math.abs(cap.x + cap.w / 2 - (g.x + g.w / 2)) > 0.5) fail(`Icon / Glyphs: подпись ${cap.name} не по центру ячейки`);
  }
  const step = (arr, label) => [...new Set(arr)].sort((a, b) => a - b).slice(1).forEach((v, i, a2) => {
    const prev = [...new Set(arr)].sort((x, y) => x - y)[i];
    if (Math.abs(v - prev - PITCH) > 0.5) fail(`Icon / Glyphs: шаг сетки по ${label} ${v - prev} ≠ ${PITCH}`);
  });
  step(glyphs.map((g) => g.x), "X");
  step(glyphs.map((g) => g.y), "Y");
}

// 8. в наборах компонентов нет абсолютно позиционированных слоёв, кроме focus-ring (кроме явных
// исключений с причиной)
for (const [root, variant, layer, type, exempt] of data.absoluteLayers || []) {
  if (exempt) continue;
  fail(`${root} / ${variant}: слой «${layer}» [${type}] абсолютный — курсор и всё, что зависит от длины текста, должно быть в потоке auto layout`);
}

// 9. focus-ring нигде не обрезан предком — на ВСЕХ страницах (Components, Playground, Foundations),
// не только на Components. clipsContent=true у предка допустим, только если кольцо целиком внутри
// его рамки — снимок это уже учитывает (ringClipping содержит только реальные нарушения).
for (const [pg, ancestor, type, rx, ry, rw, rh, ax, ay, aw, ah] of data.ringClipping || []) {
  fail(`${pg}: кольцо фокуса ${rw}×${rh} обрезано предком «${ancestor}» [${type}] ${aw}×${ah} — clipsContent=true, а кольцо не помещается внутри`);
}

// 10. контейнер текстового слоя — только Hug/Fill по ширине, не Fixed (кроме явных исключений
// с причиной — поля ввода фиксированной ширины по дизайну)
for (const [component, textNode, container, rootFixed, parentFixed, exempt] of data.textContainers || []) {
  if (exempt) continue;
  fail(`${component}: контейнер «${container}» текстового слоя «${textNode}» — фиксированная ширина, должен быть Hug/Fill`);
}

// 11. текст, который меняется при использовании (подпись/значение/клавиша), подключён как
// TEXT property — не «голый» текстовый слой (кроме явных исключений с причиной)
for (const [component, textNode, chars, exempt] of data.nakedText || []) {
  if (exempt) continue;
  fail(`${component}: текстовый слой «${textNode}» («${chars}») без component property — нечем управлять при использовании`);
}

// 12. дочерние элементы списка (пункты Select, позже menu item/command item) — Fill по ширине,
// не Hug: подсветка состояния должна тянуться на всю ширину панели, а не только по тексту
for (const [root, variant, list, item, sizing] of data.listItemSizing || []) {
  fail(`${root} / ${variant}: пункт списка «${item}» в «${list}» — ${sizing}, должен быть Fill`);
}

// 13. повторяющиеся элементы внутри компонента (пункты списков, вкладки, ячейки) — экземпляры
// общего компонента, а не нарисованные слои (как Select/Item, Input OTP/Slot)
for (const [root, variant, container, layer, count] of data.repeatedLayers || []) {
  fail(`${root} / ${variant}: «${layer}» повторяется ${count}× в «${container}» как нарисованный слой, а не экземпляр компонента`);
}

// 14. каждый focus-ring — экземпляр Utility / Focus ring, с посадкой (Kind) по типу родителя:
// control — зазор 2px, скругление на шаг выше; field — вплотную, скругление РАВНО родителю,
// обводка 3px (образец ui.shadcn.com); seam — вплотную, скругление на шаг выше, Position по стороне.
for (const row of data.focusRingShape || []) {
  if (row[row.length - 1]) continue; // exempt reason — известная проблема, не чинится этим правилом
  const [rowKind, parent, ring] = row;
  if (rowKind === "not-instance") {
    fail(`${parent}: «${ring}» [${row[3]}] — не экземпляр Utility / Focus ring (${row[4] || "нарисованный слой"})`);
  } else if (rowKind === "no-kind") {
    fail(`${parent}: «${ring}» — вариант «${row[3]}» без свойства Kind (control/field/seam)`);
  } else if (rowKind === "corner-step" || rowKind === "corner-flat" || rowKind === "corner-full") {
    fail(`${parent}: «${ring}» угол ${row[3]} — ожидался ${row[4]}, сейчас ${row[5]}`);
  } else if (rowKind === "corner-equal") {
    fail(`${parent}: «${ring}» (Kind=field) угол ${row[3]} — должен повторять родителя (${row[4]}), сейчас ${row[5]}`);
  } else if (rowKind === "corner-unclassified") {
    fail(`${parent}: «${ring}» угол ${row[3]} родителя не sm/md/lg/full (${row[4]}) — не из чего посчитать скругление кольца`);
  } else if (rowKind === "geometry") {
    fail(`${parent}: «${ring}» (Kind=${row[3].kind}) геометрия ${JSON.stringify(row[3])} ≠ ожидаемой ${JSON.stringify(row[4])}`);
  } else if (rowKind === "stroke-weight") {
    fail(`${parent}: «${ring}» (Kind=${row[3]}) обводка ${row[5]}px — ожидалось ${row[4]}px`);
  }
}

// 15. слот-иконка (прямой инстанс Icon base с isExposedInstance=true, ИЛИ componentPropertyReferences
// на INSTANCE_SWAP-свойство — см. комментарий в figma-layout-export.js) реально переключаем из
// панели Properties, кроме явных исключений с причиной.
for (const [root, variant, layer, isExposedInstance, mainComponent, hasPropertyRef, exempt] of data.iconSlots || []) {
  if (exempt) continue;
  const compliant = (mainComponent === "Icon base" && isExposedInstance) || hasPropertyRef;
  if (!compliant) fail(`${root} / ${variant}: слот «${layer}» (${mainComponent || "?"}) не переключается из панели Properties — не isExposedInstance+Icon base и не componentPropertyReferences`);
}

console.log(`Раскладка ${data.page} · снимок ${data.exportedAt} · секций ${sections.length} · компонентов ${data.components.length} · хеш ${djb2(JSON.stringify(dataWithoutExporterHash))}`);
console.log("правила: только секции · компоненты в секциях · отступ 64 · без пересечений · 9 колонок, шаг 160±2 · заголовок и описание · сетка глифов 64 · без абсолютных слоёв кроме focus-ring · кольцо фокуса не обрезано (Components/Playground/Foundations) · текстовый контейнер Hug/Fill · текст — через property · пункты списков — Fill · повторы — экземпляры, не слои · focus-ring — экземпляр Utility / Focus ring по Kind (control: зазор 2px, скругление на шаг выше · field: вплотную, скругление = родителю, 3px · seam: вплотную, скругление на шаг выше) · слот-иконка — isExposedInstance+Icon base или componentPropertyReferences\n");
if (data.iconSlots?.some((r) => r[6])) {
  console.log("исключения (слот-иконка): " + data.iconSlots.filter((r) => r[6]).map((r) => `${r[0]}|${r[2]} — ${r[6]}`).filter((v, i, a) => a.indexOf(v) === i).join(" · "));
}
if (data.textContainers?.some((r) => r[5])) {
  console.log("исключения (ширина): " + data.textContainers.filter((r) => r[5]).map((r) => `${r[0]} — ${r[5]}`).join(" · "));
}
if (data.nakedText?.some((r) => r[3])) {
  console.log("исключения (голый текст): " + data.nakedText.filter((r) => r[3]).map((r) => `${r[0]} — ${r[3]}`).join(" · "));
}
if (data.absoluteLayers?.some((r) => r[4])) {
  console.log("исключения (абсолютный слой): " + data.absoluteLayers.filter((r) => r[4]).map((r) => `${r[0]}|${r[2]} — ${r[4]}`).filter((v, i, a) => a.indexOf(v) === i).join(" · "));
}
if (data.focusRingShape?.some((r) => r[r.length - 1])) {
  console.log("исключения (форма focus-ring): " + data.focusRingShape.filter((r) => r[r.length - 1]).map((r) => `${r[1]}|${r[2]} — ${r[r.length - 1]}`).filter((v, i, a) => a.indexOf(v) === i).join(" · "));
}
for (const e of errors) console.log(`✗ ${e}`);
console.log(errors.length ? `${errors.length} нарушений` : "✓ раскладка в порядке");
process.exit(errors.length ? 1 : 0);
