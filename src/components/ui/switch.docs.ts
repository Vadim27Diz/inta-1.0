import type { ComponentDocs } from "@/docs/types"

export const switchDocs: ComponentDocs = {
  title: "Switch",
  purpose: {
    ru: "Switch — переключатель одного параметра вкл/выкл, который применяется сразу, без отдельного подтверждения.",
    en: "Switch is an on/off toggle for a single setting that takes effect immediately, with no separate confirmation step.",
  },
  whenToUse: [
    {
      ru: "Параметр имеет ровно два состояния, и переключение сразу вступает в силу — например, настройка в профиле или панели управления.",
      en: "The setting has exactly two states, and toggling it takes effect right away — e.g. a preference in a profile or a settings panel.",
    },
    {
      ru: "Не нужна отдельная кнопка «Сохранить»: изменение видно и действует немедленно.",
      en: "No separate “Save” button is needed: the change is visible and in effect immediately.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Выбор входит в состав формы и применяется только после отправки (нажатия «Сохранить» или «Отправить»).",
        en: "The choice is part of a form and only takes effect after submission (pressing “Save” or “Submit”).",
      },
      insteadOf: {
        name: "Checkbox",
        description: { ru: "выбор внутри формы", en: "a selection inside a form" },
      },
    },
    {
      description: {
        ru: "Вариантов выбора больше двух, или они взаимоисключающие и должны быть видны одновременно.",
        en: "There are more than two options, or they're mutually exclusive and need to be visible at once.",
      },
      insteadOf: {
        name: "Radio Group",
        description: { ru: "группа радиокнопок", en: "radio button group" },
      },
    },
  ],
  anatomy: [
    {
      name: "Дорожка",
      description: {
        ru: "фон переключателя, меняет цвет в зависимости от состояния.",
        en: "the track behind the thumb, changes color depending on state.",
      },
    },
    {
      name: "Бегунок",
      description: {
        ru: "сдвигается влево/вправо по дорожке — подпись (Label) компонент не создаёт сам.",
        en: "slides left/right along the track — the component doesn't render its own label.",
      },
    },
  ],
  variants: [
    { name: "off", description: { ru: "параметр выключен", en: "the setting is off" } },
    { name: "on", description: { ru: "параметр включён", en: "the setting is on" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние", en: "the default state" } },
    { name: "focus-visible", description: { ru: "видимое кольцо при переходе с клавиатуры", en: "a visible ring when reached via keyboard" } },
    { name: "disabled", description: { ru: "недоступен для переключения, выглядит приглушённым", en: "not toggleable, looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подпись рядом со Switch формулируется как название параметра («Уведомления по email»), а не как вопрос или инструкция.",
      en: "The label next to Switch names the setting (“Email notifications”), not a question or an instruction.",
    },
    {
      ru: "Если включённое и выключенное состояния нужно явно подписать текстом (не только позицией бегунка), используйте пару коротких слов («Вкл» / «Выкл»), а не предложение.",
      en: "If the on/off state needs an explicit text label (not just the thumb's position), use a short word pair (“On” / “Off”), not a sentence.",
    },
  ],
  accessibility: [
    {
      ru: "Подпись (Label), связанная со Switch через htmlFor, увеличивает область клика и озвучивается скринридером вместе с элементом — компонент этого не делает сам.",
      en: "A label linked to Switch via htmlFor enlarges the clickable area and is announced by a screen reader together with the control — the component doesn't do this on its own.",
    },
    {
      ru: "Доступен с клавиатуры из коробки: Tab переводит фокус, Space переключает состояние.",
      en: "Keyboard-accessible out of the box: Tab moves focus, Space toggles the state.",
    },
    {
      ru: "Скринридер объявляет состояние как «включено»/«выключено», не полагаясь только на цвет дорожки.",
      en: "A screen reader announces the state as “on”/“off”, not relying on the track's color alone.",
    },
  ],
  related: [
    { name: "Checkbox", description: { ru: "выбор внутри формы, применяется после отправки", en: "a selection inside a form, applied on submit" } },
    { name: "Toggle", description: { ru: "кнопка с устойчивым состоянием on/off", en: "a button with a persistent on/off state" } },
  ],
  forDevelopers: [
    {
      ru: "Дорожка 36×20, бегунок 16 с отступом 2 — ход вычислен как translate-x-4 (36 − 4 − 16 = 16).",
      en: "Track is 36×20, thumb is 16 with a 2px inset — travel distance is translate-x-4 (36 − 4 − 16 = 16).",
    },
    {
      ru: "Кликабельная область шире видимой дорожки (after: -inset-x-2 -inset-y-2).",
      en: "The clickable area is larger than the visible track (after: -inset-x-2 -inset-y-2).",
    },
    {
      ru: "Фокус-кольцо — outline (Kind=control из Utility / Focus ring), не ring: зазор 2px, скругление на шаг выше дорожки.",
      en: "The focus ring is an outline (Kind=control from Utility / Focus ring), not a box-shadow ring: 2px gap, radius one step above the track.",
    },
    {
      ru: "enabled: обязателен перед data-[state=…]:bg-* — иначе цвет дорожки перебивает disabled:bg-disabled, т.к. у утилит Tailwind одинаковая специфичность. У Switch нет aria-invalid — состояние ошибки для него не предусмотрено.",
      en: "enabled: is required before data-[state=…]:bg-* — otherwise the track color would override disabled:bg-disabled, since Tailwind utilities share the same specificity. Switch has no aria-invalid — an error state isn't defined for it.",
    },
  ],
}
