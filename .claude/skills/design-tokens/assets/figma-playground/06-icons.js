// ---------- 6. Icons ----------
function buildIcons(frame) {
  const icons = sectionFrame(frame, "Icons");
  const iconsRow = row(icons);
  for (const key of Object.keys(GLYPHS)) {
    const iconInst = inst(pick(REF.IconSet, { Size: "16" }));
    const nested = iconInst.findOne((n) => n.type === "INSTANCE");
    nested.setProperties({ "glyph#115:0": GLYPHS[key] });
    iconsRow.appendChild(iconInst);
  }
}
