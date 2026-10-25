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
