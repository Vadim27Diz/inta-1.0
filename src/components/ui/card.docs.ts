import type { ComponentDocs } from "@/docs/types"

export const cardDocs: ComponentDocs = {
  title: "Card",
  purpose: {
    ru: "Card — универсальный контейнер, который объединяет связанный контент (заголовок, содержимое, действия) в одном визуальном блоке с рамкой и тенью.",
    en: "Card is a general-purpose container that groups related content (a title, content, actions) into one visual block with a border and a shadow.",
  },
  whenToUse: [
    {
      ru: "Нужно визуально выделить один связанный набор контента — элемент в сетке карточек, виджет на дэшборде, превью объекта.",
      en: "A related piece of content needs to stand out visually — an item in a card grid, a dashboard widget, an object preview.",
    },
    {
      ru: "Контенту нужны готовые слоты с правильными отступами: заголовок, описание, действие в углу заголовка, основное содержимое, кнопки внизу.",
      en: "The content needs ready-made slots with correct spacing: a title, a description, a corner action, the main content, buttons at the bottom.",
    },
    {
      ru: "Нужна картинка или другое медиа сверху блока, слитое с его краем (CardMedia).",
      en: "An image or other media needs to sit flush against the top edge of the block (CardMedia).",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Раздел сейчас пуст — нет данных для показа, а не единица контента, которую нужно обвести рамкой.",
        en: "The section is currently empty — there's no content to show, not a unit of content that needs a border.",
      },
      insteadOf: {
        name: "Empty",
        description: { ru: "пустое состояние раздела", en: "a section's empty state" },
      },
    },
    {
      description: {
        ru: "Сообщение о статусе или ошибке, которое должно быть заметным независимо от остального макета страницы.",
        en: "A status or error message that needs to stand out regardless of the rest of the page's layout.",
      },
      insteadOf: {
        name: "Alert",
        description: { ru: "заметное сообщение, привязанное к разделу страницы", en: "a prominent message tied to a section of the page" },
      },
    },
  ],
  anatomy: [
    { name: "Card", description: { ru: "корневой контейнер — рамка, тень, вертикальный отступ между слотами.", en: "the root container — border, shadow, vertical gap between slots." } },
    { name: "CardMedia", description: { ru: "необязательная картинка или видео сверху, впритык к краю карточки (не часть исходника shadcn — добавлена по запросу для карточек с обложкой).", en: "an optional image or video flush against the top edge (not part of shadcn's original — added on request for cover-style cards)." } },
    { name: "CardHeader", description: { ru: "строка заголовка — вмещает CardTitle, CardDescription и, если нужна, CardAction.", en: "the header row — holds CardTitle, CardDescription, and CardAction when one is needed." } },
    { name: "CardTitle", description: { ru: "заголовок карточки.", en: "the card's title." } },
    { name: "CardDescription", description: { ru: "короткое описание под заголовком.", en: "a short description under the title." } },
    { name: "CardAction", description: { ru: "необязательное действие (обычно одна иконка-кнопка) в правом верхнем углу заголовка.", en: "an optional action (usually a single icon button) in the header's top-right corner." } },
    { name: "CardContent", description: { ru: "основное содержимое карточки.", en: "the card's main content." } },
    { name: "CardFooter", description: { ru: "кнопки действий внизу карточки.", en: "action buttons at the bottom of the card." } },
  ],
  variants: [
    { name: "минимальный набор", description: { ru: "CardHeader + CardContent, без CardFooter и CardAction — для простых карточек без действий", en: "CardHeader + CardContent, no CardFooter or CardAction — for simple cards with no actions" } },
    { name: "с CardAction", description: { ru: "иконка-кнопка в углу заголовка — например, меню или настройки", en: "an icon button in the header's corner — e.g. a menu or settings" } },
    { name: "с CardFooter", description: { ru: "кнопки действий внизу карточки", en: "action buttons at the bottom of the card" } },
    { name: "с CardMedia", description: { ru: "картинка сверху, слитая с краем карточки", en: "an image on top, flush against the card's edge" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "CardTitle — короткая фраза, не предложение. Длинный заголовок просто переносится на несколько строк, карточка не обрезает его многоточием.",
      en: "CardTitle is a short phrase, not a sentence. A long title just wraps onto several lines — the card doesn't clip it with an ellipsis.",
    },
    {
      ru: "CardDescription — одно-два предложения, не повторяет заголовок другими словами.",
      en: "CardDescription is one or two sentences; it doesn't restate the title in different words.",
    },
    {
      ru: "CardAction — обычно одна иконка-кнопка (меню, настройки), не несколько действий подряд — для нескольких используйте CardFooter.",
      en: "CardAction is usually a single icon button (menu, settings), not several actions in a row — use CardFooter for more than one.",
    },
    {
      ru: "Порядок кнопок в CardFooter — та же договорённость, что и для группы кнопок в Button (см. его «Открытые вопросы»).",
      en: "Button order in CardFooter follows the same convention as a button group in Button (see its “Open questions”).",
    },
  ],
  accessibility: [
    {
      ru: "Card — обычный <div> без ARIA-роли. Если набор карточек должен озвучиваться как список, добавляйте role=\"list\" на обёртку и role=\"listitem\" на каждую карточку сами — компонент их не проставляет.",
      en: "Card is a plain <div> with no ARIA role. If a set of cards should be announced as a list, add role=\"list\" on the wrapper and role=\"listitem\" on each card yourself — the component doesn't set them.",
    },
    {
      ru: "CardTitle и CardDescription — <div>, а не <h1>–<h6>/<p>: уровень заголовка карточки зависит от того, где она стоит на странице, и компонент сознательно не навязывает его. Если текст должен быть частью структуры заголовков страницы, оберните его в Typography нужного уровня (variant=\"h3\"/\"h4\") внутри CardTitle — это тот же выбор, что у Empty и у Typography variant=\"large\".",
      en: "CardTitle and CardDescription are <div>s, not <h1>–<h6>/<p> — the card's heading level depends on where it sits on the page, and the component deliberately doesn't hardcode one. If the text needs to be part of the page's heading structure, wrap it in Typography at the right level (variant=\"h3\"/\"h4\") inside CardTitle — the same choice made for Empty and for Typography's variant=\"large\".",
    },
    {
      ru: "Интерактивный контент внутри (Button в CardAction/CardFooter) сохраняет свою обычную доступность — Card не меняет порядок фокуса и не перехватывает клавиатуру.",
      en: "Interactive content inside (a Button in CardAction/CardFooter) keeps its usual accessibility — Card doesn't change focus order or intercept the keyboard.",
    },
  ],
  related: [
    { name: "Empty", description: { ru: "пустое состояние раздела вместо заполненной карточки", en: "a section's empty state instead of a populated card" } },
    { name: "Alert", description: { ru: "заметное сообщение о статусе, а не контейнер для контента", en: "a prominent status message, not a content container" } },
    { name: "Button", description: { ru: "действия в CardAction и CardFooter", en: "actions inside CardAction and CardFooter" } },
  ],
  forDevelopers: [
    {
      ru: "CardMedia: -mt-6 компенсирует py-6 родителя (Card), чтобы картинка легла впритык к верхнему краю, rounded-t-xl срезает её под тот же радиус, что и сама карточка. Стилизацию <img> (aspect-ratio, object-fit) задаёт потребитель.",
      en: "CardMedia: -mt-6 compensates for Card's own py-6, so the image sits flush against the top edge; rounded-t-xl clips it to the card's own radius. Styling the <img> itself (aspect-ratio, object-fit) is up to whoever uses it.",
    },
    {
      ru: "С CardAction CardHeader переключается на grid-cols-[1fr_auto]. min-w-0 на CardTitle/CardDescription и break-words на CardDescription нужны, чтобы длинный заголовок или слово без пробелов не распирали ячейку — implicit minimum грид-колонки по умолчанию считается по max-content, а не по доступной ширине.",
      en: "With CardAction, CardHeader switches to grid-cols-[1fr_auto]. min-w-0 on CardTitle/CardDescription and break-words on CardDescription keep a long title or an unbroken word from forcing the grid cell wider — a grid column's implicit minimum defaults to max-content, not the available width.",
    },
    {
      ru: "data-slot: card, card-media, card-header, card-title, card-description, card-action, card-content, card-footer — хуки для кастомных стилей, не для логики состояния (у Card нет своего состояния).",
      en: "data-slot values: card, card-media, card-header, card-title, card-description, card-action, card-content, card-footer — hooks for custom styling, not for state logic (Card has no state of its own).",
    },
  ],
}
