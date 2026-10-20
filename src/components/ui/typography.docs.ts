import type { ComponentDocs } from "@/docs/types"

export const typographyDocs: ComponentDocs = {
  title: "Typography",
  purpose: {
    ru: "Typography — готовые текстовые стили набора (заголовки, абзац, цитата, инлайн-код, список и т.п.) с правильным HTML-тегом для каждого.",
    en: "Typography is the kit's set of ready-made text styles (headings, a paragraph, a blockquote, inline code, a list, etc.) each paired with the right HTML tag.",
  },
  whenToUse: [
    {
      ru: "Нужен стандартный текстовый стиль вместо того, чтобы собирать его вручную из typo-* классов на произвольном теге.",
      en: "A standard text style is needed instead of hand-assembling one from typo-* classes on an arbitrary tag.",
    },
    {
      ru: "Нужна цитата, инлайн-код или маркированный список с готовым оформлением.",
      en: "A blockquote, inline code, or a bulleted list needs ready-made styling.",
    },
    {
      ru: "Визуальный размер текста должен отличаться от его уровня в структуре документа — используйте asChild (подробнее в «Для разработчиков»).",
      en: "The text's visual size needs to differ from its level in the document outline — use asChild (details in “For developers”).",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Текст — подпись конкретного поля формы, а не самостоятельный блок страницы.",
        en: "The text is a specific form field's label, not a standalone block on the page.",
      },
      insteadOf: {
        name: "Label",
        description: { ru: "подпись, связанная с полем", en: "a label tied to a field" },
      },
    },
    {
      description: {
        ru: "Текст обозначает клавишу клавиатуры, а не обычное содержимое.",
        en: "The text represents a keyboard key, not ordinary content.",
      },
      insteadOf: {
        name: "Kbd",
        description: { ru: "визуальное обозначение клавиши", en: "a visual key indicator" },
      },
    },
  ],
  anatomy: [
    {
      name: "Typography",
      description: {
        ru: "единственный элемент — HTML-тег и стиль задаёт variant, содержимое — обычные children.",
        en: "the single element — variant picks the HTML tag and the style, content is plain children.",
      },
    },
  ],
  variantGuidance: [
    {
      ru: "h1–h4 — выбирайте по месту текста в структуре документа (уровень заголовка), а не по тому, насколько крупным он должен выглядеть. lead/large/small/muted — текст без уровня заголовка, только внешний вид: large и h4 выглядят одинаково, но large не создаёт заголовок для скринридера и навигации по структуре страницы.",
      en: "h1–h4 are chosen by the text's place in the document outline (its heading level), not by how large it should look. lead/large/small/muted carry no heading level, visuals only: large and h4 look identical, but large doesn't create a heading for screen-reader structure navigation.",
    },
    {
      ru: "Если нужен конкретный уровень заголовка, но с другим визуальным размером (например, h2 по смыслу, но выглядящий как h4) — используйте asChild с реальным <h2>, не выбирайте variant по размеру в ущерб структуре.",
      en: "If a specific heading level is needed with a different visual size (e.g. an h2 in meaning that looks like an h4) — use asChild with a real <h2>, don't pick a variant by size at the expense of the document's structure.",
    },
  ],
  variants: [
    { name: "h1", description: { ru: "заголовок первого уровня — <h1>", en: "a level-1 heading — <h1>" } },
    { name: "h2", description: { ru: "заголовок второго уровня — <h2>", en: "a level-2 heading — <h2>" } },
    { name: "h3", description: { ru: "заголовок третьего уровня — <h3>", en: "a level-3 heading — <h3>" } },
    { name: "h4", description: { ru: "заголовок четвёртого уровня — <h4>", en: "a level-4 heading — <h4>" } },
    { name: "p", description: { ru: "обычный абзац — <p>, вариант по умолчанию", en: "a plain paragraph — <p>, the default" } },
    { name: "lead", description: { ru: "вводный абзац перед разделом — крупнее и приглушённее обычного текста", en: "an intro paragraph before a section — larger and more muted than regular text" } },
    { name: "large", description: { ru: "крупный акцентный текст без уровня заголовка — <div>", en: "large emphasis text with no heading level — a <div>" } },
    { name: "small", description: { ru: "мелкий вспомогательный текст — <small>", en: "small supporting text — <small>" } },
    { name: "muted", description: { ru: "приглушённый вторичный текст — <p>", en: "muted secondary text — <p>" } },
    { name: "blockquote", description: { ru: "цитата с левой чертой — <blockquote>", en: "a quote with a left rule — <blockquote>" } },
    { name: "inline-code", description: { ru: "короткий код в тексте — <code>", en: "short inline code — <code>" } },
    { name: "list", description: { ru: "маркированный список — <ul>, принимает <li> как children", en: "a bulleted list — <ul>, takes <li> elements as children" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "Длинный текст без пробелов (например, URL) переносится по словам — проверено во всех вариантах, включая blockquote и inline-code.",
      en: "Long text with no spaces (e.g. a URL) wraps mid-word — verified across every variant, including blockquote and inline-code.",
    },
    {
      ru: "Не пропускайте уровни заголовков ради визуального эффекта (h1 → h3 без h2 между ними) — используйте large/small для визуальной разницы, оставляя реальные уровни по порядку.",
      en: "Don't skip heading levels for visual effect (h1 → h3 with no h2 in between) — use large/small for the visual difference while keeping real levels in order.",
    },
  ],
  accessibility: [
    {
      ru: "h1–h4 рендерятся как настоящие семантические заголовки (<h1>–<h4>) — скринридер объявляет их уровень и добавляет в навигацию по заголовкам страницы автоматически, без лишней настройки.",
      en: "h1–h4 render as real semantic headings (<h1>–<h4>) — a screen reader announces their level and adds them to page heading navigation automatically, with no extra setup.",
    },
    {
      ru: "large, small, muted и lead не создают заголовок для скринридера, даже если выглядят крупно или жирно — это осознанный выбор (эмфаза без уровня структуры), а не упущение.",
      en: "large, small, muted, and lead don't create a heading for a screen reader, even when they look big or bold — that's a deliberate choice (emphasis without a structural level), not an oversight.",
    },
    {
      ru: "asChild рендерит переданный элемент вместо тега по умолчанию и переносит на него и класс, и data-variant — так можно получить нужный уровень заголовка с визуальным стилем другого variant.",
      en: "asChild renders the passed element instead of the default tag and carries both the class and data-variant onto it — this is how to get a specific heading level with another variant's visual style.",
    },
  ],
  related: [
    { name: "Label", description: { ru: "подпись, связанная с конкретным полем формы", en: "a label tied to a specific form field" } },
    { name: "Card", description: { ru: "CardTitle/CardDescription — та же логика «эмфаза без уровня», но для карточки", en: "CardTitle/CardDescription use the same “emphasis without a level” logic, for a card" } },
  ],
  forDevelopers: [
    {
      ru: "defaultTag — словарь variant → HTML-тег (h1…h4, p, small, blockquote, code, ul, div для large). asChild (Radix Slot) подставляет вместо него переданный элемент, не меняя классы.",
      en: "defaultTag is a variant → HTML tag lookup (h1…h4, p, small, blockquote, code, ul, div for large). asChild (Radix Slot) substitutes the passed element in its place without changing the classes.",
    },
    {
      ru: "variant=\"list\" задаёт только list-disc/pl-6 на <ul> и отступ между пунктами ([&>li]:mt-2) — сами <li> не оборачиваются автоматически, передавайте их как children.",
      en: "variant=\"list\" only sets list-disc/pl-6 on the <ul> and the gap between items ([&>li]:mt-2) — <li> elements aren't wrapped automatically, pass them as children.",
    },
    {
      ru: "large использует тот же typo-heading-4 text-on-surface, что и h4 — тот же прецедент, что у CardTitle/EmptyTitle: в каталоге нет отдельного токена под «крупный текст без заголовка».",
      en: "large uses the same typo-heading-4 text-on-surface as h4 — the same precedent as CardTitle/EmptyTitle: the catalog has no separate token for “large text with no heading”.",
    },
  ],
}
