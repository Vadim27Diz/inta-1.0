// ---------- 06 Radius ----------
{
  const f = await topFrame("06", "Radius", "radius/none и radius/full живут в Primitives, radius/sm…xl — в Brand: они меняются вместе с брендом. Подпись — значение в этом бренде.");
  const row = rowOf(32, "brands");
  for (const brand of ["Main", "Demo"]) {
    const c = await modeCell(brand, "Light");
    const r = rowOf(12, "radii");
    for (const size of ["none", "sm", "md", "lg", "xl", "full"]) {
      const cc = cell(4);
      cc.appendChild(block(72, 72, "color/primary/default", { radius: `radius/${size}`, border: false }));
      cc.appendChild(await T("numeric/2xs", `${size} · ${resolve(`radius/${size}`, brand, "Light")}`, "color/on-surface-muted"));
      r.appendChild(cc);
    }
    c.appendChild(r);
    row.appendChild(c);
  }
  f.appendChild(row);
}
