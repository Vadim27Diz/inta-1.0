import type { ComponentDocs } from "@/docs/types"

export const inputDocs: ComponentDocs = {
  title: "Input",
  purpose: {
    ru: "Input — однострочное поле для ввода произвольного текста или числа: имени, email, пароля, телефона, количества.",
    en: "Input is a single-line field for typing free-form text or a number: a name, email, password, phone number, quantity.",
  },
  whenToUse: [
    {
      ru: "Значение вводит сам пользователь — оно не выбирается из заранее известного списка.",
      en: "The user types the value themselves — it isn't chosen from a predefined list.",
    },
    {
      ru: "Значение умещается в одну строку.",
      en: "The value fits on a single line.",
    },
    {
      ru: "Нужна клавиатура или валидация, специфичная для типа данных: email, число, пароль, телефон.",
      en: "A data-specific keyboard or validation is useful: email, number, password, phone.",
    },
  ],
  whenNotToUse: [
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
    {
      description: {
        ru: "Значение многострочное — комментарий, описание, адрес в свободной форме.",
        en: "The value spans multiple lines — a comment, a description, a free-form address.",
      },
      insteadOf: {
        name: "Textarea",
        description: { ru: "многострочное поле ввода", en: "a multi-line input field" },
      },
    },
    {
      description: {
        ru: "Рядом с полем нужна иконка, подпись-префикс (например, «https://») или кнопка — всё в одной визуальной рамке.",
        en: "The field needs an adjacent icon, a prefix label (e.g. “https://”), or a button — all inside one visual frame.",
      },
      insteadOf: {
        name: "Input Group",
        description: { ru: "поле с иконкой, текстом или кнопкой-аддоном", en: "a field with an icon, text, or button addon" },
      },
    },
  ],
  anatomy: [
    {
      name: "Поле",
      description: {
        ru: "само поле ввода — его ширину задаёт тот, кто размещает компонент на экране (например, форма).",
        en: "the input field itself — its width is set by whoever places the component on the screen (e.g. a form).",
      },
    },
    {
      name: "Тип",
      description: {
        ru: "text, email, password, number, tel, file и т.д. — определяет клавиатуру на мобильных устройствах и встроенную валидацию браузера, задаётся тем, кто использует компонент.",
        en: "text, email, password, number, tel, file, etc. — determines the on-screen keyboard on mobile and the browser's built-in validation, set by whoever uses the component.",
      },
    },
  ],
  variants: [
    { name: "size: sm / md / lg", description: { ru: "три размера под плотность интерфейса: sm — компактные панели, md — размер по умолчанию, lg — заметные одиночные поля", en: "three sizes for interface density: sm for compact panels, md is the default, lg for prominent standalone fields" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние поля", en: "the field's default state" } },
    { name: "focus-visible", description: { ru: "видимое выделение поля при переходе с клавиатуры", en: "a visible highlight when the field is reached via keyboard" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки, когда введённое значение не проходит валидацию", en: "an error-colored border when the current value fails validation" } },
    { name: "disabled", description: { ru: "поле недоступно для ввода, выглядит приглушённым", en: "the field is not editable and looks muted" } },
  ],
  contentRules: [
    {
      ru: "Placeholder — подсказка формата или примера («you@example.com»), не замена подписи поля и не предзаполненное значение, которое можно случайно принять за уже введённое.",
      en: "Placeholder is a format hint or example (“you@example.com”), not a substitute for the field's label and not a pre-filled value that could be mistaken for something already entered.",
    },
    {
      ru: "Длинное значение не переносится и не обрезается — поле прокручивается внутри себя, его ширина не меняется.",
      en: "A long value neither wraps nor truncates — the field scrolls internally, its width stays the same.",
    },
    {
      ru: "Сообщение об ошибке — рядом с полем (через Field), конкретное и объясняющее, что исправить, а не общее «Ошибка».",
      en: "The error message sits next to the field (via Field), is specific, and explains what to fix — not a generic “Error”.",
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
    {
      ru: "Сообщение об ошибке должно быть связано с полем программно (через aria-describedby), чтобы скринридер озвучивал его при фокусе на поле, а не только показывал визуально.",
      en: "The error message must be programmatically linked to the field (via aria-describedby) so a screen reader announces it on focus, not only shows it visually.",
    },
  ],
  related: [
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
    { name: "Input Group", description: { ru: "поле с иконкой, текстом или кнопкой-аддоном", en: "a field with an icon, text, or button addon" } },
    { name: "Textarea", description: { ru: "многострочное поле ввода", en: "a multi-line input field" } },
  ],
  forDevelopers: [
    {
      ru: "Ширина не задана по умолчанию (w-full) — управляется className на самом <input> через обёртку формы, в отличие от Native Select, где чевроном владеет обёртка.",
      en: "Width defaults to full-bleed (w-full) and is controlled via className directly on the <input>, unlike Native Select, where the wrapper owns the chevron.",
    },
    {
      ru: "focus-visible — ring-3 ring-focus-ring вплотную к рамке (box-shadow, не outline), скругление само повторяет radius поля.",
      en: "focus-visible is a ring-3 ring-focus-ring flush against the border (box-shadow, not outline); the radius follows the field's own corner radius.",
    },
    {
      ru: "invalid — aria-invalid:border-danger; disabled — cursor-not-allowed, bg-disabled/text-on-disabled, рамка становится прозрачной.",
      en: "invalid is aria-invalid:border-danger; disabled is cursor-not-allowed with bg-disabled/text-on-disabled, the border turns transparent.",
    },
    {
      ru: "type=\"file\" стилизован через file:* — кнопка выбора файла наследует typo-label-sm и прозрачный фон, остальным браузер управляет сам.",
      en: "type=\"file\" is styled via file:* — the file-picker button inherits typo-label-sm and a transparent background; the rest is handled by the browser.",
    },
  ],
}
