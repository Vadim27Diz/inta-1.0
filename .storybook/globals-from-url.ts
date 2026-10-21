// Общий разбор query-параметра ?globals=brand:demo;theme:dark — Storybook сам пишет его в URL
// (вручную при тулбаре, автоматически при навигации) в обоих документах, которые нас интересуют:
// manager (top-level, читает window.location напрямую) и preview-iframe (у него свой location,
// тот же формат). Один файл вместо двух копий одной и той же логики парсинга.
export function parseGlobalsParam(search: string): Record<string, string> {
  const globalsParam = new URLSearchParams(search).get("globals") ?? "";
  return Object.fromEntries(
    globalsParam
      .split(";")
      .filter(Boolean)
      .map((pair) => pair.split(":") as [string, string])
  );
}

export function brandThemeKey(pairs: { brand?: string; theme?: string }): string {
  return `${pairs.brand ?? "main"}-${pairs.theme ?? "light"}`;
}
