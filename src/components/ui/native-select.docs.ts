import type { ComponentDocs } from "@/docs/types"

export const nativeSelectDocs: ComponentDocs = {
  title: "Native Select",
  purpose: {
    ru: "Native Select — поле выбора одного варианта из списка, с родным для устройства выпадающим списком.",
    en: "Native Select is a single-choice dropdown field, with the device's own native picker UI.",
  },
  whenToUse: [
    {
      ru: "Плоский список вариантов без иконок, описаний или группировки.",
      en: "A flat list of options with no icons, descriptions, or grouping.",
    },
    {
      ru: "Вариантов много (обычно от 6–7) или место ограничено — список удобнее, чем показывать все варианты сразу.",
      en: "There are many options (typically 6-7 or more), or space is limited — a dropdown works better than showing every option at once.",
    },
    {
      ru: "Важно привычное поведение платформы: переход к опции по первым буквам с клавиатуры, системный вид списка на мобильных устройствах.",
      en: "Familiar platform behavior matters: keyboard type-ahead to jump to an option, the system's own list UI on mobile.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Вариантов немного (ориентировочно 2–5), и все они должны быть видны сразу, без лишнего клика, чтобы их открыть.",
        en: "There are only a few options (roughly 2-5), and they should all be visible at once without an extra click to reveal them.",
      },
      insteadOf: {
        name: "Radio Group",
        description: { ru: "группа радиокнопок", en: "radio button group" },
      },
    },
    {
      description: {
        ru: "Нужны иконки, описания, группы опций или кастомный внешний вид самого выпадающего списка — не только поля.",
        en: "You need icons, descriptions, option groups, or a custom look for the dropdown panel itself — not just the field.",
      },
      insteadOf: {
        name: "Select",
        description: { ru: "кастомный выпадающий список", en: "a custom dropdown" },
      },
    },
  ],
  anatomy: [
    {
      name: "Поле",
      description: {
        ru: "само поле выбора — его ширину задаёт тот, кто размещает компонент на экране (например, форма).",
        en: "the field itself — its width is set by whoever places the component on the screen (e.g. a form).",
      },
    },
    {
      name: "Стрелка",
      description: {
        ru: "декоративная иконка справа, подсказывает, что это выпадающий список.",
        en: "a decorative icon on the right, signaling that this is a dropdown.",
      },
    },
  ],
  variants: [
    { name: "size: sm", description: { ru: "компактное поле", en: "a compact field" } },
    { name: "size: md", description: { ru: "размер по умолчанию", en: "the default size" } },
    { name: "size: lg", description: { ru: "увеличенное поле", en: "a larger field" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние поля", en: "the field's default state" } },
    { name: "focus-visible", description: { ru: "видимое выделение поля при переходе с клавиатуры", en: "a visible highlight when the field is reached via keyboard" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки, когда введённый выбор не проходит валидацию", en: "an error-colored border when the current selection fails validation" } },
    { name: "disabled", description: { ru: "поле недоступно для выбора, выглядит приглушённым", en: "the field is not selectable and looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подписи опций — короткие и однозначные, без длинных уточнений в скобках: пользователь должен понимать выбор, не открывая список.",
      en: "Option labels are short and unambiguous, without long parenthetical clarifications — the user should understand the choice without opening the list.",
    },
    {
      ru: "Если выбор необязателен, первым пунктом поставьте подсказку-плейсхолдер («Выберите вариант»), а не предзаполненное значение.",
      en: "If the choice is optional, make the first item a placeholder hint (“Select an option”), not a pre-filled value.",
    },
    {
      ru: "Если выбор обязателен, не выбирайте какой-то вариант по умолчанию — пользователь должен сделать осознанный выбор, а не случайно пропустить поле с уже подставленным значением.",
      en: "If the choice is required, don't default to any particular option — the user should make a deliberate choice rather than skip the field because something was already filled in.",
    },
    {
      ru: "Порядок опций — по частоте использования (популярные сверху) или по понятной логике (алфавит, месяцы, размеры по возрастанию). Не используйте случайный порядок.",
      en: "Order options by frequency of use (most common first) or by a clear logic (alphabetical, months, ascending sizes). Avoid a random order.",
    },
  ],
  accessibility: [
    {
      ru: "Клавиатура, озвучивание вариантов скринридером и переход к опции по первым буквам — всё это обеспечивает сама платформа, без дополнительной настройки.",
      en: "Keyboard access, screen reader announcements, and jumping to an option by typing its first letters are all handled by the platform itself, with no extra setup.",
    },
    {
      ru: "Как и у любого поля формы, нужна подпись (Label), связанная с полем, — компонент её не создаёт сам.",
      en: "Like any form field, it needs a label associated with it — the component doesn't render one itself.",
    },
    {
      ru: "Стрелка справа декоративная — скринридер её не озвучивает.",
      en: "The chevron on the right is decorative — screen readers skip it.",
    },
  ],
  related: [
    { name: "Select", description: { ru: "кастомный выпадающий список с группами, иконками, чекмарками", en: "a custom dropdown with groups, icons, checkmarks" } },
    { name: "Radio Group", description: { ru: "все варианты видны сразу, без выпадающего списка", en: "all options visible at once, no dropdown" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
  ],
  forDevelopers: [
    {
      ru: "Ширина управляется через className на обёртке, не на <select> напрямую — иначе шеврон (он позиционируется от обёртки) отрывается от края поля.",
      en: "Width is controlled via className on the wrapper, not directly on <select> — otherwise the chevron (positioned relative to the wrapper) detaches from the field's edge.",
    },
    {
      ru: "Список опций — обычные <option> от потребителя компонента. Браузер сам клипует выбранное значение в закрытом поле и управляет переносом/скроллом в открытой панели — платформенное поведение, не наш CSS.",
      en: "The option list is plain consumer-provided <option> elements. The browser clips the selected value in the closed field and handles wrapping/scrolling in the open panel itself — platform behavior, not our CSS.",
    },
    {
      ru: "Плейсхолдер — первая опция без value (value=\"\").",
      en: "The placeholder is a first option with no value (value=\"\").",
    },
    {
      ru: "ChevronDownIcon — aria-hidden=\"true\", позиционируется от обёртки с отступом 12px (right-3).",
      en: "ChevronDownIcon is aria-hidden=\"true\", positioned relative to the wrapper with a 12px inset (right-3).",
    },
    {
      ru: "focus-visible — ring-3 вокруг поля; invalid — border-danger через aria-invalid; disabled — cursor-not-allowed, bg-disabled/text-on-disabled.",
      en: "focus-visible is a ring-3 around the field; invalid is border-danger via aria-invalid; disabled is cursor-not-allowed with bg-disabled/text-on-disabled.",
    },
  ],
}
