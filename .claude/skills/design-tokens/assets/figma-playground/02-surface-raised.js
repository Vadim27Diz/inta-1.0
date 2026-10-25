// ---------- 2. card on surface-raised ----------
function buildSurfaceRaised(frame) {
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
  // Slider/Progress — трек на color/border/input, та же причина, что у Input/Textarea выше:
  // проверить его на surface-raised, не только на surface (добавлены по явной просьбе человека
  // при ревью — вне правила «каждый компонент ровно один раз», см. комментарий в 00-shared.js).
  row(card).appendChild(inst(pick(REF.Slider, { State: "focus" })));
  row(card).appendChild(inst(pick(REF.Progress, { Value: "40%" })));
}
