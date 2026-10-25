// ---------- 04 Surfaces & single roles ----------
{
  const f = await topFrame("04", "Surfaces & single roles",
    "Поверхности с их on-токеном и контрастом, а ниже — роли, у которых пары on-* нет: обводки, кольцо фокуса, затемнение и шкала dataviz. Та же сетка 2 × 2, режимы на каждой ячейке.");
  f.appendChild(await grid2x2(async (c, brand, theme, combo) => {
    const surf = cell(10, "surfaces");
    surf.appendChild(await T("label/md", "Поверхности", "color/on-surface"));
    for (const sp of SURFACES) {
      const cc = cell(4);
      cc.appendChild(await plate(sp[0], sp[1], `Aa ${sp[1].replace("color/", "")}`));
      cc.appendChild(await T("numeric/2xs", `${sp[0].replace("color/", "")} · ${contrastCaption(sp[1], sp[0], "default", combo)}`, "color/on-surface-muted"));
      surf.appendChild(cc);
    }
    c.appendChild(surf);

    const single = cell(10, "singles");
    single.appendChild(await T("label/md", "Одиночные роли (пары on-* нет)", "color/on-surface"));
    const sr = rowOf(8);
    for (const sg of SINGLES) {
      const cc = cell(4);
      cc.appendChild(sg.kind === "stroke"
        ? block(104, 40, [], { border: sg.name, borderWeight: 2 })
        : block(104, 40, sg.name, { border: sg.border ? "color/border/default" : false }));
      cc.appendChild(await para("numeric/2xs", sg.name.replace("color/", ""), "color/on-surface-muted", 104));
      sr.appendChild(cc);
    }
    single.appendChild(sr);
    c.appendChild(single);
  }));
}
