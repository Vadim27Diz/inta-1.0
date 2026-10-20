import type { ComponentDocs } from "@/docs/types"

export const textareaDocs: ComponentDocs = {
  title: "Textarea",
  purpose: {
    ru: "Textarea — многострочное поле для свободного текста: комментария, описания, адреса, сообщения.",
    en: "Textarea is a multi-line field for free-form text: a comment, a description, an address, a message.",
  },
  whenToUse: [
    {
      ru: "Ожидаемое значение может занимать несколько строк или заранее неизвестно по длине.",
      en: "The expected value may span several lines, or its length isn't known up front.",
    },
    {
      ru: "Пользователю важно видеть несколько строк текста сразу, без прокрутки однострочного поля.",
      en: "The user needs to see several lines of text at once, without scrolling a single-line field.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Значение короткое и умещается в одну строку — имя, email, телефон, число.",
        en: "The value is short and fits on one line — a name, email, phone number, a quantity.",
      },
      insteadOf: {
        name: "Input",
        description: { ru: "однострочное поле ввода", en: "a single-line input field" },
      },
    },
    {
      description: {
        ru: "Значение выбирается из заранее известного набора вариантов, а не вводится свободно.",
        en: "The value is picked from a known, predefined set of options rather than typed freely.",
      },
      insteadOf: {
        name: "Select / Native Select",
        description: { ru: "выбор одного варианта из списка", en: "choosing one option from a list" },
      },
    },
  ],
  anatomy: [
    {
      name: "Поле",
      description: {
        ru: "само поле ввода — растёт по высоте вместе с содержимым без появления прокрутки; ширину задаёт тот, кто размещает компонент на экране.",
        en: "the field itself — grows in height with its content with no internal scrollbar appearing; its width is set by whoever places the component on the screen.",
      },
    },
  ],
  variants: [],
  states: [
    { name: "default", description: { ru: "обычное состояние поля", en: "the field's default state" } },
    { name: "focus-visible", description: { ru: "видимое выделение поля при переходе с клавиатуры", en: "a visible highlight when the field is reached via keyboard" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки, когда введённое значение не проходит валидацию", en: "an error-colored border when the current value fails validation" } },
    { name: "disabled", description: { ru: "поле недоступно для ввода, выглядит приглушённым", en: "the field is not editable and looks muted" } },
  ],
  contentRules: [
    {
      ru: "Placeholder — подсказка формата или примера, не замена подписи поля.",
      en: "Placeholder is a format hint or example, not a substitute for the field's label.",
    },
    {
      ru: "Длинное слово без пробелов переносится внутри строки, а не растягивает поле по ширине.",
      en: "A long word with no spaces wraps within the line rather than stretching the field's width.",
    },
    {
      ru: "Если у поля есть ограничение длины, показывайте счётчик символов рядом (например, через Input Group), не оставляйте пользователя гадать, сколько ещё можно написать.",
      en: "If the field has a length limit, show a character counter nearby (e.g. via Input Group) — don't leave the user guessing how much more they can type.",
    },
  ],
  accessibility: [
    {
      ru: "Как и у любого поля формы, нужна подпись (Label), связанная с полем, — компонент её не создаёт сам.",
      en: "Like any form field, it needs a label associated with it — the component doesn't render one itself.",
    },
    {
      ru: "Неактивное (disabled) поле нельзя сфокусировать с клавиатуры, и скринридер не объявляет его как доступное для ввода.",
      en: "A disabled field can't be focused with the keyboard, and a screen reader doesn't announce it as editable.",
    },
  ],
  related: [
    { name: "Input", description: { ru: "однострочное поле ввода", en: "a single-line input field" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
    { name: "Input Group", description: { ru: "многострочное поле со счётчиком или аддоном", en: "a multi-line field with a counter or an addon" } },
  ],
  forDevelopers: [
    {
      ru: "field-sizing-content — поле растёт по высоте вместе с содержимым (CSS, не JS), минимальная высота min-h-16.",
      en: "field-sizing-content grows the field's height with its content (CSS, not JS), with a min-h-16 floor.",
    },
    {
      ru: "focus-visible — ring-3 ring-focus-ring вплотную к рамке, тот же приём, что у Input.",
      en: "focus-visible is a ring-3 ring-focus-ring flush against the border, the same treatment as Input.",
    },
    {
      ru: "invalid — aria-invalid:border-danger; disabled — cursor-not-allowed, bg-disabled/text-on-disabled.",
      en: "invalid is aria-invalid:border-danger; disabled is cursor-not-allowed with bg-disabled/text-on-disabled.",
    },
  ],
}
