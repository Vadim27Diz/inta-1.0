import type { ComponentDocs } from "@/docs/types"

export const skeletonDocs: ComponentDocs = {
  title: "Skeleton",
  purpose: {
    ru: "Skeleton — пульсирующая заглушка формы контента на время его загрузки.",
    en: "Skeleton is a pulsing placeholder for content's shape while it's loading.",
  },
  whenToUse: [
    {
      ru: "Контент грузится с сервера, и заранее известна приблизительная форма результата (строка текста, аватар, карточка) — заглушка снижает ощущение задержки.",
      en: "Content is loading from the server and the rough shape of the result is already known (a line of text, an avatar, a card) — a placeholder reduces the perceived delay.",
    },
    {
      ru: "Нужно удержать раскладку страницы стабильной между состоянием загрузки и готовым контентом — размеры Skeleton задаются так же, как у реального содержимого.",
      en: "The page layout needs to stay stable between the loading state and the finished content — Skeleton's size is set to match the real content.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Загрузка завершилась, и выяснилось, что данных нет — это другое состояние с собственным смыслом, не продолжение загрузки.",
        en: "Loading finished and it turns out there's no data — that's a different state with its own meaning, not a continuation of loading.",
      },
      insteadOf: {
        name: "Empty",
        description: { ru: "пустое состояние раздела", en: "a section's empty state" },
      },
    },
    {
      description: {
        ru: "Нужен индикатор процесса без привязки к форме будущего контента — например, во время отправки формы.",
        en: "A process indicator is needed with no tie to the future content's shape — e.g. while a form is submitting.",
      },
      insteadOf: {
        name: "Spinner",
        description: { ru: "индикатор загрузки без формы и значения", en: "a loading indicator with no shape or value" },
      },
    },
  ],
  anatomy: [
    {
      name: "Skeleton",
      description: {
        ru: "единственный элемент — прямоугольник (или круг через rounded-full) нужного размера, заданного className.",
        en: "the single element — a rectangle (or a circle via rounded-full) sized by className.",
      },
    },
  ],
  variants: [
    { name: "одна плашка", description: { ru: "один Skeleton произвольного размера — строка текста, картинка, одна форма целиком", en: "a single Skeleton of any size — a line of text, an image, one whole shape" } },
    { name: "составной паттерн", description: { ru: "несколько Skeleton рядом повторяют форму реального блока (например, круглый аватар + две строки текста) — сочетание не один компонент, а набор Skeleton, собранный как будущий контент", en: "several Skeletons together mirror a real block's shape (e.g. a round avatar + two lines of text) — the pattern isn't one component, it's a set of Skeletons assembled like the eventual content" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "Форма и количество Skeleton должны совпадать с реальным содержимым, которое их заменит — не один большой прямоугольник вместо трёх строк текста разной длины.",
      en: "Skeleton's shape and count should match the real content it's about to be replaced by — not one big rectangle in place of three lines of text with different lengths.",
    },
  ],
  accessibility: [
    {
      ru: "Skeleton — обычный <div> без ARIA: он не объявляется скринридеру как «загрузка» сам по себе. Если раздел действительно показывает состояние загрузки, оборачивайте группу Skeleton в контейнер с aria-busy=\"true\" или role=\"status\" и текстом-подсказкой («Загрузка») для скринридера — компонент этого не делает сам.",
      en: "Skeleton is a plain <div> with no ARIA — it doesn't announce itself to a screen reader as “loading”. If the section genuinely shows a loading state, wrap the group of Skeletons in a container with aria-busy=\"true\" or role=\"status\" and a hint text (“Loading”) for screen readers — the component doesn't do this on its own.",
    },
    {
      ru: "Анимация пульсации — motion-safe:animate-pulse: Tailwind применяет её только если пользователь не включил «уменьшить анимацию» (prefers-reduced-motion: reduce) — это происходит автоматически, без дополнительной настройки.",
      en: "The pulse animation is motion-safe:animate-pulse — Tailwind applies it only when the user hasn't requested reduced motion (prefers-reduced-motion: reduce); this happens automatically, with no extra setup.",
    },
  ],
  related: [
    { name: "Empty", description: { ru: "пустое состояние после завершения загрузки, а не заглушка на время её выполнения", en: "the empty state after loading finishes, not a placeholder during it" } },
    { name: "Spinner", description: { ru: "индикатор загрузки без привязки к форме контента", en: "a loading indicator with no tie to the content's shape" } },
  ],
  forDevelopers: [
    {
      ru: "Минимальный компонент — rounded-md bg-surface-muted motion-safe:animate-pulse и ничего больше, весь размер и форма приходят через className.",
      en: "A minimal component — rounded-md bg-surface-muted motion-safe:animate-pulse and nothing else; all size and shape come through className.",
    },
  ],
}
