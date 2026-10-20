import type { ComponentDocs } from "@/docs/types"

export const kbdDocs: ComponentDocs = {
  title: "Kbd",
  purpose: {
    ru: "Kbd — визуально обозначает клавишу или сочетание клавиш в тексте, как клавиша клавиатуры.",
    en: "Kbd visually marks a keyboard key or shortcut inside text, styled like a physical key.",
  },
  whenToUse: [
    {
      ru: "Нужно показать сочетание клавиш для действия — в подсказке, тултипе, пункте меню или справке по горячим клавишам.",
      en: "Showing a keyboard shortcut for an action — in a hint, a tooltip, a menu item, or a shortcuts reference.",
    },
    {
      ru: "В инструкции упоминается конкретная клавиша, которую нужно нажать (Enter, Esc, Ctrl).",
      en: "An instruction mentions a specific key the user needs to press (Enter, Esc, Ctrl).",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Обычный текст без отношения к клавиатуре — Kbd меняет только визуальное оформление, не смысл.",
        en: "Plain text with no relation to the keyboard — Kbd only changes the visual styling, not the meaning.",
      },
      insteadOf: {
        name: "обычный текст",
        description: { ru: "без обёртки", en: "no wrapper" },
      },
    },
  ],
  anatomy: [
    {
      name: "Kbd",
      description: {
        ru: "единственный элемент — рендерится как <kbd>, принимает текст названия клавиши или символ.",
        en: "the single element — renders as <kbd>, takes the key's name or symbol as text.",
      },
    },
  ],
  variants: [
    { name: "одна клавиша", description: { ru: "короткое название или символ одной клавиши (K, Esc, ⌘)", en: "a short name or symbol for one key (K, Esc, ⌘)" } },
    { name: "сочетание", description: { ru: "несколько Kbd подряд, разделённые знаком «+» в обычном тексте — сочетание не один компонент, а набор Kbd рядом", en: "several Kbds in a row, separated by a plain-text “+” — a shortcut isn't one component, it's a set of Kbds placed next to each other" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "Название клавиши — как на физической клавиатуре или общепринятое сокращение (Ctrl, Esc, Enter), не произвольный текст.",
      en: "The key's name matches the physical keyboard or a common abbreviation (Ctrl, Esc, Enter), not arbitrary text.",
    },
    {
      ru: "Для сочетания клавиш ставьте знак «+» обычным текстом между соседними Kbd — сам компонент разделитель не добавляет.",
      en: "For a shortcut, place a plain-text “+” between neighboring Kbds — the component itself doesn't add a separator.",
    },
  ],
  accessibility: [
    {
      ru: "Семантический элемент <kbd> — скринридер озвучивает содержимое как обычный текст, без специального поведения.",
      en: "The semantic <kbd> element — a screen reader announces the content as plain text, with no special behavior.",
    },
    {
      ru: "Kbd — не интерактивный элемент и не замена реальному обработчику нажатия клавиши: он только показывает подсказку, нажатие всё равно обрабатывается слушателем событий где-то ещё.",
      en: "Kbd is not interactive and not a substitute for a real keypress handler: it only displays a hint, the actual keypress is still handled by an event listener elsewhere.",
    },
  ],
  related: [],
  forDevelopers: [
    {
      ru: "Минимальный компонент — только токены и разметка, без Radix и без собственного состояния.",
      en: "A minimal component — tokens and markup only, no Radix and no state of its own.",
    },
    {
      ru: "min-w-5 вместо фиксированной ширины — короткие символы (одна буква) остаются квадратными, длинные названия клавиш (PageDown) расширяют элемент по содержимому.",
      en: "min-w-5 instead of a fixed width — short symbols (a single letter) stay square, while long key names (PageDown) widen the element to fit the content.",
    },
  ],
}
