import type { ComponentDocs } from "@/docs/types"

export const selectDocs: ComponentDocs = {
  title: "Select",
  purpose: {
    ru: "Select — кастомный выпадающий список для выбора одного варианта, с собственным оформлением панели: группами, иконками, чекмарком.",
    en: "Select is a custom dropdown for choosing one option, with its own styled panel: groups, icons, a checkmark.",
  },
  whenToUse: [
    {
      ru: "Нужны иконки, группы опций, разделители или чекмарк рядом с выбранным пунктом — то, чего не даёт родной список браузера.",
      en: "Icons, option groups, separators, or a checkmark next to the selected item are needed — things the browser's native list doesn't offer.",
    },
    {
      ru: "Вариантов много или место ограничено — список удобнее, чем показывать все варианты сразу.",
      en: "There are many options, or space is limited — a dropdown works better than showing every option at once.",
    },
    {
      ru: "Внешний вид панели должен быть согласован со стилем продукта, а не с системным видом ОС.",
      en: "The panel's look needs to match the product's style rather than the OS's system appearance.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Плоский список без иконок, описаний и группировки — достаточно родного выпадающего списка устройства.",
        en: "A flat list with no icons, descriptions, or grouping — the device's own native picker is enough.",
      },
      insteadOf: {
        name: "Native Select",
        description: { ru: "поле выбора с родным выпадающим списком", en: "a dropdown field with the device's own picker UI" },
      },
    },
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
  ],
  anatomy: [
    { name: "Триггер", description: { ru: "закрытое поле — показывает текущий выбор или плейсхолдер, открывает панель по клику.", en: "the closed field — shows the current selection or a placeholder, opens the panel on click." } },
    { name: "Панель", description: { ru: "выпадающий список опций, открывается поверх остального содержимого страницы.", en: "the dropdown list of options, opens above the rest of the page's content." } },
    { name: "Группа и заголовок группы", description: { ru: "необязательное объединение пунктов под общим подзаголовком.", en: "an optional grouping of items under a shared subheading." } },
    { name: "Разделитель", description: { ru: "тонкая линия между смысловыми блоками пунктов внутри панели.", en: "a thin line between logical blocks of items inside the panel." } },
    { name: "Чекмарк", description: { ru: "отметка у выбранного пункта — расположение (слева или справа от текста) задаёт тот, кто использует компонент.", en: "a mark next to the selected item — its placement (left or right of the text) is up to whoever uses the component." } },
  ],
  variantGuidance: [
    {
      ru: "Чекмарк справа от текста — вариант по умолчанию, используйте его всегда, если нет особой причины для другого расположения. Слева — только когда список уже занимает правую часть строки осмысленным содержимым (шорткат, счётчик, вторичный текст), и чекмарку там тесно.",
      en: "A checkmark to the right of the text is the default — use it unless there's a specific reason for the other placement. Put it on the left only when the list already uses the right side of the row for something meaningful (a shortcut, a counter, secondary text) and the checkmark would crowd it.",
    },
  ],
  variants: [
    { name: "size: sm / md", description: { ru: "два размера поля — sm для компактных панелей, md — размер по умолчанию", en: "two field sizes — sm for compact panels, md is the default" } },
  ],
  states: [
    { name: "closed", description: { ru: "панель скрыта, видно только поле", en: "the panel is hidden, only the field shows" } },
    { name: "open", description: { ru: "панель раскрыта поверх содержимого страницы", en: "the panel is open above the page's content" } },
    { name: "focus-visible", description: { ru: "видимое выделение поля при переходе с клавиатуры", en: "a visible highlight when the field is reached via keyboard" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки, когда выбор не проходит валидацию", en: "an error-colored border when the current selection fails validation" } },
    { name: "disabled", description: { ru: "поле недоступно для открытия, выглядит приглушённым", en: "the field can't be opened, looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подписи пунктов — короткие и однозначные: пользователь должен понимать выбор, не открывая панель заново.",
      en: "Option labels are short and unambiguous — the user should understand the choice without reopening the panel.",
    },
    {
      ru: "Если выбор необязателен, плейсхолдер в поле — подсказка («Выберите вариант»), а не предзаполненное значение.",
      en: "If the choice is optional, the field's placeholder is a hint (“Select an option”), not a pre-filled value.",
    },
    {
      ru: "Заголовок группы — короткое существительное во множественном числе, называющее категорию, не инструкция.",
      en: "A group title is a short plural noun naming the category, not an instruction.",
    },
    {
      ru: "Порядок пунктов — по частоте использования или по понятной логике (алфавит, категории). Разделитель ставьте только между смысловыми блоками, не между каждой парой пунктов.",
      en: "Order items by frequency of use or by a clear logic (alphabetical, categories). Use a separator only between logical blocks, not between every pair of items.",
    },
  ],
  accessibility: [
    {
      ru: "Как и у любого поля формы, нужна подпись (Label), связанная с триггером, — компонент её не создаёт сам.",
      en: "Like any form field, it needs a label associated with the trigger — the component doesn't render one itself.",
    },
    {
      ru: "Доступен с клавиатуры из коробки: Enter/Space открывают панель, стрелки перемещаются между пунктами, Enter выбирает, Escape закрывает без изменения выбора.",
      en: "Keyboard-accessible out of the box: Enter/Space open the panel, arrow keys move between items, Enter selects, Escape closes without changing the selection.",
    },
    {
      ru: "Скринридер объявляет выбранный пункт и его позицию в списке, заголовки групп звучат как подписи к идущим за ними пунктам.",
      en: "A screen reader announces the selected item and its position in the list; group titles are read as labels for the items under them.",
    },
  ],
  related: [
    { name: "Native Select", description: { ru: "плоский список с родным выпадающим списком устройства", en: "a flat list with the device's own picker UI" } },
    { name: "Radio Group", description: { ru: "все варианты видны сразу, без выпадающего списка", en: "all options visible at once, no dropdown" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
  ],
  forDevelopers: [
    {
      ru: "Панель рендерится в портал (document.body) — внутри BrandMatrix/модалки нужно передавать проп container, чтобы она унаследовала локальные data-brand/dark.",
      en: "The panel renders into a portal (document.body) — inside a BrandMatrix or a modal, pass the container prop so it inherits local data-brand/dark.",
    },
    {
      ru: "SelectTrigger и SelectContent — соседи, не родитель/потомок; размер (sm/md) передаётся от триггера к панели через React Context, поэтому радиус панели всегда совпадает с радиусом поля.",
      en: "SelectTrigger and SelectContent are siblings, not parent/child; size (sm/md) flows from the trigger to the panel via React Context, so the panel's radius always matches the field's.",
    },
    {
      ru: "position=\"popper\" — дефолт, панель выравнивается по краям триггера (min-width = ширина триггера), а не по центру выделенного пункта.",
      en: "position=\"popper\" is the default — the panel aligns to the trigger's edges (min-width = trigger width), not centered on the selected item.",
    },
    {
      ru: "SelectItem принимает indicatorSide=\"left\" | \"right\" (по умолчанию \"right\") — переставляет порядок детей (текст/чекмарк), не завязано на Radix.",
      en: "SelectItem takes indicatorSide=\"left\" | \"right\" (default \"right\") — it reorders its children (text/checkmark); this isn't tied to Radix.",
    },
    {
      ru: "focus-visible — ring-3 ring-focus-ring вплотную к рамке триггера; invalid — aria-invalid:border-danger; disabled — cursor-not-allowed, bg-disabled/text-on-disabled.",
      en: "focus-visible is a ring-3 ring-focus-ring flush against the trigger's border; invalid is aria-invalid:border-danger; disabled is cursor-not-allowed with bg-disabled/text-on-disabled.",
    },
  ],
}
