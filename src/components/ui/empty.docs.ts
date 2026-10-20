import type { ComponentDocs } from "@/docs/types"

export const emptyDocs: ComponentDocs = {
  title: "Empty",
  purpose: {
    ru: "Empty — состояние «нет данных»: заменяет содержимое раздела (список, таблицу, панель), когда в нём действительно пусто, иконкой, заголовком, описанием и, при необходимости, действием.",
    en: "Empty is the “no data” state: it replaces a section's content (a list, a table, a panel) when it's genuinely empty, with an icon, a title, a description, and an optional action.",
  },
  whenToUse: [
    {
      ru: "Список, таблица или результат поиска вернули ноль записей — вместо пустого белого места.",
      en: "A list, table, or search returned zero records — instead of leaving blank space.",
    },
    {
      ru: "Нужно подсказать, что делать дальше: загрузить файл, изменить фильтр, создать первый элемент (кнопка в EmptyContent).",
      en: "The user needs a next step: upload a file, change a filter, create the first item (a button in EmptyContent).",
    },
    {
      ru: "Нужно явно отличить «данных пока нет» от «данные загружаются» — это разные состояния с разным компонентом.",
      en: "“There's no data yet” needs to read differently from “data is loading” — these are different states with different components.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Контент есть, просто сейчас идёт его загрузка — это состояние загрузки, а не пустоты.",
        en: "Content exists but is still loading — that's a loading state, not an empty one.",
      },
      insteadOf: {
        name: "Skeleton",
        description: { ru: "заглушка на время загрузки", en: "a placeholder while content loads" },
      },
    },
    {
      description: {
        ru: "Сообщение — это предупреждение или ошибка, которая должна быть видна независимо от того, есть ли контент в разделе.",
        en: "The message is a warning or an error that needs to be visible regardless of whether the section has content.",
      },
      insteadOf: {
        name: "Alert",
        description: { ru: "заметное сообщение о статусе", en: "a prominent status message" },
      },
    },
  ],
  anatomy: [
    { name: "Empty", description: { ru: "корневой контейнер — центрирует содержимое и задаёт внутренние отступы.", en: "the root container — centers the content and sets inner padding." } },
    { name: "EmptyHeader", description: { ru: "группа иконки, заголовка и описания — ограничена по ширине (max-w-sm), чтобы текст не растягивался на всю ширину раздела.", en: "the group of icon, title, and description — width-capped (max-w-sm) so the text doesn't stretch across the whole section." } },
    { name: "EmptyMedia", description: { ru: "иконка — вариант default (без подложки, в потоке) или icon (на квадратной плашке).", en: "the icon — variant default (no backing, inline) or icon (on a square tile)." } },
    { name: "EmptyTitle", description: { ru: "короткий заголовок пустого состояния.", en: "a short title for the empty state." } },
    { name: "EmptyDescription", description: { ru: "что делать, чтобы пустота исчезла.", en: "what to do to make the emptiness go away." } },
    { name: "EmptyContent", description: { ru: "необязательное действие — как правило, одна кнопка.", en: "an optional action — usually a single button." } },
  ],
  variantGuidance: [
    {
      ru: "variant=\"icon\" (плашка bg-surface-muted) — стандартный выбор для пустого состояния. variant=\"default\" (иконка без подложки) — когда нужен более лёгкий акцент, например внутри уже приглушённого блока.",
      en: "variant=\"icon\" (a bg-surface-muted tile) is the standard choice for an empty state. variant=\"default\" (no backing) is for a lighter touch — e.g. inside a block that's already muted.",
    },
  ],
  variants: [
    { name: "variant: icon", description: { ru: "иконка на квадратной плашке bg-surface-muted — по умолчанию для EmptyMedia", en: "the icon on a square bg-surface-muted tile — EmptyMedia's default" } },
    { name: "variant: default", description: { ru: "иконка без подложки, просто в потоке", en: "the icon with no backing, just inline" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "EmptyTitle — короткая фраза о том, чего не хватает («Нет файлов»), не инструкция и не вопрос.",
      en: "EmptyTitle is a short phrase naming what's missing (“No files”), not an instruction or a question.",
    },
    {
      ru: "EmptyDescription — что сделать, чтобы это исправить, не повторяет заголовок другими словами.",
      en: "EmptyDescription says what to do to fix it; it doesn't restate the title in different words.",
    },
    {
      ru: "EmptyContent — одно основное действие, которое устраняет пустоту (загрузить, создать, повторить поиск), не список из нескольких вариантов.",
      en: "EmptyContent is one main action that resolves the emptiness (upload, create, retry search), not a list of several options.",
    },
  ],
  accessibility: [
    {
      ru: "Empty — обычный <div>, без ARIA-роли и без live-region. Если пустое состояние появляется взамен уже видимого пользователю списка (например, после фильтра, убравшего все результаты), изменение не объявляется скринридеру автоматически — добавляйте aria-live=\"polite\" на обёртку сами.",
      en: "Empty is a plain <div>, with no ARIA role and no live region. If the empty state replaces content the user was already looking at (e.g. after a filter removes every result), the change isn't announced to a screen reader automatically — add aria-live=\"polite\" on the wrapper yourself.",
    },
    {
      ru: "EmptyTitle — <div>, не <h1>–<h6>: уровень заголовка зависит от места на странице, тот же осознанный выбор, что у CardTitle. EmptyDescription тоже рендерится как <div> (несмотря на тип React.ComponentProps<\"p\">) — для скринридера это не меняет смысл, обычный текст в любом случае читается без уровня структуры.",
      en: "EmptyTitle is a <div>, not an <h1>–<h6> — the heading level depends on the page, the same deliberate choice as CardTitle. EmptyDescription also renders as a <div> (despite its React.ComponentProps<\"p\"> type) — for a screen reader this doesn't change anything, plain text reads the same either way.",
    },
    {
      ru: "EmptyMedia — декоративная иконка, компонент не добавляет ей aria-hidden сам. Передавайте значок, который уже не несёт самостоятельного смысла помимо заголовка (или добавляйте aria-hidden=\"true\" на сам SVG).",
      en: "EmptyMedia's icon is decorative; the component doesn't add aria-hidden to it. Pass an icon that doesn't carry meaning beyond the title (or add aria-hidden=\"true\" to the SVG yourself).",
    },
  ],
  related: [
    { name: "Skeleton", description: { ru: "заглушка на время загрузки, а не пустое состояние", en: "a loading placeholder, not an empty state" } },
    { name: "Alert", description: { ru: "сообщение о статусе или ошибке", en: "a status or error message" } },
    { name: "Card", description: { ru: "заполненный контентом контейнер того же визуального уровня", en: "a content-filled container at the same visual level" } },
  ],
  forDevelopers: [
    {
      ru: "EmptyMedia variant=\"icon\": bg-surface-muted + text-on-surface (не text-on-surface-muted) — осознанное исключение из правила «bg-X + text-on-X», human-approved: на приглушённой плашке иконке нужен полный контраст, иначе она теряется.",
      en: "EmptyMedia variant=\"icon\": bg-surface-muted + text-on-surface (not text-on-surface-muted) — a deliberate, human-approved exception to the “bg-X + text-on-X” rule: on a muted tile the icon needs full contrast or it gets lost.",
    },
    {
      ru: "EmptyDescription: w-full min-w-0 break-words — без них EmptyHeader (items-center, flex) не стягивает описание шириной: при длинном «слове» без пробелов блок считает shrink-to-fit по min-content и вылезает за max-w-sm, не перенося текст.",
      en: "EmptyDescription: w-full min-w-0 break-words — without them, EmptyHeader (items-center, flex) doesn't constrain the description's width: a long unbroken word makes the block shrink-to-fit by min-content and overflow max-w-sm instead of wrapping.",
    },
  ],
}
