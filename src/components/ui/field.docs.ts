import type { ComponentDocs } from "@/docs/types"

export const fieldDocs: ComponentDocs = {
  title: "Field",
  purpose: {
    ru: "Field — обвязка вокруг одного поля формы: подпись, сам контрол, подсказка или сообщение об ошибке, собранные в одном блоке с правильными отступами.",
    en: "Field wraps a single form control: a label, the control itself, and a hint or error message, assembled into one block with correct spacing.",
  },
  whenToUse: [
    {
      ru: "Контролу (Input, Textarea, Checkbox, Switch, Select и т.п.) нужна подпись, подсказка или сообщение об ошибке — вместо того чтобы собирать их отступы вручную на каждом экране.",
      en: "A control (Input, Textarea, Checkbox, Switch, Select, etc.) needs a label, a hint, or an error message — instead of hand-assembling the spacing on every screen.",
    },
    {
      ru: "Несколько полей формы нужно расположить вертикально или по строкам с одинаковыми отступами (через FieldGroup/FieldSet).",
      en: "Several form fields need to be laid out vertically or in rows with consistent spacing (via FieldGroup/FieldSet).",
    },
    {
      ru: "Нужна «карточка выбора» — чекбокс или радиокнопка вместе с заголовком и описанием, объединённые в один кликабельный блок с подсветкой при выборе.",
      en: "A “selection card” is needed — a checkbox or radio button together with a title and description, joined into one clickable block that highlights when selected.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Элементу не нужна подпись, подсказка или сообщение об ошибке — например, одиночная кнопка или иконка вне формы.",
        en: "The element needs no label, hint, or error message — e.g. a standalone button or icon outside a form.",
      },
    },
    {
      description: {
        ru: "Статус или ошибка относится не к конкретному полю, а ко всей форме или разделу целиком.",
        en: "The status or error applies to the whole form or section, not to one specific field.",
      },
      insteadOf: {
        name: "Alert",
        description: { ru: "заметное сообщение, привязанное к разделу страницы", en: "a prominent message tied to a section of the page" },
      },
    },
  ],
  anatomy: [
    { name: "FieldLabel", description: { ru: "подпись поля — обязателен связывающий htmlFor/id, кроме «карточки выбора», где сам FieldLabel оборачивает Field.", en: "the field's label — requires a linking htmlFor/id, except in a “selection card”, where FieldLabel itself wraps Field." } },
    { name: "Field", description: { ru: "контейнер самого контрола, задаёт расположение (orientation) подписи относительно поля.", en: "the container for the control itself, sets the label's layout (orientation) relative to the field." } },
    { name: "FieldContent / FieldTitle", description: { ru: "заголовок и обёртка содержимого — для «карточки выбора», где заголовок стоит не в FieldLabel.", en: "a title and content wrapper — for a “selection card”, where the title doesn't live in FieldLabel." } },
    { name: "FieldDescription", description: { ru: "подсказка под полем — нейтральный текст, не сообщение об ошибке.", en: "a hint below the field — neutral text, not an error message." } },
    { name: "FieldError", description: { ru: "сообщение об ошибке — показывается вместо FieldDescription, когда поле невалидно.", en: "an error message — shown in place of FieldDescription when the field is invalid." } },
    { name: "FieldSet / FieldLegend", description: { ru: "группа связанных полей с общим заголовком (legend) — например, блок «Контакты» из нескольких Field.", en: "a group of related fields with a shared heading (legend) — e.g. a “Contacts” block made of several Fields." } },
    { name: "FieldGroup", description: { ru: "вертикальный контейнер для нескольких Field/FieldSet с одинаковыми отступами между ними.", en: "a vertical container for several Fields/FieldSets with consistent spacing between them." } },
    { name: "FieldSeparator", description: { ru: "разделитель между блоками полей, может содержать короткую подпись («или»).", en: "a divider between blocks of fields, can carry a short label (“or”)." } },
  ],
  variantGuidance: [
    {
      ru: "vertical (по умолчанию) — подпись над полем, самый безопасный выбор для длинных подписей и узких колонок. horizontal — подпись слева от поля, для компактных форм с короткими, сопоставимыми по длине подписями. responsive — vertical на узком экране, horizontal — на широком.",
      en: "vertical (default) is the label above the field — the safest choice for long labels and narrow columns. horizontal puts the label to the left of the field, for compact forms with short labels of similar length. responsive is vertical on a narrow screen, horizontal on a wide one.",
    },
  ],
  variants: [
    { name: "orientation: vertical", description: { ru: "подпись над полем — по умолчанию", en: "label above the field — the default" } },
    { name: "orientation: horizontal", description: { ru: "подпись слева от поля", en: "label to the left of the field" } },
    { name: "orientation: responsive", description: { ru: "vertical на узком экране, horizontal — на широком", en: "vertical on a narrow screen, horizontal on a wide one" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние — видна FieldDescription, если есть", en: "the default state — FieldDescription shows, if present" } },
    { name: "invalid", description: { ru: "вместо FieldDescription показывается FieldError, подпись окрашивается в цвет ошибки", en: "FieldError shows in place of FieldDescription, the label tints to the error color" } },
    { name: "disabled", description: { ru: "весь блок, включая подпись, выглядит приглушённым", en: "the whole block, including the label, looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подпись — короткое существительное или словосочетание, называющее, что вводится («Email», не «Введите ваш email»).",
      en: "The label is a short noun or phrase naming what's being entered (“Email”, not “Please enter your email”).",
    },
    {
      ru: "FieldDescription — нейтральная подсказка (формат, ограничение, зачем нужно поле); FieldError — что конкретно исправить. Не показывайте оба одновременно — ошибка заменяет подсказку, а не дополняет её.",
      en: "FieldDescription is a neutral hint (format, constraint, why the field is needed); FieldError says exactly what to fix. Don't show both at once — the error replaces the hint rather than adding to it.",
    },
    {
      ru: "В «карточке выбора» заголовок (FieldTitle) — короткое название опции, описание — её последствие или уточнение, не повтор заголовка другими словами.",
      en: "In a “selection card”, the title (FieldTitle) is the option's short name; the description is its consequence or clarification, not the title restated.",
    },
  ],
  accessibility: [
    {
      ru: "FieldLabel связывает подпись с полем через htmlFor/id — обязательно для каждого поля, Field сам этой связи не создаёт.",
      en: "FieldLabel links the label to the field via htmlFor/id — required for every field; Field doesn't create this link on its own.",
    },
    {
      ru: "FieldError должен быть связан с полем через aria-describedby, чтобы скринридер озвучивал ошибку при фокусе на поле, а не только показывал её визуально.",
      en: "FieldError must be linked to the field via aria-describedby, so a screen reader announces it on focus rather than only showing it visually.",
    },
    {
      ru: "FieldSet/FieldLegend озвучиваются скринридером как группа полей с общим заголовком — используйте их для связанных полей (например, адреса), а не для несвязанных друг с другом.",
      en: "FieldSet/FieldLegend are announced by a screen reader as a group of fields with a shared heading — use them for genuinely related fields (e.g. an address), not unrelated ones.",
    },
  ],
  related: [
    { name: "Input", description: { ru: "однострочное поле ввода", en: "a single-line input field" } },
    { name: "Checkbox", description: { ru: "независимый выбор, в т.ч. как «карточка выбора» внутри FieldLabel", en: "independent selection, incl. as a “selection card” inside FieldLabel" } },
    { name: "Alert", description: { ru: "сообщение, относящееся ко всей форме или разделу, а не к одному полю", en: "a message scoped to the whole form or section, not one field" } },
  ],
  forDevelopers: [
    {
      ru: "data-invalid=\"true\" на Field красит подпись (text-on-surface-danger) через group/field — ставится вручную тем, кто использует компонент, вместе с aria-invalid на самом контроле.",
      en: "data-invalid=\"true\" on Field tints the label (text-on-surface-danger) via group/field — set manually by whoever uses the component, alongside aria-invalid on the control itself.",
    },
    {
      ru: "«Карточка выбора» — FieldLabel оборачивает Field с Checkbox/RadioGroupItem внутри; подсветка идёт по data-state=checked (реальный атрибут Radix), не data-checked.",
      en: "The “selection card” pattern wraps Field (with a Checkbox/RadioGroupItem inside) in FieldLabel; the highlight keys off data-state=checked (the real Radix attribute), not data-checked.",
    },
    {
      ru: "FieldError принимает children напрямую или errors (массив { message }) — с несколькими уникальными сообщениями рендерится список, с одним — строка.",
      en: "FieldError accepts either children directly or errors (an array of { message }) — with several unique messages it renders a list, with one it renders a plain string.",
    },
  ],
}
