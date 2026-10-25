// ---------- 3. Selection ----------
function buildSelection(frame) {
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
}
