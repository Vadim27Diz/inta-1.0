// ---------- 4. Forms (группа 2, составные контролы) ----------
function buildForms(frame) {
  const forms = sectionFrame(frame, "Forms");
  const formsRow = row(forms, { wrap: true });
  formsRow.appendChild(inst(pick(REF.Field, { State: "default" })));
  formsRow.appendChild(inst(pick(REF.Field, { State: "invalid" })));
  formsRow.appendChild(inst(pick(REF.InputGroup, { Addon: "start" })));
  formsRow.appendChild(inst(pick(REF.InputGroup, { Addon: "end" })));
  formsRow.appendChild(inst(pick(REF.InputOTP, { State: "default" })));
  formsRow.appendChild(inst(pick(REF.NativeSelect, { Size: "md", State: "default" })));
  formsRow.appendChild(inst(pick(REF.Select, { State: "open" })));
  // Toggle…Progress — вторая половина группы 2, добавлены этим прогоном (были в Components,
  // не были в Playground — см. handoff «Ревью группы 2», находка 2)
  formsRow.appendChild(inst(pick(REF.Toggle, { Variant: "default", Size: "md", State: "default", Pressed: "on" })));
  formsRow.appendChild(inst(pick(REF.ToggleGroup, { Variant: "default", Size: "md" })));
  formsRow.appendChild(inst(pick(REF.ButtonGroup, { Orientation: "horizontal" })));
  formsRow.appendChild(inst(pick(REF.Slider, { State: "default" })));
  formsRow.appendChild(inst(pick(REF.Progress, { Value: "40%" })));
}
