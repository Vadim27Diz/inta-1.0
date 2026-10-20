import type { ComponentDocs } from "@/docs/types"

export const sliderDocs: ComponentDocs = {
  title: "Slider",
  purpose: {
    ru: "Slider — выбор числового значения или диапазона перетаскиванием бегунка по шкале.",
    en: "Slider lets users pick a numeric value or range by dragging a thumb along a track.",
  },
  whenToUse: [
    {
      ru: "Значение из непрерывного или мелкого шага диапазона (например, громкость, яркость, цена) удобнее задавать перетаскиванием, чем набором на клавиатуре.",
      en: "A value from a continuous or fine-stepped range (e.g. volume, brightness, price) is easier to set by dragging than by typing.",
    },
    {
      ru: "Важно визуально видеть значение относительно всего диапазона — не только текущую цифру, но и то, где она на шкале.",
      en: "Seeing the value relative to the whole range matters — not just the current number, but where it sits on the scale.",
    },
    {
      ru: "Нужен выбор диапазона — Slider с двумя бегунками (defaultValue из двух чисел) задаёт минимум и максимум одним жестом.",
      en: "A range selection is needed — a Slider with two thumbs (defaultValue with two numbers) sets a minimum and maximum in one gesture.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Точное числовое значение важнее приблизительного визуального — пользователю нужно ввести конкретную цифру с клавиатуры.",
        en: "An exact numeric value matters more than an approximate visual one — the user needs to type a specific number.",
      },
      insteadOf: {
        name: "Input",
        description: { ru: "однострочное поле ввода (type=\"number\")", en: "a single-line field (type=\"number\")" },
      },
    },
    {
      description: {
        ru: "Отображение состояния процесса без возможности его менять пользователем — Slider интерактивен по умолчанию.",
        en: "Showing the state of a process with no user control over it — Slider is interactive by default.",
      },
      insteadOf: {
        name: "Progress",
        description: { ru: "индикатор хода процесса", en: "a progress indicator" },
      },
    },
  ],
  anatomy: [
    { name: "Track", description: { ru: "дорожка — вся доступная длина шкалы от min до max.", en: "the track — the full available length of the scale from min to max." } },
    { name: "Range", description: { ru: "закрашенная часть дорожки между min и текущим значением (или между двумя значениями при диапазоне).", en: "the filled part of the track between min and the current value (or between two values for a range)." } },
    { name: "Thumb", description: { ru: "бегунок — одна Thumb на каждое значение в defaultValue/value; перетаскивается вдоль дорожки.", en: "the thumb — one per value in defaultValue/value; dragged along the track." } },
  ],
  variants: [
    { name: "одно значение", description: { ru: "один бегунок — выбор одной точки на шкале", en: "a single thumb — picking one point on the scale" } },
    { name: "диапазон", description: { ru: "два бегунка — выбор минимума и максимума одновременно (defaultValue из двух чисел)", en: "two thumbs — picking a minimum and maximum at once (defaultValue with two numbers)" } },
    { name: "orientation: horizontal / vertical", description: { ru: "горизонтальная (по умолчанию) или вертикальная ориентация шкалы", en: "horizontal (default) or vertical track orientation" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние, бегунок доступен для перетаскивания", en: "the default state, the thumb is draggable" } },
    { name: "focus-visible", description: { ru: "видимое кольцо вокруг бегунка при переходе с клавиатуры — стрелки меняют значение с шагом step", en: "a visible ring around the thumb when reached via keyboard — arrow keys change the value by step" } },
    { name: "disabled", description: { ru: "перетаскивание недоступно, дорожка и бегунок выглядят приглушёнными", en: "dragging is disabled, the track and thumb look muted" } },
  ],
  contentRules: [
    {
      ru: "Рядом с Slider показывайте текущее числовое значение текстом — бегунок на шкале один не даёт точного ориентира.",
      en: "Show the current numeric value as text next to the Slider — the thumb's position alone doesn't give a precise reading.",
    },
    {
      ru: "Если у шкалы есть единицы измерения (%, ₽, мин) — подпишите их рядом со значением, а не только в заголовке поля.",
      en: "If the scale has a unit (%, $, min) — label it next to the value, not only in the field's title.",
    },
  ],
  accessibility: [
    {
      ru: "Доступен с клавиатуры из коробки: Tab фокусирует бегунок, стрелки меняют значение на шаг step, Home/End — на минимум/максимум.",
      en: "Keyboard-accessible out of the box: Tab focuses the thumb, arrow keys change the value by step, Home/End jump to minimum/maximum.",
    },
    {
      ru: "Скринридер объявляет текущее значение и диапазон (min/max) при фокусе на бегунке.",
      en: "A screen reader announces the current value and range (min/max) when the thumb is focused.",
    },
    {
      ru: "При диапазоне (двух бегунках) каждый фокусируется и объявляется отдельно, в порядке минимум → максимум.",
      en: "With a range (two thumbs), each is focused and announced separately, in minimum → maximum order.",
    },
  ],
  related: [
    { name: "Progress", description: { ru: "невзаимодействующий индикатор хода процесса", en: "a non-interactive progress indicator" } },
    { name: "Input", description: { ru: "точное числовое значение с клавиатуры", en: "a precise numeric value from the keyboard" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка над Radix Slider.Root/Track/Range/Thumb. Число отрисованных Thumb вычисляется из length value ?? defaultValue ?? [min, max] — один элемент даёт один бегунок, два — диапазон.",
      en: "A wrapper around Radix Slider.Root/Track/Range/Thumb. The number of rendered Thumbs comes from the length of value ?? defaultValue ?? [min, max] — one element gives one thumb, two give a range.",
    },
    {
      ru: "Состояния читаются через data-disabled и data-[orientation=…] от Radix, а не через отдельные пропы компонента.",
      en: "States are read via Radix's data-disabled and data-[orientation=…], not via separate component props.",
    },
    {
      ru: "Фокус-кольцо — outline на Thumb (focus-visible:outline-solid outline-2 outline-focus-ring), не влияет на Track/Range.",
      en: "The focus ring is an outline on the Thumb (focus-visible:outline-solid outline-2 outline-focus-ring), it doesn't affect the Track/Range.",
    },
  ],
}
