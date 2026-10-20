import type { Locale } from "./locale"

export type Text = Record<Locale, string>

export interface AnatomyPart {
  /** Реальное имя из кода — subcomponent, проп или DOM-слот (data-slot). */
  name: string
  description: Text
}

export interface VariantEntry {
  /** Реальное значение из кода: variant/size/state — то, что есть в cva()/stories, не придумано. */
  name: string
  description?: Text
}

export interface RelatedComponent {
  name: string
  description: Text
}

export interface WhenNotToUseEntry {
  description: Text
  insteadOf?: RelatedComponent
}

export interface ComponentDocs {
  /** Заголовок страницы — имя компонента как в sidebar (Components/<name>). */
  title: string
  /** 1. Назначение — 1-2 предложения. */
  purpose: Text
  /** 2. Когда использовать — конкретные сценарии. */
  whenToUse: Text[]
  /** 3. Когда НЕ использовать — и чем заменить. */
  whenNotToUse: WhenNotToUseEntry[]
  /** 4. Анатомия — реальные subcomponent'ы/слоты из кода. */
  anatomy: AnatomyPart[]
  /** 5а. Правила выбора между вариантами — иерархия, порядок, когда какой. Необязательно. */
  variantGuidance?: Text[]
  /** 5а. Варианты — значения variant/size и т.п. из cva(). */
  variants: VariantEntry[]
  /** 5б. Состояния — из [&_svg]/disabled/focus-visible/aria-invalid и stories States. */
  states: VariantEntry[]
  /** 6. Правила контента. */
  contentRules: Text[]
  /** 7. Доступность. */
  accessibility: Text[]
  /** 8. Связанные компоненты. */
  related: RelatedComponent[]
  /**
   * Необязательный раздел для разработчиков — рендерится последним. Сюда,
   * а не в основной текст, идут Tailwind-классы, токены, data-slot, Radix,
   * npm-скрипты, поведение браузера и прочая реализация.
   */
  forDevelopers?: Text[]
  /** Открытые вопросы к человеку — не часть страницы, попадают в отчёт PR. */
  openQuestions?: Text[]
}
