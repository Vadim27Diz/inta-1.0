import type { ComponentDocs } from "@/docs/types"

export const toggleGroupDocs: ComponentDocs = {
  title: "Toggle Group",
  purpose: {
    ru: "Toggle Group объединяет несколько Toggle в один визуальный блок — сегментированный контрол для выбора одного или нескольких вариантов.",
    en: "Toggle Group joins several Toggles into one visual block — a segmented control for selecting one or several options.",
  },
  whenToUse: [
    {
      ru: "Несколько связанных переключаемых кнопок должны восприниматься как один блок — например, панель форматирования текста (жирный, курсив, подчёркивание).",
      en: "Several related toggle buttons need to read as one block — e.g. a text-formatting toolbar (bold, italic, underline).",
    },
    {
      ru: "Нужен выбор одного варианта (type=\"single\") или нескольких одновременно (type=\"multiple\") из небольшого набора, видимого целиком.",
      en: "Choosing one option (type=\"single\") or several at once (type=\"multiple\") from a small, fully visible set.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Переключаемые кнопки не должны визуально сливаться в один блок, либо их всего одна.",
        en: "The toggle buttons shouldn't visually merge into one block, or there's only one of them.",
      },
      insteadOf: {
        name: "Toggle",
        description: { ru: "кнопка с состоянием on/off", en: "an on/off toggle button" },
      },
    },
    {
      description: {
        ru: "Выбор одного варианта из набора, где визуальное слияние в один блок не нужно, а важна явная подпись каждого варианта.",
        en: "Choosing one option from a set where a merged block isn't needed, and each option's explicit label matters more.",
      },
      insteadOf: {
        name: "Radio Group",
        description: { ru: "группа радиокнопок", en: "radio button group" },
      },
    },
  ],
  anatomy: [
    {
      name: "ToggleGroup",
      description: {
        ru: "контейнер — задаёт type (single/multiple), variant и size сразу для всех вложенных элементов.",
        en: "the container — sets type (single/multiple), variant, and size for every nested item at once.",
      },
    },
    {
      name: "ToggleGroupItem",
      description: {
        ru: "один сегмент блока — крайние элементы получают скругление с внешней стороны, внутренние стыкуются без зазора.",
        en: "one segment of the block — the outer items get rounding on the outside edge, inner ones sit flush with no gap.",
      },
    },
  ],
  variants: [
    { name: "default", description: { ru: "без рамки — для плотных тулбаров", en: "borderless — for dense toolbars" } },
    { name: "outline", description: { ru: "с общей внешней рамкой на весь блок", en: "with one shared outer border around the whole block" } },
    { name: "size: sm / md / lg", description: { ru: "три размера, применяются сразу ко всем сегментам блока", en: "three sizes, applied to every segment of the block at once" } },
  ],
  states: [
    { name: "off", description: { ru: "сегмент не выбран", en: "the segment is not selected" } },
    { name: "on / pressed", description: { ru: "сегмент выбран — при type=\"single\" выбран только один, при type=\"multiple\" — несколько одновременно", en: "the segment is selected — with type=\"single\" only one can be, with type=\"multiple\" several can be at once" } },
    { name: "focus-visible", description: { ru: "видимое кольцо у сегмента при переходе с клавиатуры, поверх соседних сегментов", en: "a visible ring on the segment when reached via keyboard, drawn above neighboring segments" } },
    { name: "disabled", description: { ru: "отдельный сегмент недоступен для переключения, выглядит приглушённым, остальные работают как обычно", en: "a single segment is not toggleable and looks muted, while the rest work normally" } },
  ],
  contentRules: [
    {
      ru: "Держите сегменты однородными: либо все только с иконкой, либо все с текстом — смешивание в одном блоке сбивает восприятие.",
      en: "Keep segments uniform: either all icon-only or all with text — mixing the two in one block confuses the read.",
    },
    {
      ru: "У каждого сегмента без видимого текста — свой aria-label, по аналогии с Toggle.",
      en: "Every icon-only segment needs its own aria-label, the same as a standalone Toggle.",
    },
  ],
  accessibility: [
    {
      ru: "Клавиатура: Tab переводит фокус на блок целиком (один стоп в tab-order), дальше стрелками — между сегментами, Enter/Space переключает текущий.",
      en: "Keyboard: Tab moves focus to the whole block (one stop in the tab order), then arrow keys move between segments, Enter/Space toggles the current one.",
    },
    {
      ru: "Скринридер объявляет роль группы и состояние каждого сегмента («нажато» / «не нажато»), как и у одиночного Toggle.",
      en: "A screen reader announces the group's role and each segment's state (“pressed” / “not pressed”), same as a standalone Toggle.",
    },
  ],
  related: [
    { name: "Toggle", description: { ru: "одна переключаемая кнопка вне блока", en: "a single toggle button outside a block" } },
    { name: "Button Group", description: { ru: "объединяет Button (действия), а не переключатели", en: "joins Buttons (actions), not toggles" } },
    { name: "Radio Group", description: { ru: "выбор одного варианта с явной подписью у каждого", en: "choosing one option with an explicit label on each" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка над Radix ToggleGroup.Root/Item. variant/size заданы на ToggleGroup и спускаются в каждый Item через React Context — проставлять их на каждом Item отдельно не нужно.",
      en: "A wrapper around Radix ToggleGroup.Root/Item. variant/size are set on ToggleGroup and flow down to each Item via React Context — no need to set them on every Item individually.",
    },
    {
      ru: "Каждый Item использует toggleVariants из Toggle (общий cva), со своими классами стыковки сегментов (rounded-none, border-l-0 для outline) сверху.",
      en: "Each Item reuses toggleVariants from Toggle (the shared cva), with its own segment-joining classes (rounded-none, border-l-0 for outline) layered on top.",
    },
    {
      ru: "focus-visible:z-10 на Item поднимает фокус-кольцо сфокусированного сегмента над соседями — без этого рамка соседнего сегмента перекрывала бы часть кольца.",
      en: "focus-visible:z-10 on Item raises the focused segment's ring above its neighbors — without it, a neighboring segment's border would clip part of the ring.",
    },
  ],
}
