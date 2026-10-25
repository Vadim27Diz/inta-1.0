// ---------- 03 Color roles ----------
{
  const f = await topFrame("03", "Color roles",
    "Слой Theme, пары X / on-X. Сетка 2 × 2: колонки Main / Demo, строки Light / Dark, режимы заданы на каждой ячейке. Под каждым образцом — WCAG и APCA из npm run tokens:contrast для этой комбинации. ⚠ APCA = |Lc| < 60 (предупреждение, не ошибка); exempt — WCAG 1.4.3 не требует контраста от выключенных контролов.");
  f.appendChild(await grid2x2(async (c, brand, theme, combo) => {
    for (const fam of FAMILIES) {
      const g = cell(6);
      g.appendChild(await T("numeric/xs", `${fam[0]}  +  ${fam[1].replace("color/", "")}`, "color/on-surface-muted"));
      const r = rowOf(8);
      for (const st of fam[2]) {
        const cc = cell(4);
        cc.appendChild(await plate(st[1], fam[1], `Aa ${fam[1].replace("color/", "")}`));
        cc.appendChild(await T("numeric/2xs", `${st[0]} · ${st[1].replace("color/", "")}`, "color/on-surface-muted"));
        cc.appendChild(await T("numeric/2xs", contrastCaption(fam[1], st[1], st[0], combo), "color/on-surface-muted"));
        r.appendChild(cc);
      }
      g.appendChild(r);
      c.appendChild(g);
    }
    for (const link of LINKS) {
      const g = cell(6);
      g.appendChild(await T("numeric/xs", `${link[0]}  на  color/surface`, "color/on-surface-muted"));
      const r = rowOf(8);
      for (const st of link[1]) {
        const cc = cell(4);
        cc.appendChild(await plate("color/surface", st[1], `Aa ${st[1].replace("color/", "")}`));
        cc.appendChild(await T("numeric/2xs", `${st[0]} · ${st[1].replace("color/", "")}`, "color/on-surface-muted"));
        cc.appendChild(await T("numeric/2xs", contrastCaption(st[1], "color/surface", st[0], combo), "color/on-surface-muted"));
        r.appendChild(cc);
      }
      g.appendChild(r);
      c.appendChild(g);
    }
  }));
}
