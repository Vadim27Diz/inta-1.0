import type { ComponentDocs } from "@/docs/types"

export const toggleDocs: ComponentDocs = {
  title: "Toggle",
  purpose: {
    ru: "Toggle — кнопка с устойчивым прижатым/неприжатым состоянием, без немедленного побочного эффекта вне самой кнопки.",
    en: "Toggle is a button with a persistent pressed/unpressed state and no immediate side effect outside the button itself.",
  },
  whenToUse: [
    {
      ru: "Переключаемая кнопка форматирования в тулбаре — жирный, курсив, подчёркивание.",
      en: "A toggleable formatting button in a toolbar — bold, italic, underline.",
    },
    {
      ru: "Нужна одна независимая кнопка с состоянием вкл/выкл, визуально похожая на кнопку, а не на переключатель формы.",
      en: "A single independent on/off button is needed that looks like a button, not a form toggle.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Запуск немедленного действия — отправка, подтверждение, переход. У Toggle нет действия, только смена своего состояния.",
        en: "Triggering an immediate action — submit, confirm, navigate. Toggle has no action, only its own state change.",
      },
      insteadOf: {
        name: "Button",
        description: { ru: "кнопка действия", en: "an action button" },
      },
    },
    {
      description: {
        ru: "Переключатель параметра настройки вкл/выкл, который применяется сразу и не выглядит как кнопка тулбара.",
        en: "A settings toggle that applies immediately and isn't styled as a toolbar button.",
      },
      insteadOf: {
        name: "Switch",
        description: { ru: "переключатель состояния", en: "a state toggle" },
      },
    },
    {
      description: {
        ru: "Несколько взаимосвязанных Toggle, из которых осмысленно выбирать один или несколько одним визуальным блоком.",
        en: "Several related Toggles where it makes sense to select one or more as a single visual block.",
      },
      insteadOf: {
        name: "Toggle Group",
        description: { ru: "группа связанных переключаемых кнопок", en: "a group of related toggle buttons" },
      },
    },
  ],
  anatomy: [
    {
      name: "Иконка / текст",
      description: {
        ru: "Toggle обычно содержит одну иконку (режим тулбара) или короткий текст — как и у Button, порядок и содержимое задаёт тот, кто собирает экран.",
        en: "Toggle usually holds a single icon (toolbar mode) or short text — like Button, content and order are up to whoever assembles the screen.",
      },
    },
  ],
  variants: [
    { name: "default", description: { ru: "без рамки — для плотных тулбаров", en: "borderless — for dense toolbars" } },
    { name: "outline", description: { ru: "с рамкой — когда кнопка стоит отдельно от других элементов", en: "with a border — when the button stands apart from other elements" } },
    { name: "size: sm / md / lg", description: { ru: "три размера под плотность интерфейса, одинаковая логика с Button", en: "three sizes for interface density, same logic as Button" } },
  ],
  states: [
    { name: "off", description: { ru: "не прижата — обычный вид", en: "not pressed — regular look" } },
    { name: "on / pressed", description: { ru: "прижата — фон и текст меняются, показывая активное состояние", en: "pressed — fill and text change to show the active state" } },
    { name: "focus-visible", description: { ru: "видимое кольцо при переходе с клавиатуры", en: "a visible ring when reached via keyboard" } },
    { name: "disabled", description: { ru: "недоступна для переключения, выглядит приглушённой", en: "not toggleable, looks muted" } },
  ],
  contentRules: [
    {
      ru: "Иконка должна быть однозначно узнаваемой без подписи — если есть риск неоднозначности, добавьте aria-label для скринридера, видимый текст не обязателен.",
      en: "The icon must be unambiguously recognizable without a label — if there's any risk of ambiguity, add aria-label for screen readers; visible text isn't required.",
    },
  ],
  accessibility: [
    {
      ru: "Прижатое состояние озвучивается скринридером как «нажато» / «не нажато» (aria-pressed) автоматически, без дополнительной настройки.",
      en: "The pressed state is announced by a screen reader as “pressed” / “not pressed” (aria-pressed) automatically, with no extra setup.",
    },
    {
      ru: "Доступна с клавиатуры из коробки: Tab переводит фокус, Enter или Space переключают состояние.",
      en: "Keyboard-accessible out of the box: Tab moves focus, Enter or Space toggles the state.",
    },
    {
      ru: "У иконки без видимого текста обязателен aria-label — иначе скринридер не объявит назначение кнопки.",
      en: "An icon with no visible text needs an aria-label — otherwise a screen reader won't announce what the button does.",
    },
  ],
  related: [
    { name: "Button", description: { ru: "кнопка немедленного действия, без устойчивого состояния", en: "an immediate-action button, no persistent state" } },
    { name: "Toggle Group", description: { ru: "несколько Toggle, объединённых в один блок", en: "several Toggles joined into one block" } },
    { name: "Switch", description: { ru: "переключатель параметра настройки", en: "a settings toggle" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка над Radix Toggle.Root — прижатое состояние читается через атрибут data-state со значением «on» (вкл) и его отсутствие (выкл), не через отдельный класс.",
      en: "A wrapper around Radix Toggle.Root — the pressed state is read via the data-state attribute with value “on” and its absence (off), not a separate class.",
    },
    {
      ru: "variant/size — cva(), тот же токен-набор, что у Button (disabled:bg-disabled, focus-visible:outline-focus-ring).",
      en: "variant/size are cva(); the same token set as Button (disabled:bg-disabled, focus-visible:outline-focus-ring).",
    },
  ],
}
