import type { ComponentDocs } from "@/docs/types"

export const radioGroupDocs: ComponentDocs = {
  title: "Radio Group",
  purpose: {
    ru: "Radio Group — группа круглых переключателей для выбора ровно одного варианта из небольшого видимого набора.",
    en: "Radio Group is a set of round controls for choosing exactly one option out of a small, fully visible set.",
  },
  whenToUse: [
    {
      ru: "Вариантов немного (ориентировочно 2–5), и все они должны быть видны сразу, без лишнего клика, чтобы их открыть.",
      en: "There are only a few options (roughly 2-5), and they should all be visible at once without an extra click to reveal them.",
    },
    {
      ru: "Выбор взаимоисключающий — ровно один вариант, не несколько.",
      en: "The choice is mutually exclusive — exactly one option, not several.",
    },
    {
      ru: "Важно удобно сравнивать варианты между собой — например, уровни тарифа или размеры.",
      en: "Comparing the options side by side matters — e.g. plan tiers or sizes.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Вариантов много (обычно от 6–7) или место ограничено — список удобнее, чем показывать все варианты сразу.",
        en: "There are many options (typically 6-7 or more), or space is limited — a dropdown works better than showing every option at once.",
      },
      insteadOf: {
        name: "Select / Native Select",
        description: { ru: "выпадающий список", en: "a dropdown" },
      },
    },
    {
      description: {
        ru: "Можно выбрать несколько вариантов одновременно, а не ровно один.",
        en: "Several options can be selected at once, not exactly one.",
      },
      insteadOf: {
        name: "Checkbox",
        description: { ru: "независимый выбор нескольких пунктов", en: "independent selection of several items" },
      },
    },
    {
      description: {
        ru: "Вариант всего один, и он включается/выключается сразу, без формы.",
        en: "There's only one setting, and it toggles immediately, with no form.",
      },
      insteadOf: {
        name: "Switch",
        description: { ru: "переключатель состояния", en: "state toggle" },
      },
    },
  ],
  anatomy: [
    {
      name: "Группа",
      description: {
        ru: "контейнер, который гарантирует, что выбран ровно один пункт — объединяет все RadioGroupItem одной формы.",
        en: "the container that guarantees exactly one item is selected — groups all RadioGroupItems of one choice together.",
      },
    },
    {
      name: "Пункт",
      description: {
        ru: "один круглый переключатель с собственным value — подпись (Label) компонент не создаёт сам.",
        en: "one round control with its own value — the component doesn't render its own label.",
      },
    },
  ],
  variants: [
    { name: "unchecked", description: { ru: "не выбран", en: "not selected" } },
    { name: "checked", description: { ru: "выбран — ровно один пункт в группе", en: "selected — exactly one item per group" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние", en: "the default state" } },
    { name: "focus-visible", description: { ru: "видимое кольцо при переходе с клавиатуры", en: "a visible ring when reached via keyboard" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки на невыбранных пунктах — например, когда ни один вариант в обязательной группе не выбран", en: "an error-colored border on unselected items — e.g. when a required group has no selection yet" } },
    { name: "disabled", description: { ru: "пункт недоступен для выбора, выглядит приглушённым", en: "the item is not selectable, looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подписи вариантов — короткие, взаимоисключающие по смыслу и сопоставимые по длине друг с другом.",
      en: "Option labels are short, mutually exclusive in meaning, and comparable in length to each other.",
    },
    {
      ru: "Один из вариантов обычно выбран по умолчанию — в отличие от выпадающего списка, пустой выбор в видимой группе выглядит как недосмотр, а не осознанный плейсхолдер.",
      en: "One option is usually pre-selected — unlike a dropdown, an empty selection in a fully visible group reads as an oversight, not a deliberate placeholder.",
    },
    {
      ru: "Порядок вариантов — по частоте использования или по понятной логике (возрастание, алфавит), одинаковый при каждом повторном показе группы.",
      en: "Order options by frequency of use or by a clear logic (ascending, alphabetical), and keep it consistent every time the group is shown.",
    },
  ],
  accessibility: [
    {
      ru: "Подпись (Label), связанная с каждым пунктом через htmlFor, увеличивает область клика и озвучивается скринридером вместе с элементом.",
      en: "A label linked to each item via htmlFor enlarges the clickable area and is announced by a screen reader together with the control.",
    },
    {
      ru: "Доступна с клавиатуры из коробки: Tab переводит фокус на группу, стрелки перемещаются между пунктами и сразу выбирают их.",
      en: "Keyboard-accessible out of the box: Tab moves focus to the group, arrow keys move between items and select them immediately.",
    },
    {
      ru: "Скринридер объявляет группу и позицию пункта в ней («2 из 3»), не только его подпись.",
      en: "A screen reader announces the group and the item's position within it (“2 of 3”), not just its label.",
    },
  ],
  related: [
    { name: "Checkbox", description: { ru: "независимый выбор нескольких пунктов", en: "independent selection of several items" } },
    { name: "Select", description: { ru: "кастомный выпадающий список", en: "a custom dropdown" } },
    { name: "Native Select", description: { ru: "поле выбора с родным выпадающим списком", en: "a dropdown field with the device's own picker UI" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для группы", en: "a group's label and error message" } },
  ],
  forDevelopers: [
    {
      ru: "RadioGroupItem всегда внутри RadioGroup — выбранность хранит группа (value/defaultValue), не отдельный пункт.",
      en: "RadioGroupItem always lives inside RadioGroup — selection state lives on the group (value/defaultValue), not on an individual item.",
    },
    {
      ru: "Кликабельная область пункта шире видимого круга (after: -inset-x-2 -inset-y-2), сам круг остаётся 16×16.",
      en: "The item's clickable area is larger than the visible circle (after: -inset-x-2 -inset-y-2); the circle itself stays 16×16.",
    },
    {
      ru: "Фокус-кольцо — outline (Kind=control из Utility / Focus ring), не ring: зазор 2px, скругление на шаг выше круга.",
      en: "The focus ring is an outline (Kind=control from Utility / Focus ring), not a box-shadow ring: 2px gap, radius one step above the circle.",
    },
    {
      ru: "enabled: обязателен перед data-[state=checked]:border-primary — иначе выбранное состояние перебивает disabled.",
      en: "enabled: is required before data-[state=checked]:border-primary — otherwise the selected state would override disabled.",
    },
  ],
}
