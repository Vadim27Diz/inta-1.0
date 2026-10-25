// ---------- 07 Shadows ----------
{
  const f = await topFrame("07", "Shadows", "Эффект-стили shadow/xs…xl со значениями Tailwind. Цвет тени задан в эффекте (чёрный с альфой Tailwind), а не переменной: привязка переменной к цвету эффекта тянет её альфу 1.0 и делает тень непрозрачной.");
  const r = AL("HORIZONTAL", { name: "shadows", itemSpacing: 32, paddingTop: 24, paddingBottom: 32, paddingLeft: 8, paddingRight: 8, counterAxisAlignItems: "MIN" });
  for (const name of ["shadow/xs", "shadow/sm", "shadow/md", "shadow/lg", "shadow/xl"]) {
    const st = ES.get(name);
    if (!st) throw new Error(`нет эффект-стиля ${name}`);
    const c = cell(10);
    const card = block(140, 88, "color/surface-raised", { radius: "radius/lg" });
    card.clipsContent = true; // иначе Figma не рисует тень фрейма вовсе
    await card.setEffectStyleIdAsync(st.id);
    c.appendChild(card);
    c.appendChild(await T("numeric/2xs", name, "color/on-surface-muted"));
    r.appendChild(c);
  }
  f.appendChild(r);
}
