import type { ComponentDocs } from "@/docs/types"

export const nativeSelectDocs: ComponentDocs = {
  title: "Native Select",
  purpose: {
    ru: "Native Select — поле выбора одного варианта из списка, стилизованное под дизайн-систему поверх браузерного <select>, с родным для платформы выпадающим списком.",
    en: "Native Select is a single-choice dropdown field, styled to match the design system on top of the browser's own <select>, with the platform's native picker UI.",
  },
  whenToUse: [
    {
      ru: "Плоский список вариантов без иконок, описаний или группировки — родного выпадающего списка достаточно.",
      en: "A flat list of options with no icons, descriptions, or grouping — the native picker is enough.",
    },
    {
      ru: "Важно нативное поведение платформы: клавиатурный ввод первых букв для перехода к опции, системный вид списка на мобильных устройствах.",
      en: "Native platform behavior matters: keyboard type-ahead to jump to an option, the system's own list UI on mobile.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Нужны иконки, описания, группы опций, несколько уровней или кастомный внешний вид самого выпадающего списка (не только поля) — браузер не даёт стилизовать панель нативного <select>.",
        en: "You need icons, descriptions, option groups, or a custom look for the dropdown panel itself (not just the field) — the browser doesn't let you style a native <select>'s panel.",
      },
      insteadOf: {
        name: "Select",
        description: { ru: "кастомный выпадающий список на Radix", en: "a custom Radix-based dropdown" },
      },
    },
  ],
  anatomy: [
    {
      name: "NativeSelect",
      description: {
        ru: "обёртка-контейнер (управляет шириной через className) + нативный <select data-slot=\"native-select\"> внутри неё на всю ширину.",
        en: "a wrapping container (controls width via className) with the native <select data-slot=\"native-select\"> filling it.",
      },
    },
    {
      name: "ChevronDownIcon",
      description: {
        ru: "декоративная стрелка справа, aria-hidden, позиционируется от обёртки с отступом 12px от края.",
        en: "a decorative chevron on the right, aria-hidden, positioned from the wrapper with a 12px inset from the edge.",
      },
    },
  ],
  variants: [
    { name: "size: sm", description: { ru: "высота 32px", en: "32px tall" } },
    { name: "size: md", description: { ru: "высота 36px (по умолчанию)", en: "36px tall (default)" } },
    { name: "size: lg", description: { ru: "высота 40px", en: "40px tall" } },
  ],
  states: [
    { name: "default", description: { ru: "обычное состояние поля", en: "the field's default state" } },
    { name: "focus-visible", description: { ru: "кольцо фокуса (ring-3) вокруг поля при навигации с клавиатуры", en: "a focus ring (ring-3) around the field for keyboard navigation" } },
    { name: "aria-invalid", description: { ru: "рамка цвета danger при ошибке валидации", en: "a danger-colored border on a validation error" } },
    { name: "disabled", description: { ru: "курсор not-allowed, свой фон/цвет, рамка прозрачная", en: "not-allowed cursor, its own fill/color, transparent border" } },
  ],
  contentRules: [
    {
      ru: "Список опций — обычные <option> от потребителя компонента, без ограничения на длину текста в коде: браузер сам клипует выбранный вариант в закрытом поле и сам решает перенос/скролл в открытой панели — это платформенное поведение, а не стиль из нашей дизайн-системы.",
      en: "The option list is plain consumer-provided <option> elements, with no length limit enforced in code: the browser clips the selected value in the closed field and handles wrapping/scrolling in the open panel itself — that's platform behavior, not something our design system styles.",
    },
    {
      ru: "Первая опция без value (value=\"\") — стандартный способ показать плейсхолдер вида «Выберите вариант» для необязательного выбора.",
      en: "A first option with no value (value=\"\") is the standard way to show a “Select an option” placeholder for an optional choice.",
    },
  ],
  accessibility: [
    {
      ru: "Нативный <select> — доступность клавиатуры, типизация первых букв и объявление screen reader'ом полностью берёт на себя браузер, без дополнительной ARIA-разметки.",
      en: "A native <select> — keyboard access, type-ahead, and screen reader announcement are fully handled by the browser, with no extra ARIA markup needed.",
    },
    {
      ru: "Как и у любого поля формы, нужен связанный <label> (через Field/Label из набора, не входит в сам NativeSelect) — компонент не рендерит подпись сам.",
      en: "Like any form field, it needs an associated <label> (via Field/Label from the kit, not part of NativeSelect itself) — the component doesn't render its own caption.",
    },
    {
      ru: "ChevronDownIcon помечен aria-hidden — screen reader его не озвучивает, это не дублирующийся интерактивный элемент.",
      en: "ChevronDownIcon is marked aria-hidden — screen readers skip it; it isn't a duplicate interactive element.",
    },
  ],
  related: [
    { name: "Select", description: { ru: "кастомный выпадающий список с группами, иконками, чекмарками", en: "a custom dropdown with groups, icons, checkmarks" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
  ],
}
