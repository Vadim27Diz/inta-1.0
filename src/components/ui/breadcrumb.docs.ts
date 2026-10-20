import type { ComponentDocs } from "@/docs/types"

export const breadcrumbDocs: ComponentDocs = {
  title: "Breadcrumb",
  purpose: {
    ru: "Breadcrumb показывает путь от начала иерархии до текущей страницы и позволяет перейти на любой из промежуточных уровней.",
    en: "Breadcrumb shows the path from the top of a hierarchy down to the current page and lets the user jump to any level in between.",
  },
  whenToUse: [
    {
      ru: "У раздела есть вложенная иерархия из трёх и более уровней, и пользователю важно видеть, где он сейчас находится.",
      en: "A section has a nested hierarchy of three or more levels, and the user needs to see where they currently are.",
    },
    {
      ru: "Нужен быстрый переход на любой из родительских уровней без повторных кликов «назад».",
      en: "A quick jump to any parent level is needed, without repeatedly clicking “back”.",
    },
    {
      ru: "Уровней много и часть из них нужно скрыть за многоточием (BreadcrumbEllipsis), оставив видимыми только начало и конец пути.",
      en: "There are many levels and some need to collapse behind an ellipsis (BreadcrumbEllipsis), leaving only the start and end of the path visible.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Иерархия — всего один или два уровня (например, страница и её список) — путь из одного шага не несёт новой информации.",
        en: "The hierarchy is only one or two levels deep (e.g. a page and its list) — a one-step path doesn't add information.",
      },
    },
    {
      description: {
        ru: "Нужна основная навигация по разделам продукта, а не показ текущего места внутри уже выбранного раздела.",
        en: "Primary navigation between the product's sections is needed, not a display of the current spot inside an already-chosen section.",
      },
    },
  ],
  anatomy: [
    { name: "Breadcrumb", description: { ru: "корневой <nav aria-label=\"breadcrumb\">.", en: "the root <nav aria-label=\"breadcrumb\">." } },
    { name: "BreadcrumbList", description: { ru: "упорядоченный список уровней (<ol>).", en: "the ordered list of levels (<ol>)." } },
    { name: "BreadcrumbItem", description: { ru: "один уровень пути — обёртка вокруг BreadcrumbLink/BreadcrumbPage/BreadcrumbEllipsis.", en: "one level of the path — a wrapper around BreadcrumbLink/BreadcrumbPage/BreadcrumbEllipsis." } },
    { name: "BreadcrumbLink", description: { ru: "кликабельный промежуточный уровень — обычная ссылка, поддерживает asChild для роутера.", en: "a clickable intermediate level — a plain link, supports asChild for a router." } },
    { name: "BreadcrumbPage", description: { ru: "текущая страница — последний уровень, не ссылка.", en: "the current page — the last level, not a link." } },
    { name: "BreadcrumbSeparator", description: { ru: "разделитель между уровнями, по умолчанию шеврон, можно заменить своим children.", en: "the separator between levels, a chevron by default, replaceable via its own children." } },
    { name: "BreadcrumbEllipsis", description: { ru: "«…» вместо скрытых промежуточных уровней — сейчас чисто декоративный, не триггер меню.", en: "“…” in place of hidden intermediate levels — currently purely decorative, not a menu trigger." } },
  ],
  variants: [],
  states: [],
  contentRules: [
    {
      ru: "Подпись уровня — короткое название раздела или страницы, как оно называется в навигации, не произвольная формулировка.",
      en: "A level's label is the section's or page's short name, as it's called in navigation — not an arbitrary phrasing.",
    },
    {
      ru: "Текущая страница (BreadcrumbPage) — последний элемент списка, без ссылки, даже если на неё технически можно было бы кликнуть.",
      en: "The current page (BreadcrumbPage) is the last item, with no link, even if it could technically be clickable.",
    },
    {
      ru: "BreadcrumbEllipsis — только для скрытых промежуточных уровней, не декоративный элемент на пустом месте.",
      en: "BreadcrumbEllipsis is only for genuinely hidden intermediate levels, not decoration added for its own sake.",
    },
  ],
  accessibility: [
    {
      ru: "nav aria-label=\"breadcrumb\" + вложенный <ol> — стандартный паттерн ARIA для хлебных крошек, работает автоматически, без дополнительной настройки.",
      en: "nav aria-label=\"breadcrumb\" with a nested <ol> is the standard ARIA breadcrumb pattern — it works automatically, with no extra setup.",
    },
    {
      ru: "BreadcrumbPage — role=\"link\" aria-disabled=\"true\" aria-current=\"page\": скринридер объявляет его как текущую, недоступную для клика страницу, отличая от обычных ссылок — автоматически, без лишней настройки.",
      en: "BreadcrumbPage has role=\"link\" aria-disabled=\"true\" aria-current=\"page\" — a screen reader announces it as the current, unclickable page, distinct from the regular links, automatically, with no extra setup.",
    },
    {
      ru: "BreadcrumbSeparator — role=\"presentation\" aria-hidden=\"true\": шеврон не озвучивается скринридером, автоматически.",
      en: "BreadcrumbSeparator has role=\"presentation\" aria-hidden=\"true\" — the chevron isn't announced by a screen reader, automatically.",
    },
    {
      ru: "BreadcrumbEllipsis больше не вешает aria-hidden на весь элемент — только на декоративную иконку (MoreHorizontal). Вложенный скрытый текст «More» теперь реально озвучивается скринридером при фокусе/просмотре блока: для скрытых уровней объявляется подсказка, а не тишина (было иначе — родительский aria-hidden глушил и текст).",
      en: "BreadcrumbEllipsis no longer puts aria-hidden on the whole element — only on the decorative icon (MoreHorizontal). The nested hidden “More” text is now actually announced by a screen reader: the hidden levels get a hint, not silence (previously the parent's aria-hidden muted the text too).",
    },
    {
      ru: "BreadcrumbLink — обычная <a>, доступна с клавиатуры из коробки (Tab, Enter) и теперь несёт собственное focus-visible-кольцо (outline-focus-ring), тот же паттерн, что у Button и Item — видно одинаково на surface и surface-raised, не только нативный браузерный фокус.",
      en: "BreadcrumbLink is a plain <a>, keyboard-accessible out of the box (Tab, Enter) and now carries its own focus-visible ring (outline-focus-ring), the same pattern as Button and Item — equally visible on surface and surface-raised, not just the browser's native focus.",
    },
  ],
  related: [],
  forDevelopers: [
    {
      ru: "Ничего из набора не завязано на Radix — это набор семантических элементов (nav/ol/li/a/span) с ручными ARIA-атрибутами, не примитив библиотеки.",
      en: "None of this is built on Radix — it's a set of semantic elements (nav/ol/li/a/span) with hand-set ARIA attributes, not a library primitive.",
    },
    {
      ru: "BreadcrumbLink принимает asChild (Slot) — для рендера как <Link> роутера вместо <a>. У BreadcrumbEllipsis asChild нет: сделать его реальным триггером меню («показать скрытые уровни») сейчас можно только оборачивая его целиком вручную, а не через проп.",
      en: "BreadcrumbLink accepts asChild (Slot) — to render a router's <Link> instead of <a>. BreadcrumbEllipsis has no asChild: turning it into a real “show hidden levels” menu trigger currently means wrapping it manually, not through a prop.",
    },
    {
      ru: "Скрытый текст у BreadcrumbEllipsis захардкожен на английском («More»), хотя остальные захардкоженные подсказки в наборе — на русском (например, aria-label у Spinner); теперь он реально доходит до скринридера (см. «Доступность»), так что языковое несоответствие стало заметным на практике, не только в коде — решать вместе с i18n, см. бэклог в handoff.",
      en: "BreadcrumbEllipsis's hidden text is hardcoded in English (“More”), while the rest of the kit's hardcoded hints are in Russian (e.g. Spinner's aria-label); it now actually reaches a screen reader (see “Accessibility”), so the language mismatch is now practically visible, not just in the code — to be decided together with i18n, see the backlog in handoff.",
    },
  ],
  openQuestions: [
    {
      ru: "Сейчас у компонента только story Default — нет Variants/States, поэтому в этом разделе их пустые массивы, а не придуманные значения. Нужна ли отдельная story States (фокус/hover BreadcrumbLink, собранный длинный путь с BreadcrumbEllipsis) — и, если да, в её рамках же решить вопрос ниже.",
      en: "Right now the component only has a Default story — no Variants/States, hence the empty arrays in this section rather than invented values. Is a dedicated States story needed (BreadcrumbLink's focus/hover, a long collapsed path with BreadcrumbEllipsis) — and if so, settle the question below as part of it.",
    },
    {
      ru: "BreadcrumbEllipsis сейчас чисто декоративный (aria-hidden, без onClick/asChild). Планируется ли сделать его рабочим триггером для показа скрытых уровней (например, через DropdownMenu)? Если да — нужно решить, как убрать aria-hidden/role=\"presentation\" именно для интерактивного случая, не трогая декоративный.",
      en: "BreadcrumbEllipsis is currently purely decorative (aria-hidden, no onClick/asChild). Is it meant to become a working trigger for revealing hidden levels (e.g. via a DropdownMenu)? If so, decide how to drop aria-hidden/role=\"presentation\" specifically for the interactive case, without touching the decorative one.",
    },
  ],
}
