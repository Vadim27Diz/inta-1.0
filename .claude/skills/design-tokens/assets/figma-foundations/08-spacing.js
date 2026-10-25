// ---------- 08 Spacing ----------
{
  const f = await topFrame("08", "Spacing", "spacing/* = шкала Tailwind (spacing/4 = 16 = p-4). Ширина полоски привязана к переменной, подпись — её значение.");
  const spacings = allVars
    .filter((v) => v.name.startsWith("spacing/"))
    .map((v) => ({ name: v.name, value: resolve(v.name, "Main", "Light") }))
    .sort((a, b) => a.value - b.value);
  const grid = rowOf(40, "spacing-scale");
  const perCol = Math.ceil(spacings.length / 2);
  for (let i = 0; i < 2; i++) {
    const colBox = cell(6);
    for (const sp of spacings.slice(i * perCol, (i + 1) * perCol)) {
      const r = AL("HORIZONTAL", { name: sp.name, itemSpacing: 12, counterAxisAlignItems: "CENTER" });
      r.appendChild(await para("numeric/xs", sp.name, "color/on-surface", 112));
      const bar = newFrame();
      bar.name = sp.name;
      bar.resize(Math.max(sp.value, 0.01), 14);
      bar.fills = [paint("color/primary/default")];
      bindRadius(bar, "radius/sm");
      r.appendChild(bar);
      try {
        bar.setBoundVariable("width", need(sp.name));
      } catch (e) {
        log.warnings.push(`ширина не привязалась к ${sp.name}: ${e.message}`);
      }
      r.appendChild(await T("numeric/xs", String(sp.value), "color/on-surface-muted"));
      colBox.appendChild(r);
    }
    grid.appendChild(colBox);
  }
  f.appendChild(grid);
}
