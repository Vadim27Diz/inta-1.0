import type { ComponentDocs } from "@/docs/types"

export const buttonDocs: ComponentDocs = {
  title: "Button",
  purpose: {
    ru: "Button запускает немедленное действие по клику или тапу — отправляет форму, открывает диалог, подтверждает или отменяет операцию.",
    en: "Button triggers an immediate action on click or tap — submits a form, opens a dialog, confirms or cancels an operation.",
  },
  whenToUse: [
    {
      ru: "Пользователь одним кликом или тапом запускает действие: сохранить, отправить, создать, подтвердить, отменить.",
      en: "A single click or tap starts an action: save, submit, create, confirm, cancel.",
    },
    {
      ru: "Рядом стоят несколько действий разной важности, и это важно показать визуально.",
      en: "Several actions of different importance sit next to each other, and that priority needs to be visible.",
    },
    {
      ru: "Действие временно недоступно, пока не выполнено условие — кнопка выглядит и ведёт себя как неактивная.",
      en: "The action is temporarily unavailable until a condition is met — the button looks and behaves as inactive.",
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
      name: "Текст / иконка",
      description: {
        ru: "Кнопка может содержать текст, иконку или и то и другое — порядок (иконка перед текстом или после) задаёт тот, кто собирает экран.",
        en: "A button can contain text, an icon, or both — the order (icon before or after the text) is up to whoever assembles the screen.",
      },
    },
    {
      name: "Кнопка как ссылка (asChild)",
      description: {
        ru: "Кнопку можно отрендерить как ссылку или другой элемент, сохранив её вид и поведение — полезно, когда действие на самом деле переход, а не запрос к серверу.",
        en: "The button can render as a link or another element while keeping its look and behavior — useful when the action is actually a navigation, not a server request.",
      },
    },
  ],
  variantGuidance: [
    {
      ru: "На экране или в одном смысловом блоке держите один primary — он показывает, куда в первую очередь посмотреть. Несколько primary рядом конкурируют за внимание и сбивают пользователя.",
      en: "Keep one primary per screen or logical block — it shows where attention should go first. Multiple primaries next to each other compete for attention and confuse the user.",
    },
    {
      ru: "secondary — действие-напарник primary (например, «Отмена» рядом с «Сохранить»). neutral — равноценное действие без выраженного приоритета. outline и ghost — тише по весу, для панелей, таблиц и тулбаров, где кнопок много.",
      en: "secondary is primary's companion action (e.g. “Cancel” next to “Save”). neutral is an action with no particular priority. outline and ghost are quieter, for panels, tables and toolbars with many buttons at once.",
    },
    {
      ru: "В группе из нескольких кнопок порядок должен быть одинаковым во всём продукте — не чередуйте, например, «Отмена слева» на одном экране и «Отмена справа» на другом.",
      en: "In a group of several buttons, the order must be consistent across the product — don't put “Cancel” on the left on one screen and on the right on another.",
    },
    {
      ru: "danger — только если у действия есть подтверждение («вы уверены?») или быстрая отмена сразу после. Без этого один клик может необратимо уничтожить данные.",
      en: "Use danger only when the action has a confirmation step (“are you sure?”) or a quick undo right after. Without one, a single click can destroy data irreversibly.",
    },
  ],
  variants: [
    { name: "primary", description: { ru: "главное действие на экране или в блоке — одно за раз", en: "the main action on screen or in a block — one at a time" } },
    { name: "secondary", description: { ru: "действие-напарник primary, например «Отмена» рядом с «Сохранить»", en: "primary's companion action, e.g. “Cancel” next to “Save”" } },
    { name: "neutral", description: { ru: "действие без выраженного приоритета", en: "an action with no particular priority" } },
    { name: "outline", description: { ru: "менее заметная кнопка — для панелей и таблиц", en: "a quieter button — for panels and tables" } },
    { name: "ghost", description: { ru: "минимальный вес — для тулбаров, строк таблиц, плотных карточек", en: "minimal weight — for toolbars, table rows, dense cards" } },
    { name: "danger", description: { ru: "разрушительное действие — всегда с подтверждением или отменой", en: "a destructive action — always with confirmation or undo" } },
    { name: "danger-subtle", description: { ru: "то же самое, но менее заметно", en: "the same, but with lower visual weight" } },
    { name: "inverse", description: { ru: "для тёмных или контрастных поверхностей", en: "for dark or contrasting surfaces" } },
    { name: "link", description: { ru: "действие в виде текстовой ссылки, без фона кнопки", en: "an action styled as a text link, no button fill" } },
    { name: "link-danger", description: { ru: "разрушительное действие в виде ссылки", en: "a link-styled destructive action" } },
    { name: "size: sm / md / lg", description: { ru: "три размера под плотность интерфейса: sm — компактные панели, md — размер по умолчанию, lg — заметные одиночные призывы к действию", en: "three sizes for interface density: sm for compact panels, md is the default, lg for prominent standalone calls to action" } },
    { name: "size: icon", description: { ru: "квадратная кнопка под одну иконку без подписи", en: "a square button for a single icon with no label" } },
  ],
  states: [
    { name: "hover", description: { ru: "фон чуть меняется при наведении курсора — подсказывает, что элемент интерактивен", en: "the fill shifts slightly on hover — signals that the element is interactive" } },
    { name: "active / pressed", description: { ru: "фон меняется заметнее в момент нажатия", en: "the fill changes more noticeably while pressed" } },
    { name: "focus-visible", description: { ru: "видимое кольцо вокруг кнопки при переходе с клавиатуры (Tab) — не появляется при клике мышью", en: "a visible ring around the button when reached via keyboard (Tab) — not shown on a mouse click" } },
    { name: "disabled", description: { ru: "кнопка не реагирует на клик и фокус, выглядит приглушённой", en: "the button doesn't respond to clicks or focus, and looks muted" } },
  ],
  contentRules: [
    {
      ru: "Подпись — глагол в повелительном наклонении или короткое словосочетание действия: «Сохранить», «Отправить», «Удалить», не «Сохранение» или голое «ОК» без контекста.",
      en: "Label is an imperative verb or a short action phrase: “Save”, “Submit”, “Delete” — not “Saving” or a bare “OK” without context.",
    },
    {
      ru: "1–3 слова. Подпись не переносится на вторую строку и не обрезается — при длинном тексте кнопка просто становится шире, поэтому сокращайте текст заранее, а не полагайтесь на то, что он поместится.",
      en: "1–3 words. The label neither wraps nor truncates — a long label just makes the button wider, so shorten the text up front rather than relying on it fitting.",
    },
    {
      ru: "У кнопки только с иконкой, без подписи, всё равно должно быть текстовое описание действия — для тех, кто пользуется скринридером.",
      en: "An icon-only button with no visible label still needs a text description of the action — for screen reader users.",
    },
  ],
  accessibility: [
    {
      ru: "Кнопка озвучивается скринридером как кнопка автоматически, без дополнительной настройки.",
      en: "The button is announced by a screen reader as a button automatically, with no extra setup.",
    },
    {
      ru: "Доступна с клавиатуры из коробки: Tab переводит фокус на кнопку, Enter или Space её нажимают.",
      en: "Keyboard-accessible out of the box: Tab moves focus to the button, Enter or Space activates it.",
    },
    {
      ru: "Неактивную (disabled) кнопку нельзя сфокусировать с клавиатуры, и скринридер не объявляет её как доступную для нажатия.",
      en: "A disabled button can't be focused with the keyboard, and a screen reader doesn't announce it as actionable.",
    },
    {
      ru: "Кольцо фокуса одинаково заметно на любом фоне — светлом и тёмном, обычном и приподнятом.",
      en: "The focus ring is equally visible on any background — light or dark, flat or raised.",
    },
  ],
  related: [
    { name: "Button Group", description: { ru: "объединяет несколько Button в один визуальный блок", en: "joins several Buttons into one visual block" } },
    { name: "Toggle", description: { ru: "кнопка с устойчивым состоянием on/off", en: "a button with a persistent on/off state" } },
    { name: "Spinner", description: { ru: "индикатор загрузки внутри кнопки", en: "a loading indicator inside a button" } },
  ],
  forDevelopers: [
    {
      ru: "Иконка и текст — обычные children, порядок задаётся порядком передачи. Размер SVG фиксирован классом ([&_svg]:size-4).",
      en: "Icon and text are plain children; order follows the order they're passed in. SVG size is fixed via a class ([&_svg]:size-4).",
    },
    {
      ru: "asChild — полиморфный рендер через Radix Slot: вместо <button> рендерится переданный элемент (например <a>), с теми же классами и обработчиками.",
      en: "asChild is polymorphic rendering via Radix Slot: the passed element (e.g. <a>) renders instead of <button>, with the same classes and handlers.",
    },
    {
      ru: "Длинный текст не обрезается и не переносится: whitespace-nowrap, кнопка растёт по контенту (inline-flex, без max-width).",
      en: "Long text doesn't truncate or wrap: whitespace-nowrap, the button grows with its content (inline-flex, no max-width).",
    },
    {
      ru: "size=\"icon\" без доступного имени: добавляйте aria-label на сам <button>, компонент его не проставляет.",
      en: "size=\"icon\" has no accessible name by default: add aria-label on the <button> itself, the component doesn't set one.",
    },
    {
      ru: "disabled — нативный атрибут <button>: pointer-events-none, выпадает из tab-order, свои токены bg-disabled/text-on-disabled.",
      en: "disabled is the native <button> attribute: pointer-events-none, removed from the tab order, its own bg-disabled/text-on-disabled tokens.",
    },
    {
      ru: "Фокус-кольцо — outline (не ring), outline-offset 2px: не обрезается overflow:hidden и не зависит от фона под кнопкой, в отличие от box-shadow-ring.",
      en: "The focus ring is an outline (not a ring), outline-offset 2px: unlike a box-shadow ring, it isn't clipped by overflow:hidden and doesn't depend on the background under the button.",
    },
  ],
  openQuestions: [
    {
      ru: "В наборе нет отдельного компонента Link — variant=\"link\"/\"link-danger\" встроен в Button. Это сознательное решение (ссылки всегда рендерятся как Button с asChild) или отдельный Link ещё не перенесён?",
      en: "There's no dedicated Link component in the kit — variant=\"link\"/\"link-danger\" lives on Button. Is this intentional (links always render as Button with asChild), or is a separate Link simply not ported yet?",
    },
    {
      ru: "Какой порядок кнопок принят в группе действий (например, в диалогах подтверждения) — primary слева или справа от Отмены? Платформенные конвенции расходятся, нужно зафиксировать свою и, возможно, проверить её в story States/BrandMatrix.",
      en: "What button order is standard in an action group (e.g. confirmation dialogs) — is primary to the left or right of Cancel? Platform conventions differ here, so this needs to be decided and possibly captured in the States/BrandMatrix story.",
    },
  ],
}
