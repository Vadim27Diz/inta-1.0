import type { ComponentDocs } from "@/docs/types"

export const inputGroupDocs: ComponentDocs = {
  title: "Input Group",
  purpose: {
    ru: "Input Group — поле ввода с иконкой, текстовым префиксом/суффиксом или кнопкой внутри одной визуальной рамки.",
    en: "Input Group is an input field with an icon, a text prefix/suffix, or a button inside one visual frame.",
  },
  whenToUse: [
    {
      ru: "Рядом с полем нужна подсказывающая иконка (поиск, валюта) или текстовый префикс/суффикс (например, «https://»).",
      en: "The field needs a hinting icon (search, currency) or a text prefix/suffix (e.g. “https://”) right next to it.",
    },
    {
      ru: "Внутри той же рамки нужна кнопка-действие — показать пароль, скопировать значение, очистить поле.",
      en: "An action button belongs inside the same frame — reveal a password, copy the value, clear the field.",
    },
    {
      ru: "У многострочного поля нужен счётчик символов или другая короткая подсказка под текстом.",
      en: "A multi-line field needs a character counter or another short hint below the text.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Полю не нужны ни иконка, ни текстовый аддон, ни кнопка — обычное поле без декораций.",
        en: "The field needs no icon, text addon, or button — a plain, undecorated field.",
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
    { name: "InputGroupInput / InputGroupTextarea", description: { ru: "сам контрол — однострочный или многострочный.", en: "the control itself — single- or multi-line." } },
    { name: "InputGroupAddon", description: { ru: "слот сбоку или сверху/снизу от поля — вмещает иконку, текст или кнопку, клик по пустой части слота фокусирует поле.", en: "a slot beside or above/below the field — holds an icon, text, or a button; clicking empty space in it focuses the field." } },
    { name: "InputGroupButton", description: { ru: "кнопка-действие внутри аддона — например, «Копировать».", en: "an action button inside an addon — e.g. “Copy”." } },
    { name: "InputGroupText", description: { ru: "статичный текстовый аддон — префикс, суффикс или счётчик символов.", en: "a static text addon — a prefix, suffix, or character counter." } },
  ],
  variantGuidance: [
    {
      ru: "inline-start/inline-end — для однострочного поля, иконка или текст слева, кнопка обычно справа. block-start/block-end — для многострочного поля, когда аддон (например, счётчик символов) должен быть над или под текстом, а не сбоку.",
      en: "inline-start/inline-end are for a single-line field — an icon or text on the left, a button usually on the right. block-start/block-end are for a multi-line field, when the addon (e.g. a character counter) needs to sit above or below the text rather than beside it.",
    },
  ],
  variants: [
    { name: "align: inline-start", description: { ru: "аддон слева от поля — по умолчанию", en: "addon to the left of the field — the default" } },
    { name: "align: inline-end", description: { ru: "аддон справа от поля", en: "addon to the right of the field" } },
    { name: "align: block-start", description: { ru: "аддон над многострочным полем", en: "addon above a multi-line field" } },
    { name: "align: block-end", description: { ru: "аддон под многострочным полем", en: "addon below a multi-line field" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние поля", en: "the field's default state" } },
    { name: "focus-visible", description: { ru: "видимое выделение всей рамки группы, когда контрол внутри в фокусе", en: "a visible highlight around the whole group's frame when the control inside is focused" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки, когда введённое значение не проходит валидацию", en: "an error-colored border when the current value fails validation" } },
    { name: "disabled", description: { ru: "вся группа выглядит приглушённой, поле недоступно для ввода", en: "the whole group looks muted, the field is not editable" } },
  ],
  contentRules: [
    {
      ru: "Текстовый аддон — короткий, одно слово или устойчивое сокращение («https://», «$», «кг»), не предложение.",
      en: "A text addon is short — one word or a stable abbreviation (“https://”, “$”, “kg”), not a sentence.",
    },
    {
      ru: "У кнопки-аддона без видимой подписи всё равно должно быть текстовое описание действия — для тех, кто пользуется скринридером.",
      en: "A button addon with no visible label still needs a text description of the action — for screen reader users.",
    },
    {
      ru: "Счётчик символов показывает оставшийся или использованный лимит числом («120 / 280»), не текстом вроде «осталось немного».",
      en: "A character counter shows the remaining or used limit as a number (“120 / 280”), not words like “a bit left”.",
    },
  ],
  accessibility: [
    {
      ru: "Как и у любого поля формы, нужна подпись (Label), связанная с контролом внутри группы, — компонент её не создаёт сам.",
      en: "Like any form field, it needs a label associated with the control inside the group — the component doesn't render one itself.",
    },
    {
      ru: "Декоративная иконка в аддоне не должна озвучиваться скринридером отдельным текстом — её смысл дублирует подпись поля или контекст рядом.",
      en: "A decorative icon in an addon shouldn't be announced by a screen reader as separate text — its meaning is already covered by the field's label or surrounding context.",
    },
    {
      ru: "Кнопка-аддон доступна с клавиатуры как обычная кнопка (Tab, Enter/Space), независимо от фокуса на самом поле.",
      en: "A button addon is keyboard-accessible like any button (Tab, Enter/Space), independent of focus on the field itself.",
    },
  ],
  related: [
    { name: "Input", description: { ru: "однострочное поле без декораций", en: "a plain, undecorated single-line field" } },
    { name: "Textarea", description: { ru: "многострочное поле без декораций", en: "a plain, undecorated multi-line field" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
    { name: "Button", description: { ru: "используется внутри аддона как InputGroupButton", en: "used inside an addon as InputGroupButton" } },
  ],
  forDevelopers: [
    {
      ru: "Кольцо фокуса стоит на обёртке InputGroup (has-[[data-slot=input-group-control]:focus-visible]:ring-3), а не на самом контроле — у InputGroupInput/InputGroupTextarea focus-visible:ring-0, иначе сквозь внешнее кольцо проступало бы их собственное.",
      en: "The focus ring lives on the InputGroup wrapper (has-[[data-slot=input-group-control]:focus-visible]:ring-3), not on the control itself — InputGroupInput/InputGroupTextarea have focus-visible:ring-0, otherwise their own ring would show through the outer one.",
    },
    {
      ru: "Клик по пустому месту в InputGroupAddon фокусирует ближайший input в группе (обработчик onClick ищет его через querySelector), если клик не пришёлся на кнопку внутри.",
      en: "Clicking empty space in InputGroupAddon focuses the nearest input in the group (an onClick handler finds it via querySelector), unless the click landed on a button inside.",
    },
    {
      ru: "invalid — has-[[data-slot][aria-invalid=true]]:border-danger на обёртке; disabled — has-disabled:bg-disabled.",
      en: "invalid is has-[[data-slot][aria-invalid=true]]:border-danger on the wrapper; disabled is has-disabled:bg-disabled.",
    },
  ],
}
