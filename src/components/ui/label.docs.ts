import type { ComponentDocs } from "@/docs/types"

export const labelDocs: ComponentDocs = {
  title: "Label",
  purpose: {
    ru: "Label — подпись поля формы или контрола, связанная с ним для клика и для скринридера.",
    en: "Label is a form field's or control's caption, linked to it for click targeting and for screen readers.",
  },
  whenToUse: [
    {
      ru: "У любого поля ввода, Checkbox, Switch, Radio Group или Select — подпись нужна почти всегда, кроме редких случаев с aria-label вместо видимого текста.",
      en: "For almost any input, Checkbox, Switch, Radio Group, or Select — a label is needed in nearly every case, except the rare one using aria-label instead of visible text.",
    },
    {
      ru: "Нужно обязательное поле — required добавляет звёздочку рядом с текстом подписи.",
      en: "A required field is needed — required adds an asterisk next to the label's text.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Сообщение об ошибке или вспомогательная подсказка под полем — это текст самого поля формы, не его подпись.",
        en: "An error message or helper hint below the field — that's the field's own supporting text, not its label.",
      },
      insteadOf: {
        name: "Field",
        description: { ru: "композиция подписи, поля и сообщения об ошибке", en: "a composition of a label, a field, and an error message" },
      },
    },
  ],
  anatomy: [
    {
      name: "Текст подписи",
      description: {
        ru: "children — название поля или параметра.",
        en: "children — the field's or setting's name.",
      },
    },
    {
      name: "Звёздочка (required)",
      description: {
        ru: "декоративный значок обязательности, скрыт от скринридера (aria-hidden) — обязательность поля должно сообщать сами поле форме через required/aria-required, не звёздочка.",
        en: "a decorative required-asterisk, hidden from screen readers (aria-hidden) — the field's own form attributes (required/aria-required) must carry the requirement, not the asterisk.",
      },
    },
  ],
  variants: [
    { name: "обычная подпись", description: { ru: "без звёздочки — поле не обязательно", en: "no asterisk — the field isn't required" } },
    { name: "required", description: { ru: "со звёздочкой рядом с текстом — поле обязательно", en: "with an asterisk next to the text — the field is required" } },
    { name: "size: lg / md / sm", description: { ru: "типографика подписи — typo-label-lg/md/sm; по умолчанию md, как и раньше. Выбирайте тот же размер, что у связанного поля (Input и т.п.), вручную — Label сам его не знает.", en: "the label's typography — typo-label-lg/md/sm; md by default, unchanged from before. Pick the same size as the linked field (Input, etc.) by hand — Label doesn't know it on its own." } },
  ],
  states: [
    {
      name: "disabled (от контрола)",
      description: {
        ru: "подпись приглушается, когда связанный с ней контрол недоступен — через peer (сосед) или группу-обёртку с data-disabled, не через свой проп disabled у Label.",
        en: "the label is muted when the control it's linked to is disabled — via a peer sibling or a wrapping group with data-disabled, not via a disabled prop of its own.",
      },
    },
  ],
  contentRules: [
    {
      ru: "Название параметра или поля — существительное или короткое словосочетание («Электронная почта», «Уведомления по email»), не вопрос и не инструкция.",
      en: "The field's or setting's name is a noun or a short phrase (“Email”, “Email notifications”), not a question or an instruction.",
    },
    {
      ru: "Длинная подпись переносится на несколько строк — компонент не обрезает текст и не ограничивает высоту.",
      en: "A long label wraps onto multiple lines — the component doesn't truncate text or limit its height.",
    },
  ],
  accessibility: [
    {
      ru: "Свяжите Label с контролом через htmlFor (совпадает с id контрола) — это увеличивает область клика до размера подписи и даёт контролу доступное имя для скринридера.",
      en: "Link Label to the control via htmlFor (matching the control's id) — this enlarges the clickable area to the label's size and gives the control an accessible name for screen readers.",
    },
    {
      ru: "Для disabled-состояния подписи у контрола должен быть класс peer (если Label — сосед сразу после) либо группа-обёртка с data-disabled=\"true\" (если между ними есть другая разметка).",
      en: "For the label's disabled state, the control needs the peer class (if Label is its immediate sibling) or a wrapping group with data-disabled=\"true\" (if other markup sits between them).",
    },
  ],
  related: [
    { name: "Field", description: { ru: "композиция подписи, поля ввода и сообщения об ошибке", en: "a composition of a label, an input field, and an error message" } },
    { name: "Input", description: { ru: "однострочное поле ввода", en: "a single-line input field" } },
    { name: "Checkbox", description: { ru: "независимый выбор внутри формы", en: "independent selection inside a form" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка над Radix Label.Root — рендерится как <label>, клик по тексту переводит фокус на связанный через htmlFor контрол.",
      en: "A wrapper around Radix Label.Root — renders as <label>; clicking the text moves focus to the control linked via htmlFor.",
    },
    {
      ru: "size не наследуется от связанного контрола и не передаётся ему — внутри Field это решает FieldLabel через контекст, сам Label вне Field size не угадывает.",
      en: "size isn't inherited from the linked control and isn't passed to it — inside Field this is handled by FieldLabel via context; Label on its own doesn't guess it outside Field.",
    },
    {
      ru: "peer-disabled:* читает disabled соседнего элемента с классом peer; group-data-[disabled=true]:* читает data-disabled=\"true\" с родителя-обёртки с классом group — нужен, когда Label и контрол не прямые соседи.",
      en: "peer-disabled:* reads the disabled state of a sibling with the peer class; group-data-[disabled=true]:* reads data-disabled=\"true\" from a wrapping parent with the group class — needed when Label and the control aren't direct siblings.",
    },
    {
      ru: "*:text-on-disabled в обоих disabled-вариантах перекрашивает и звёздочку (прямой потомок) — без этого она осталась бы цвета text-on-surface-danger при приглушённой подписи.",
      en: "*:text-on-disabled in both disabled variants also recolors the asterisk (a direct child) — without it, the asterisk would stay text-on-surface-danger while the rest of the label is muted.",
    },
  ],
}
