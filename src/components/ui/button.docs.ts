import type { ComponentDocs } from "@/docs/types"

export const buttonDocs: ComponentDocs = {
  title: "Button",
  purpose: {
    ru: "Button запускает немедленное действие по клику или тапу — отправляет форму, открывает диалог, подтверждает или отменяет операцию.",
    en: "Button triggers an immediate action on click or tap — submits a form, opens a dialog, confirms or cancels an operation.",
  },
  whenToUse: [
    {
      ru: "Пользователь одним кликом инициирует действие: сохранить, отправить, создать, подтвердить, отменить.",
      en: "A single click starts an action: save, submit, create, confirm, cancel.",
    },
    {
      ru: "Нужно показать приоритет действия относительно других: primary — главное действие на экране, остальные варианты — менее важные действия рядом с ним.",
      en: "The action's priority relative to others matters: primary is the single main action on screen, the other variants are less prominent actions next to it.",
    },
    {
      ru: "Действие временно недоступно до выполнения условия — через проп disabled.",
      en: "The action is temporarily unavailable until a condition is met — via the disabled prop.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Переключение бинарного состояния (вкл/выкл), которое применяется сразу, без отдельного подтверждения.",
        en: "Toggling a binary on/off state that applies immediately, without a separate confirmation step.",
      },
      insteadOf: {
        name: "Switch",
        description: { ru: "переключатель состояния", en: "state toggle" },
      },
    },
    {
      description: {
        ru: "Выбор одного варианта из небольшого видимого набора взаимоисключающих опций.",
        en: "Choosing one option out of a small, fully visible set of mutually exclusive options.",
      },
      insteadOf: {
        name: "Radio Group",
        description: { ru: "группа радиокнопок", en: "radio button group" },
      },
    },
    {
      description: {
        ru: "Переключаемое прижатое/неприжатое состояние без немедленного побочного эффекта — например, кнопка форматирования в тулбаре (жирный, курсив).",
        en: "A toggleable pressed/unpressed state with no immediate side effect — e.g. a formatting button in a toolbar (bold, italic).",
      },
      insteadOf: {
        name: "Toggle",
        description: { ru: "кнопка с состоянием on/off", en: "on/off toggle button" },
      },
    },
    {
      description: {
        ru: "Несколько связанных действий должны визуально восприниматься как один блок (сегментированный контрол).",
        en: "Several related actions need to read visually as one joined block (segmented control).",
      },
      insteadOf: {
        name: "Button Group",
        description: { ru: "контейнер, объединяющий кнопки в один блок", en: "container that joins buttons into one block" },
      },
    },
  ],
  anatomy: [
    {
      name: "children",
      description: {
        ru: "Текст и/или иконка (SVG 16×16, размер фиксирован через [&_svg]:size-4). Порядок — слева направо по порядку children: иконка перед текстом или после него.",
        en: "Text and/or an icon (16×16 SVG, size fixed via [&_svg]:size-4). Order follows the children order: icon before or after the text.",
      },
    },
    {
      name: "asChild",
      description: {
        ru: "Полиморфный рендер через Radix Slot: вместо <button> рендерится переданный children-элемент (например <a>), сохраняя все классы и поведение Button.",
        en: "Polymorphic rendering via Radix Slot: renders the passed child element (e.g. <a>) instead of <button>, keeping all of Button's classes and behavior.",
      },
    },
  ],
  variants: [
    { name: "primary", description: { ru: "главное действие на экране, акцентный фон", en: "the main action on screen, accent fill" } },
    { name: "secondary", description: { ru: "действие рядом с primary, менее приоритетное", en: "an action next to primary, lower priority" } },
    { name: "neutral", description: { ru: "нейтральное действие без акцента", en: "a neutral action with no accent" } },
    { name: "outline", description: { ru: "контурная кнопка, слабее по весу, чем primary/neutral", en: "outlined button, lighter weight than primary/neutral" } },
    { name: "ghost", description: { ru: "без фона и обводки — для тулбаров, таблиц, плотных панелей", en: "no fill or border — for toolbars, tables, dense panels" } },
    { name: "danger", description: { ru: "разрушительное действие (удалить и т.п.)", en: "a destructive action (delete, etc.)" } },
    { name: "danger-subtle", description: { ru: "разрушительное действие с меньшим визуальным весом", en: "a destructive action with lower visual weight" } },
    { name: "inverse", description: { ru: "для тёмных/контрастных поверхностей", en: "for dark/contrasting surfaces" } },
    { name: "link", description: { ru: "выглядит как ссылка, без фона и паддингов кнопки", en: "looks like a link, no button fill or padding" } },
    { name: "link-danger", description: { ru: "ссылка для разрушительного действия", en: "a link-styled destructive action" } },
    { name: "size: sm / md / lg", description: { ru: "высота 32/36/40px", en: "32/36/40px tall" } },
    { name: "size: icon", description: { ru: "квадратная кнопка 36×36 под одну иконку без текста", en: "a square 36×36 button for a single icon, no text" } },
  ],
  states: [
    { name: "hover", description: { ru: "наведение курсора — усиленный фон (*-hover)", en: "pointer hover — stronger fill (*-hover)" } },
    { name: "active / pressed", description: { ru: "нажатие — ещё более сильный фон (*-pressed)", en: "pressed — an even stronger fill (*-pressed)" } },
    { name: "focus-visible", description: { ru: "видимое кольцо фокуса (outline), показывается только при навигации с клавиатуры", en: "a visible focus ring (outline), shown only for keyboard navigation" } },
    { name: "disabled", description: { ru: "недоступна для клика и фокуса, свой фон/цвет (bg-disabled/text-on-disabled)", en: "not clickable or focusable, has its own fill/color (bg-disabled/text-on-disabled)" } },
  ],
  contentRules: [
    {
      ru: "Подпись — глагол в повелительном наклонении или короткое словосочетание действия: «Сохранить», «Отправить», «Удалить», не «Сохранение» или «ОК» без контекста.",
      en: "Label is an imperative verb or a short action phrase: “Save”, “Submit”, “Delete” — not “Saving” or a bare “OK” without context.",
    },
    {
      ru: "1–3 слова. Длинный текст не обрезается и не переносится — компонент просто становится шире (класс whitespace-nowrap), поэтому длинную подпись сокращайте на уровне текста, а не полагайтесь на вёрстку.",
      en: "1–3 words. Long text is neither truncated nor wrapped — the button simply grows wider (whitespace-nowrap), so shorten the label itself rather than relying on layout to handle it.",
    },
    {
      ru: "Кнопка size=\"icon\" без видимого текста обязана получить доступное имя — aria-label на самой кнопке (компонент его не подставляет).",
      en: "An icon-only (size=\"icon\") button must get an accessible name — aria-label on the button itself (the component does not provide one automatically).",
    },
  ],
  accessibility: [
    {
      ru: "Корневой элемент — нативный <button> (role=button неявный); при asChild роль и семантику задаёт переданный элемент — автор отвечает за их уместность.",
      en: "The root element is a native <button> (implicit role=button); with asChild, the passed element determines role and semantics — the author is responsible for their correctness.",
    },
    {
      ru: "Доступна с клавиатуры из коробки: Tab фокусирует, Enter/Space активируют (нативное поведение <button>).",
      en: "Keyboard-accessible out of the box: Tab focuses, Enter/Space activate (native <button> behavior).",
    },
    {
      ru: "disabled использует нативный атрибут — кнопка выпадает из последовательности табуляции и недоступна screen reader'у как интерактивный элемент, отдельных aria-атрибутов не требуется.",
      en: "disabled uses the native attribute — the button is removed from the tab order and is not exposed to screen readers as interactive; no extra aria attributes are needed.",
    },
    {
      ru: "Фокус-кольцо — outline с отступом 2px, не ring с прозрачностью, поэтому одинаково видно на surface и surface-raised.",
      en: "The focus ring is an outline with a 2px offset, not a translucent ring — equally visible on both surface and surface-raised.",
    },
  ],
  related: [
    { name: "Button Group", description: { ru: "объединяет несколько Button в один визуальный блок", en: "joins several Buttons into one visual block" } },
    { name: "Toggle", description: { ru: "кнопка с устойчивым состоянием on/off", en: "a button with a persistent on/off state" } },
    { name: "Spinner", description: { ru: "индикатор загрузки внутри кнопки (ручная композиция — готового isLoading-пропа у Button нет)", en: "a loading indicator inside a button (manual composition — Button has no built-in isLoading prop)" } },
  ],
  openQuestions: [
    {
      ru: "В наборе нет отдельного компонента Link — variant=\"link\"/\"link-danger\" встроен в Button. Это сознательное решение (ссылки всегда рендерятся как Button с asChild) или отдельный Link ещё не перенесён?",
      en: "There's no dedicated Link component in the kit — variant=\"link\"/\"link-danger\" lives on Button. Is this intentional (links always render as Button with asChild), or is a separate Link simply not ported yet?",
    },
  ],
}
