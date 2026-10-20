import type { ComponentDocs } from "@/docs/types"

export const buttonGroupDocs: ComponentDocs = {
  title: "Button Group",
  purpose: {
    ru: "Button Group объединяет несколько Button (или Button и поле ввода) в один визуальный блок без зазоров между ними.",
    en: "Button Group joins several Buttons (or a Button and an input field) into one visual block with no gaps between them.",
  },
  whenToUse: [
    {
      ru: "Несколько связанных действий должны визуально восприниматься как один блок — например, навигация «назад / вперёд» или шаги пагинации.",
      en: "Several related actions need to read visually as one block — e.g. “back / forward” navigation or pagination steps.",
    },
    {
      ru: "Поле ввода нужно сопроводить кнопкой или текстовым аддоном впритык, без зазора (например, иконка поиска слева от поля или протокол перед полем URL).",
      en: "An input field needs a button or a text add-on flush against it, with no gap (e.g. a search icon left of the field, or a protocol prefix before a URL field).",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Кнопки не связаны друг с другом по смыслу или не должны визуально сливаться в один блок.",
        en: "The buttons aren't related in meaning, or shouldn't visually merge into one block.",
      },
      insteadOf: {
        name: "Button",
        description: { ru: "отдельные кнопки с обычным промежутком между ними", en: "separate buttons with a normal gap between them" },
      },
    },
    {
      description: {
        ru: "Нужно устойчивое состояние вкл/выкл у каждого элемента блока (прижата/не прижата), а не просто ряд действий.",
        en: "Each item in the block needs a persistent pressed/unpressed state, not just a row of actions.",
      },
      insteadOf: {
        name: "Toggle Group",
        description: { ru: "группа связанных переключаемых кнопок", en: "a group of related toggle buttons" },
      },
    },
  ],
  anatomy: [
    {
      name: "ButtonGroup",
      description: {
        ru: "контейнер — убирает внутренние зазоры и скругления на стыках между соседними элементами, задаёт orientation.",
        en: "the container — removes inner gaps and rounding at the seams between neighboring items, sets orientation.",
      },
    },
    {
      name: "ButtonGroupText",
      description: {
        ru: "нейтральный аддон без своей интерактивности — текст, иконка или их сочетание, оформленные как часть блока (например, префикс «https://» перед полем).",
        en: "a neutral add-on with no interactivity of its own — text, an icon, or both, styled as part of the block (e.g. an “https://” prefix before a field).",
      },
    },
    {
      name: "ButtonGroupSeparator",
      description: {
        ru: "тонкая вертикальная (или горизонтальная при orientation=\"vertical\") линия между смысловыми частями блока.",
        en: "a thin vertical (or horizontal with orientation=\"vertical\") line between logical parts of the block.",
      },
    },
  ],
  variants: [
    { name: "orientation: horizontal", description: { ru: "элементы в ряд, стык слева/справа — вариант по умолчанию", en: "items in a row, seams on the left/right — the default" } },
    { name: "orientation: vertical", description: { ru: "элементы в столбик, стык сверху/снизу", en: "items in a column, seams on the top/bottom" } },
  ],
  states: [
    { name: "default", description: { ru: "обычный вид блока, состояние каждого элемента — его собственное (hover/active у Button работают как обычно)", en: "the block's regular look — each item's state is its own (Button's hover/active still work normally)" } },
    { name: "focus-visible", description: { ru: "кольцо фокуса сфокусированного элемента поднимается над соседями, не перекрывается их рамкой", en: "the focused item's ring is raised above its neighbors and isn't clipped by their border" } },
    { name: "disabled", description: { ru: "отдельный элемент блока недоступен и выглядит приглушённым, остальные работают как обычно", en: "a single item in the block is disabled and looks muted, while the rest work normally" } },
  ],
  contentRules: [
    {
      ru: "Порядок элементов слева направо (или сверху вниз) должен отражать порядок действий или логику чтения — не переставляйте произвольно.",
      en: "The left-to-right (or top-to-bottom) order should reflect the order of actions or reading logic — don't rearrange arbitrarily.",
    },
    {
      ru: "ButtonGroupText — только для статичного контента (подпись, иконка). Если элемент должен реагировать на клик, это Button, а не ButtonGroupText.",
      en: "ButtonGroupText is for static content only (a label, an icon). If the item should respond to a click, it's a Button, not a ButtonGroupText.",
    },
  ],
  accessibility: [
    {
      ru: "Контейнер имеет role=\"group\" — скринридер объявляет входящие кнопки как связанный набор, а не разрозненные элементы.",
      en: "The container has role=\"group\" — a screen reader announces the buttons inside as a related set, not scattered elements.",
    },
    {
      ru: "Каждая Button внутри блока сохраняет свою обычную доступность (фокусируемость, aria-label при необходимости) — Button Group не меняет её поведение.",
      en: "Each Button inside the block keeps its usual accessibility (focusability, aria-label when needed) — Button Group doesn't change that behavior.",
    },
  ],
  related: [
    { name: "Button", description: { ru: "отдельная кнопка действия", en: "a standalone action button" } },
    { name: "Toggle Group", description: { ru: "сегментированный контрол с устойчивым состоянием выбора", en: "a segmented control with a persistent selection state" } },
    { name: "Input", description: { ru: "поле ввода, которое можно сопроводить ButtonGroupText или кнопкой", en: "an input field that can be paired with a ButtonGroupText or a button" } },
  ],
  forDevelopers: [
    {
      ru: "Чистый div с role=\"group\": скругления и рамки на стыках убираются CSS-селекторами по позиции ([&>*:not(:first-child)]), а не пропами отдельных детей — Button внутри не знает, что он в группе.",
      en: "A plain div with role=\"group\": seam rounding and borders are removed via positional CSS selectors ([&>*:not(:first-child)]), not props on individual children — a Button inside doesn't know it's in a group.",
    },
    {
      ru: "[&>*]:focus-visible:z-10 [&>*]:focus-visible:relative на контейнере — поднимает фокус-кольцо любого прямого потомка над соседями, независимо от того, что это за элемент.",
      en: "[&>*]:focus-visible:z-10 [&>*]:focus-visible:relative on the container — raises any direct child's focus ring above its neighbors, regardless of what that element is.",
    },
    {
      ru: "ButtonGroupSeparator оборачивает Separator с !m-0 self-stretch — внутренние отступы Separator ломали бы стык внутри плотного блока.",
      en: "ButtonGroupSeparator wraps Separator with !m-0 self-stretch — Separator's own margins would break the flush seam inside the tight block.",
    },
  ],
}
