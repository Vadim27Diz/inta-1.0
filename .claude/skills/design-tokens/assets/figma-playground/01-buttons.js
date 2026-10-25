// ---------- 1. Buttons ----------
function buildButtons(frame) {
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
}
