// ---------- 05 Typography ----------
{
  const f = await topFrame("05", "Typography",
    "18 текстовых стилей 1:1 с классами typo-*. Образец набран стилем (ручных размеров нет), поэтому семейство меняется вместе с брендом: слева Main, справа Demo.");
  const sample = (name) =>
    name.startsWith("heading") ? "Заголовок Aa Яя" :
    name.startsWith("numeric") || name === "code" ? "0123456789 · −12,5 %" :
    name.startsWith("label") ? "Подпись контрола Aa" :
    "Съешь ещё этих мягких французских булок Aa Яя";
  const row = rowOf(32, "brands");
  for (const brand of ["Main", "Demo"]) {
    const c = await modeCell(brand, "Light");
    for (const st of textStyles) {
      const g = cell(2);
      g.appendChild(await T(st.name, sample(st.name), "color/on-surface"));
      const famVar = st.boundVariables && st.boundVariables.fontFamily ? byId.get(st.boundVariables.fontFamily.id) : null;
      const wVar = st.boundVariables && st.boundVariables.fontWeight ? byId.get(st.boundVariables.fontWeight.id) : null;
      const lh = typeof st.lineHeight === "object" && st.lineHeight.unit === "PIXELS" ? st.lineHeight.value : "auto";
      const weight = wVar ? resolve(wVar.name, brand, "Light") : st.fontName.style;
      g.appendChild(await T("numeric/2xs",
        `typo-${st.name.replace(/\//g, "-")} · ${famVar ? famVar.name + " → " + resolve(famVar.name, brand, "Light") : st.fontName.family} · ${st.fontSize}/${lh} · ${weight}`,
        "color/on-surface-muted"));
      c.appendChild(g);
    }
    row.appendChild(c);
  }
  f.appendChild(row);
}
