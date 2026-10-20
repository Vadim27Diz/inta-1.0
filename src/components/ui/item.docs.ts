import type { ComponentDocs } from "@/docs/types"

export const itemDocs: ComponentDocs = {
  title: "Item",
  purpose: {
    ru: "Item — универсальная строка списка: иконка или картинка, заголовок с описанием и действия, собранные в одном блоке с правильными отступами.",
    en: "Item is a general-purpose list row: an icon or image, a title with a description, and actions, assembled into one block with correct spacing.",
  },
  whenToUse: [
    {
      ru: "Нужна строка в списке уведомлений, файлов, участников, настроек или похожего набора однородных записей.",
      en: "A row is needed in a list of notifications, files, participants, settings, or a similar set of homogeneous records.",
    },
    {
      ru: "У строки есть медиа слева (иконка или картинка), заголовок с коротким описанием и, возможно, действие справа — готовые слоты для этого набора.",
      en: "The row has media on the left (an icon or an image), a title with a short description, and possibly an action on the right — ready-made slots for that set.",
    },
    {
      ru: "Строка сама по себе кликабельна и ведёт на другую страницу — Item рендерится как ссылка (asChild + <a>).",
      en: "The row itself is clickable and leads to another page — Item renders as a link (asChild + <a>).",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Нужна карточка с заголовком, медиа сверху и кнопками внизу как самостоятельный блок в сетке или на дэшборде, а не строка списка.",
        en: "A card with a title, media on top, and buttons at the bottom is needed as a standalone block in a grid or dashboard — not a list row.",
      },
      insteadOf: {
        name: "Card",
        description: { ru: "самостоятельный блок с рамкой и тенью", en: "a standalone block with a border and a shadow" },
      },
    },
    {
      description: {
        ru: "Строка — это выбираемый вариант с чекбоксом или радиокнопкой («карточка выбора»), а не просто ряд с действием.",
        en: "The row is a selectable option with a checkbox or radio button (a “selection card”), not just a row with an action.",
      },
      insteadOf: {
        name: "Field",
        description: { ru: "FieldLabel, оборачивающий Field с Checkbox/RadioGroupItem — паттерн «карточка выбора»", en: "FieldLabel wrapping a Field with a Checkbox/RadioGroupItem — the “selection card” pattern" },
      },
    },
  ],
  anatomy: [
    { name: "Item", description: { ru: "корень строки — variant и size, опционально asChild для рендера как <a>/<button>.", en: "the row's root — variant and size, optionally asChild to render as <a>/<button>." } },
    { name: "ItemMedia", description: { ru: "иконка (variant=\"icon\") или картинка (variant=\"image\") слева.", en: "an icon (variant=\"icon\") or an image (variant=\"image\") on the left." } },
    { name: "ItemContent", description: { ru: "обёртка заголовка и описания, растягивается на всё доступное место (flex-1).", en: "the wrapper around the title and description, stretching to fill the available space (flex-1)." } },
    { name: "ItemTitle", description: { ru: "заголовок строки.", en: "the row's title." } },
    { name: "ItemDescription", description: { ru: "короткое описание под заголовком, обрезается многоточием после двух строк.", en: "a short description under the title, clipped with an ellipsis after two lines." } },
    { name: "ItemActions", description: { ru: "действия справа (кнопки, меню).", en: "actions on the right (buttons, a menu)." } },
    { name: "ItemHeader / ItemFooter", description: { ru: "необязательные строки метаданных сверху/снизу основного содержимого (например, бейдж и время сверху, кнопки снизу).", en: "optional metadata rows above/below the main content (e.g. a badge and a timestamp on top, buttons at the bottom)." } },
    { name: "ItemGroup", description: { ru: "вертикальный контейнер нескольких Item, role=\"list\" на самой обёртке.", en: "a vertical container for several Items, role=\"list\" on the wrapper itself." } },
    { name: "ItemSeparator", description: { ru: "тонкая линия между Item внутри ItemGroup.", en: "a thin line between Items inside an ItemGroup." } },
  ],
  variants: [
    { name: "variant: default", description: { ru: "прозрачный фон, без рамки — для строки прямо на фоне страницы или панели", en: "a transparent background with no border — for a row directly on the page's or panel's background" } },
    { name: "variant: outline", description: { ru: "тонкая рамка вокруг строки — когда строки нужно визуально разграничить без заливки", en: "a thin border around the row — when rows need visual separation without a fill" } },
    { name: "variant: muted", description: { ru: "приглушённая заливка фона — чтобы выделить или притушить отдельную строку в списке", en: "a muted background fill — to highlight or de-emphasize a single row in a list" } },
    { name: "size: default / sm", description: { ru: "default — обычные отступы (p-4), sm — компактные (px-4 py-3) для плотных списков", en: "default is the regular padding (p-4), sm is tighter (px-4 py-3) for dense lists" } },
  ],
  states: [
    { name: "hover", description: { ru: "фон чуть меняется при наведении — но только когда Item реально рендерится как ссылка (asChild + <a>), не на статичной строке", en: "the background shifts slightly on hover — but only when Item actually renders as a link (asChild + <a>), not on a static row" } },
    { name: "focus-visible", description: { ru: "видимое кольцо вокруг строки при переходе с клавиатуры — тоже только для asChild-ссылки/кнопки", en: "a visible ring around the row when reached via keyboard — also only for an asChild link/button" } },
    { name: "статичная строка", description: { ru: "обычный <div> без asChild — не реагирует на hover и фокус, потому что не является интерактивным элементом", en: "a plain <div> with no asChild — doesn't respond to hover or focus, because it isn't an interactive element" } },
  ],
  contentRules: [
    {
      ru: "ItemTitle переносится на вторую строку, если не помещается, а ItemDescription — обрезается многоточием после двух строк (line-clamp-2): не рассчитывайте, что длинное описание будет видно полностью, сокращайте его заранее.",
      en: "ItemTitle wraps onto a second line if it doesn't fit, while ItemDescription clips with an ellipsis after two lines (line-clamp-2) — don't rely on a long description being fully visible; shorten it up front.",
    },
    {
      ru: "ItemHeader/ItemFooter — для метаданных (бейдж, время, кнопки подтверждения/отказа), не для дублирования того, что уже есть в ItemTitle/ItemDescription.",
      en: "ItemHeader/ItemFooter are for metadata (a badge, a timestamp, confirm/decline buttons) — not for restating what's already in ItemTitle/ItemDescription.",
    },
    {
      ru: "Внутри ItemGroup разделяйте смысловые блоки строк ItemSeparator, а не ставьте его между каждой парой — как и в Select.",
      en: "Inside an ItemGroup, use ItemSeparator between logical blocks of rows, not between every pair — same rule as in Select.",
    },
  ],
  accessibility: [
    {
      ru: "Item сам по себе — обычный <div> без ARIA-роли. При asChild он наследует семантику переданного элемента (<a>, <button>) целиком: клавиатурный доступ, Enter/Space, фокус — автоматически, без лишней настройки.",
      en: "Item itself is a plain <div> with no ARIA role. With asChild, it fully inherits the semantics of the passed element (<a>, <button>) — keyboard access, Enter/Space, focus — automatically, with no extra setup.",
    },
    {
      ru: "Кольцо фокуса (focus-visible:outline-*) прописано в классах безусловно, но реально появляется только когда корень — действительно фокусируемый элемент (asChild); на обычном <div> :focus-visible никогда не срабатывает, это не баг.",
      en: "The focus ring classes (focus-visible:outline-*) are always present, but the ring only actually appears when the root is a genuinely focusable element (asChild) — on a plain <div>, :focus-visible never matches; that's not a bug.",
    },
    {
      ru: "ItemGroup проставляет role=\"list\" на обёртку, а Item — role=\"listitem\" на себя: та же пара, что у DocsRelated в этом же наборе. Скринридер объявляет группу как список из N строк автоматически, без лишней настройки — даже если конкретный Item рендерится как <div>, а не <li>.",
      en: "ItemGroup sets role=\"list\" on its wrapper, and Item sets role=\"listitem\" on itself — the same pair used by this very kit's DocsRelated. A screen reader announces the group as a list of N rows automatically, with no extra setup — even though a given Item renders as a <div>, not an <li>.",
    },
    {
      ru: "ItemSeparator наследует decorative=true от Separator по умолчанию (сам его не переопределяет) — role=\"none\", визуальная линия, не объявляется скринридером как разделитель.",
      en: "ItemSeparator inherits decorative=true from Separator by default (it doesn't override it) — role=\"none\", a purely visual line, not announced by a screen reader as a separator.",
    },
  ],
  related: [
    { name: "Card", description: { ru: "самостоятельный блок с рамкой и тенью, а не строка списка", en: "a standalone block with a border and a shadow, not a list row" } },
    { name: "Button", description: { ru: "действия в ItemActions/ItemFooter", en: "actions inside ItemActions/ItemFooter" } },
    { name: "Avatar", description: { ru: "фото участника — частая альтернатива ItemMedia variant=\"icon\"", en: "a participant's photo — a frequent alternative to ItemMedia variant=\"icon\"" } },
  ],
  forDevelopers: [
    {
      ru: "itemVariants и itemMediaVariants — два независимых cva(): variant/size у Item не управляют ItemMedia, у неё свой variant (default/icon/image). data-variant/data-size на корне дублируют пропы для стилизации через CSS.",
      en: "itemVariants and itemMediaVariants are two independent cva() calls: Item's variant/size don't control ItemMedia, which has its own variant (default/icon/image). data-variant/data-size on the root duplicate the props for CSS-side styling.",
    },
    {
      ru: "ItemMedia сдвигается вниз (translate-y-0.5) и прижимается к началу (self-start) только когда рядом есть ItemDescription (group-has-[[data-slot=item-description]]) — чтобы иконка выравнивалась по первой строке многострочного блока, а не по его центру.",
      en: "ItemMedia shifts down (translate-y-0.5) and aligns to the start (self-start) only when an ItemDescription is present nearby (group-has-[[data-slot=item-description]]) — so the icon lines up with the first line of a multi-line block instead of its center.",
    },
    {
      ru: "hover/focus-visible в itemVariants — [a]:hover:bg-surface-hover и безусловный focus-visible:outline-*, точно та же модель, что у BreadcrumbLink/Button: срабатывает только когда соответствующий псевдокласс применим к реальному тегу.",
      en: "hover/focus-visible in itemVariants — [a]:hover:bg-surface-hover and an unconditional focus-visible:outline-* — follow the same model as BreadcrumbLink/Button: they only fire when the matching pseudo-class actually applies to the real tag.",
    },
    {
      ru: "role=\"listitem\" задан прямо в JSX перед {...props} — как и у Spinner, его можно переопределить снаружи, передав свой role.",
      en: "role=\"listitem\" is set directly in JSX before {...props} — like Spinner's role, it can be overridden from outside by passing your own role.",
    },
  ],
}
