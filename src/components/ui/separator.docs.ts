import type { ComponentDocs } from "@/docs/types"

export const separatorDocs: ComponentDocs = {
  title: "Separator",
  purpose: {
    ru: "Separator — тонкая линия, разделяющая смысловые блоки контента по горизонтали или вертикали.",
    en: "Separator is a thin line dividing logical blocks of content horizontally or vertically.",
  },
  whenToUse: [
    {
      ru: "Нужно отделить один смысловой блок от другого внутри раздела — например, группы полей формы или пункты меню.",
      en: "One logical block needs separating from another within a section — e.g. groups of form fields or menu items.",
    },
    {
      ru: "Нужна тонкая вертикальная черта между элементами в ряд — например, между текстом и кнопкой в тулбаре.",
      en: "A thin vertical rule is needed between items in a row — e.g. between text and a button in a toolbar.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Нужна рамка вокруг целого блока, а не линия между двумя соседними — используйте border прямо на контейнере.",
        en: "A border around a whole block is needed, not a line between two neighbors — use a border directly on the container.",
      },
    },
  ],
  anatomy: [
    {
      name: "Separator",
      description: {
        ru: "единственный элемент — толщина и направление линии заданы автоматически через orientation.",
        en: "the single element — the line's thickness and direction are set automatically via orientation.",
      },
    },
  ],
  variantGuidance: [
    {
      ru: "horizontal (по умолчанию) — между блоками, расположенными друг под другом. vertical — между элементами в ряд; родителю нужна явная высота (flex с items-center или фиксированный h-*), иначе вертикальная линия будет нулевой высоты.",
      en: "horizontal (default) goes between blocks stacked on top of each other. vertical goes between items in a row; the parent needs an explicit height (a flex container with items-center, or a fixed h-*), otherwise the vertical line collapses to zero height.",
    },
  ],
  variants: [
    { name: "orientation: horizontal", description: { ru: "горизонтальная линия на всю ширину родителя — по умолчанию", en: "a horizontal line spanning the parent's full width — the default" } },
    { name: "orientation: vertical", description: { ru: "вертикальная линия на всю высоту родителя", en: "a vertical line spanning the parent's full height" } },
  ],
  states: [],
  contentRules: [],
  accessibility: [
    {
      ru: "По умолчанию decorative=true — Radix ставит role=\"none\", и скринридер полностью игнорирует линию, как чисто визуальный элемент.",
      en: "By default decorative=true — Radix sets role=\"none\", and a screen reader ignores the line entirely, as a purely visual element.",
    },
    {
      ru: "Если линия несёт самостоятельный смысл (например, реально разделяет контент на тематические секции документа, которые должны быть видны структуре страницы), передавайте decorative={false} — тогда Radix ставит role=\"separator\" (и aria-orientation для vertical), и скринридер объявляет её явно.",
      en: "If the line carries real meaning (e.g. it genuinely divides a document into thematic sections that should show up in the page's structure), pass decorative={false} — Radix then sets role=\"separator\" (and aria-orientation for vertical), and a screen reader announces it explicitly.",
    },
  ],
  related: [
    { name: "Button Group", description: { ru: "использует Separator внутри как ButtonGroupSeparator", en: "uses Separator internally as ButtonGroupSeparator" } },
    { name: "Field", description: { ru: "FieldSeparator — та же линия, адаптированная для блоков формы", en: "FieldSeparator is the same line, adapted for form blocks" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка 1:1 над Radix Separator.Root: orientation и decorative передаются насквозь, толщина/направление линии — через data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full / data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px.",
      en: "A direct wrapper over Radix Separator.Root: orientation and decorative pass straight through; the line's thickness/direction come from data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full / data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px.",
    },
    {
      ru: "shrink-0 на корне — чтобы flex-родитель не сжимал линию до нуля, когда соседние элементы не помещаются.",
      en: "shrink-0 on the root keeps a flex parent from squeezing the line down to zero when neighboring items don't fit.",
    },
  ],
}
