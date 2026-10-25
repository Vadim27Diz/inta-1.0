function buildFrame(frame) {
  for (const c of [...frame.children]) c.remove();

  const topCap = caption(frame.name.toLowerCase() + " · на surface");
  frame.appendChild(topCap);
  topCap.layoutSizingHorizontal = "FILL";

  buildButtons(frame);
  buildSurfaceRaised(frame);
  buildSelection(frame);
  buildForms(frame);
  buildDisplay(frame);
  buildIcons(frame);

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
