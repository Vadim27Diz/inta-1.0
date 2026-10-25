// ---------- 01 Palette ----------
{
  const f = await topFrame("01", "Palette", "Слой Primitives: сырые значения, scopes пустые, в пикерах они не видны, и компоненты их не используют. Подпись — имя переменной и её hex.");
  const SCALES = ["blue", "violet", "teal", "orange", "zinc", "red", "green", "amber", "sky"];
  for (const scale of SCALES) {
    const g = cell(8, `color/${scale}`);
    g.appendChild(await T("label/md", `color/${scale}`, "color/on-surface"));
    const r = rowOf(8);
    const steps = allVars
      .filter((v) => v.name.startsWith(`color/${scale}/`))
      .map((v) => v.name.split("/")[2])
      .sort((a, b) => Number(a) - Number(b));
    for (const step of steps) {
      const name = `color/${scale}/${step}`;
      const c = cell(4);
      c.appendChild(block(84, 52, name));
      c.appendChild(await T("label/sm", step, "color/on-surface"));
      c.appendChild(await T("numeric/2xs", hex(resolve(name, "Main", "Light")), "color/on-surface-muted"));
      r.appendChild(c);
    }
    g.appendChild(r);
    f.appendChild(g);
  }
  const g = cell(8, "одиночные и альфа");
  g.appendChild(await T("label/md", "одиночные и альфа", "color/on-surface"));
  const r = rowOf(8);
  for (const spec of [
    { name: "color/white", fills: ["color/white"] },
    { name: "color/black", fills: ["color/black"] },
    { name: "color/black-alpha/50", fills: ["color/white", "color/black-alpha/50"] },
    { name: "color/black-alpha/80", fills: ["color/white", "color/black-alpha/80"] },
  ]) {
    const c = cell(4);
    c.appendChild(block(140, 52, spec.fills));
    c.appendChild(await T("label/sm", spec.name.replace("color/", ""), "color/on-surface"));
    c.appendChild(await T("numeric/2xs", hex(resolve(spec.name, "Main", "Light")), "color/on-surface-muted"));
    r.appendChild(c);
  }
  g.appendChild(r);
  f.appendChild(g);
}
