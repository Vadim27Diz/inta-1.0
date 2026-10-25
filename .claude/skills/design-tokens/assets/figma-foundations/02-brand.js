// ---------- 02 Brand ----------
{
  const f = await topFrame("02", "Brand", "Роль → Main / Demo. У каждой ячейки режим Brand задан явно, Theme = Light. Если образец не перекрасился между ячейками — в нём не переменная, а значение.");
  const row = rowOf(32, "brands");
  for (const brand of ["Main", "Demo"]) {
    const cellFrame = await modeCell(brand, "Light");
    const addRow = async (label, build) => {
      const g = cell(8);
      g.appendChild(await T("label/sm", label, "color/on-surface-muted"));
      g.appendChild(await build());
      cellFrame.appendChild(g);
    };
    for (const family of ["primary", "secondary"]) {
      await addRow(`color/${family}/* + color/on-${family}`, async () => {
        const r = rowOf(10);
        for (const state of ["default", "hover", "pressed"]) {
          const name = `color/${family}/${state}`;
          const c = cell(4);
          c.appendChild(await plate(name, `color/on-${family}`, `Aa on-${family}`));
          c.appendChild(await T("numeric/2xs", `${state} · ${hex(resolve(name, brand, "Light"))}`, "color/on-surface-muted"));
          r.appendChild(c);
        }
        return r;
      });
    }
    await addRow("font/sans · текст стилем body/md", async () => {
      const c = cell(4);
      c.appendChild(await T("body/md", "Съешь ещё этих мягких булок Aa 123", "color/on-surface"));
      c.appendChild(await T("numeric/2xs", `font/sans → ${resolve("font/sans", brand, "Light")}`, "color/on-surface-muted"));
      return c;
    });
    await addRow("font/heading · текст стилем heading/4", async () => {
      const c = cell(4);
      c.appendChild(await T("heading/4", "Заголовок Aa Яя", "color/on-surface"));
      c.appendChild(await T("numeric/2xs", `font/heading → ${resolve("font/heading", brand, "Light")}`, "color/on-surface-muted"));
      return c;
    });
    await addRow("radius/sm…xl", async () => {
      const r = rowOf(10);
      for (const size of ["sm", "md", "lg", "xl"]) {
        const c = cell(4);
        c.appendChild(block(56, 56, "color/primary/default", { radius: `radius/${size}`, border: false }));
        c.appendChild(await T("numeric/2xs", `${size} · ${resolve(`radius/${size}`, brand, "Light")}`, "color/on-surface-muted"));
        r.appendChild(c);
      }
      return r;
    });
    row.appendChild(cellFrame);
  }
  f.appendChild(row);
}
