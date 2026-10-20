import type { ComponentDocs } from "@/docs/types"

export const progressDocs: ComponentDocs = {
  title: "Progress",
  purpose: {
    ru: "Progress показывает ход длительного процесса — какая доля уже завершена, без возможности на него повлиять.",
    en: "Progress shows how far a long-running process has gotten — the completed share, with no user control over it.",
  },
  whenToUse: [
    {
      ru: "Известна доля завершённого процесса (загрузка файла, импорт, многошаговая настройка) — значение можно выразить числом от 0 до 100.",
      en: "The completed share of a process is known (a file upload, an import, a multi-step setup) — expressible as a number from 0 to 100.",
    },
    {
      ru: "Процесс идёт, но доля завершения неизвестна — Progress без value показывает, что работа продолжается, без конкретного числа.",
      en: "A process is running but its completed share is unknown — Progress with no value shows that work is ongoing, with no specific number.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Пользователь должен сам задать значение — Progress только отображает, не принимает ввод.",
        en: "The user needs to set the value themselves — Progress only displays, it doesn't accept input.",
      },
      insteadOf: {
        name: "Slider",
        description: { ru: "перетаскиваемый выбор значения", en: "a draggable value picker" },
      },
    },
    {
      description: {
        ru: "Процесс мгновенный или его длительность непредсказуема и не выражается долей — нужен просто индикатор «идёт загрузка» без шкалы.",
        en: "The process is instant, or its duration can't be expressed as a share — a plain “loading” indicator with no scale is enough.",
      },
      insteadOf: {
        name: "Spinner",
        description: { ru: "индикатор загрузки без значения", en: "a loading indicator with no value" },
      },
    },
  ],
  anatomy: [
    { name: "Progress (track)", description: { ru: "корневой элемент — фоновая дорожка на всю ширину, показывает весь диапазон 0–100%.", en: "the root element — a full-width background track representing the whole 0–100% range." } },
    { name: "Indicator", description: { ru: "закрашенная часть внутри track — её ширина отражает текущее значение value.", en: "the filled part inside the track — its width reflects the current value." } },
  ],
  variants: [
    { name: "value: 0–100", description: { ru: "доля завершения в процентах — определяет, насколько закрашен indicator", en: "the completed share in percent — determines how much of the indicator is filled" } },
  ],
  states: [
    { name: "loading", description: { ru: "value между 0 и 100 — процесс выполняется", en: "value is between 0 and 100 — the process is running" } },
    { name: "complete", description: { ru: "value = 100 — процесс завершён", en: "value = 100 — the process is complete" } },
    { name: "indeterminate", description: { ru: "value не передан — идёт работа, но доля неизвестна", en: "value isn't passed — work is ongoing but the share is unknown" } },
  ],
  contentRules: [
    {
      ru: "Рядом с Progress покажите текстом, что именно загружается или выполняется («Загрузка файла…», «Шаг 2 из 4») — одна полоска без подписи не объясняет контекст.",
      en: "Show as text next to Progress what exactly is loading or running (“Uploading file…”, “Step 2 of 4”) — a bare bar with no caption doesn't explain the context.",
    },
    {
      ru: "Если значение в процентах важно пользователю, выводите число отдельно текстом рядом с полосой — сам компонент число не рисует.",
      en: "If the percentage matters to the user, display the number separately as text next to the bar — the component itself doesn't render a number.",
    },
  ],
  accessibility: [
    {
      ru: "Скринридер объявляет текущее значение и диапазон (role=\"progressbar\", aria-valuenow/aria-valuemin/aria-valuemax) автоматически, без дополнительной настройки — при value в диапазоне 0–100.",
      en: "A screen reader announces the current value and range (role=\"progressbar\", aria-valuenow/aria-valuemin/aria-valuemax) automatically, with no extra setup — when value is in the 0–100 range.",
    },
    {
      ru: "В indeterminate (value не передан) aria-valuenow закономерно отсутствует — скринридер объявляет только роль progressbar, без числа. Это корректное поведение ARIA для неизвестной доли, а не упущение.",
      en: "In the indeterminate case (value not passed), aria-valuenow is correctly absent — a screen reader announces only the progressbar role, with no number. This is correct ARIA behavior for an unknown share, not an omission.",
    },
    {
      ru: "Progress не интерактивен — не получает фокус с клавиатуры, это ожидаемое поведение для индикатора, а не поля ввода.",
      en: "Progress isn't interactive — it doesn't receive keyboard focus; that's expected for a display indicator, not an input field.",
    },
  ],
  related: [
    { name: "Slider", description: { ru: "интерактивный выбор значения перетаскиванием", en: "an interactive drag-to-select value" } },
    { name: "Spinner", description: { ru: "индикатор загрузки без значения и шкалы", en: "a loading indicator with no value or scale" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка над Radix Progress.Root/Indicator. Ширина indicator задаётся не классом Tailwind, а inline transform (translateX(-${100 - value}%)) — процент приходит как произвольное число, а не шаг шкалы.",
      en: "A wrapper around Radix Progress.Root/Indicator. The indicator's width is set not via a Tailwind class but an inline transform (translateX(-${100 - value}%)) — the percentage is an arbitrary number, not a scale step.",
    },
    {
      ru: "value не передан → indeterminate: сам компонент не анимирует этот случай (нет встроенной полосы loading-анимации) — анимацию, если нужна, добавляет тот, кто использует компонент.",
      en: "value not passed → indeterminate: the component itself doesn't animate this case (no built-in loading-bar animation) — add animation separately if needed.",
    },
    {
      ru: "value передаётся не только в transform индикатора, но и в сам Radix Progress.Root — без этого у корня не было бы aria-valuenow и data-state всегда читался бы как indeterminate, независимо от value.",
      en: "value is passed not only to the indicator's transform but to the Radix Progress.Root itself — without that, the root would have no aria-valuenow and data-state would always read as indeterminate, regardless of value.",
    },
  ],
}
