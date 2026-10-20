import type { ComponentDocs } from "@/docs/types"

export const checkboxDocs: ComponentDocs = {
  title: "Checkbox",
  purpose: {
    ru: "Checkbox — квадратный переключатель для независимого выбора одного пункта в списке: согласия, опции, строки таблицы.",
    en: "Checkbox is a square control for independently selecting one item in a list: a consent, an option, a table row.",
  },
  whenToUse: [
    {
      ru: "Пользователь может выбрать несколько пунктов из списка одновременно, и выбор одного не исключает другие.",
      en: "The user can select several items from a list at once, and picking one doesn't rule out the others.",
    },
    {
      ru: "Нужно явное согласие с условием (например, с правилами) перед продолжением.",
      en: "Explicit agreement to a condition (e.g. terms) is needed before continuing.",
    },
    {
      ru: "Нужен пункт «выбрать всё» с промежуточным состоянием, когда выбрана только часть вложенных пунктов.",
      en: "A “select all” item needs an in-between state for when only some of the nested items are selected.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Нужно выбрать ровно один вариант из небольшого видимого набора взаимоисключающих опций.",
        en: "Exactly one option must be chosen from a small, fully visible set of mutually exclusive options.",
      },
      insteadOf: {
        name: "Radio Group",
        description: { ru: "группа радиокнопок", en: "radio button group" },
      },
    },
    {
      description: {
        ru: "Один параметр включается или выключается сразу, без отдельного шага сохранения — например, настройка в профиле.",
        en: "A single setting turns on or off immediately, with no separate save step — e.g. a preference in a profile.",
      },
      insteadOf: {
        name: "Switch",
        description: { ru: "переключатель состояния", en: "state toggle" },
      },
    },
  ],
  anatomy: [
    {
      name: "Квадрат",
      description: {
        ru: "сам переключаемый элемент, 16×16 — подпись (Label) компонент не создаёт сам, её добавляет тот, кто использует Checkbox.",
        en: "the control itself, 16×16 — the component doesn't render its own label; whoever uses Checkbox adds it.",
      },
    },
    {
      name: "Индикатор",
      description: {
        ru: "галочка в выбранном состоянии, чёрточка — в промежуточном (indeterminate).",
        en: "a checkmark when selected, a dash for the in-between (indeterminate) state.",
      },
    },
  ],
  variantGuidance: [
    {
      ru: "indeterminate (промежуточное) — только для родительского «выбрать всё», когда выбрана часть вложенных пунктов. Это визуальное состояние, не третье пользовательское значение: клик по такому чекбоксу переводит его сразу в checked, минуя indeterminate.",
      en: "indeterminate is only for a parent “select all” item when some of its nested items are selected. It's a visual state, not a third user-facing value: clicking it moves straight to checked, skipping indeterminate.",
    },
  ],
  variants: [
    { name: "unchecked", description: { ru: "не выбран", en: "not selected" } },
    { name: "checked", description: { ru: "выбран", en: "selected" } },
    { name: "indeterminate", description: { ru: "выбрана только часть вложенных пунктов", en: "only some of the nested items are selected" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние", en: "the default state" } },
    { name: "focus-visible", description: { ru: "видимое кольцо при переходе с клавиатуры", en: "a visible ring when reached via keyboard" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки в невыбранном состоянии — например, обязательное согласие не отмечено", en: "an error-colored border while unselected — e.g. a required consent left unchecked" } },
    { name: "disabled", description: { ru: "недоступен для выбора, выглядит приглушённым", en: "not selectable, looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подпись формулируется как утверждение, с которым соглашаются («Согласен с условиями»), а не как вопрос или команда.",
      en: "The label reads as a statement the user agrees with (“I agree to the terms”), not a question or a command.",
    },
    {
      ru: "Одна строка на пункт по возможности; если подпись длинная и переносится на несколько строк, квадрат выравнивается по верхней строке, а не по центру всего блока.",
      en: "Keep it to one line per item where possible; if the label is long and wraps, the square aligns to the first line, not the center of the whole block.",
    },
    {
      ru: "Для обязательного согласия объясняйте рядом, почему без него нельзя продолжить, а не оставляйте чекбокс в состоянии ошибки без пояснения.",
      en: "For a required consent, explain nearby why continuing isn't possible without it — don't leave the checkbox in an error state with no explanation.",
    },
  ],
  accessibility: [
    {
      ru: "Подпись (Label), связанная с чекбоксом через htmlFor, увеличивает область клика и озвучивается скринридером вместе с элементом — компонент этого не делает сам.",
      en: "A label linked to the checkbox via htmlFor enlarges the clickable area and is announced by a screen reader together with the control — the component doesn't do this on its own.",
    },
    {
      ru: "Доступен с клавиатуры из коробки: Tab переводит фокус, Space переключает состояние.",
      en: "Keyboard-accessible out of the box: Tab moves focus, Space toggles the state.",
    },
    {
      ru: "Промежуточное состояние (indeterminate) озвучивается скринридером отдельно от checked/unchecked.",
      en: "The in-between (indeterminate) state is announced by a screen reader distinctly from checked/unchecked.",
    },
  ],
  related: [
    { name: "Radio Group", description: { ru: "выбор ровно одного варианта из набора", en: "choosing exactly one option from a set" } },
    { name: "Switch", description: { ru: "один параметр, применяется сразу", en: "a single setting, applied immediately" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
  ],
  forDevelopers: [
    {
      ru: "checked принимает false / true / \"indeterminate\" — три значения Radix, не boolean.",
      en: "checked takes false / true / \"indeterminate\" — three Radix values, not a boolean.",
    },
    {
      ru: "Кликабельная область шире видимого квадрата (after: -inset-x-2 -inset-y-2), сам квадрат остаётся 16×16.",
      en: "The clickable area is larger than the visible square (after: -inset-x-2 -inset-y-2); the square itself stays 16×16.",
    },
    {
      ru: "Фокус-кольцо — outline (Kind=control из Utility / Focus ring), не ring: зазор 2px, скругление на шаг выше квадрата.",
      en: "The focus ring is an outline (Kind=control from Utility / Focus ring), not a box-shadow ring: 2px gap, radius one step above the square.",
    },
    {
      ru: "enabled: обязателен перед data-[state=checked]:bg-primary и data-[state=indeterminate]:bg-primary — иначе выбранное состояние перебивает disabled, т.к. у утилит Tailwind одинаковая специфичность.",
      en: "enabled: is required before data-[state=checked]:bg-primary and data-[state=indeterminate]:bg-primary — otherwise the selected state would override disabled, since Tailwind utilities share the same specificity.",
    },
  ],
}
