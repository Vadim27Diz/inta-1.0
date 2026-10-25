// ---------- 5. Display ----------
function buildDisplay(frame) {
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
}
