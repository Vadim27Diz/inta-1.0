import { useContext } from "react"
import { DocsContext } from "@storybook/addon-docs/blocks"

export type Locale = "ru" | "en"

function normalize(value: unknown): Locale {
  return value === "en" ? "en" : "ru"
}

// useGlobals() из storybook/preview-api — официальный хук, но в Storybook 10
// Docs-страница компонует несколько сторей за один проход и не оборачивает
// ни свободный MDX-текст, ни содержимое <Story of={...}> в полноценный
// HooksContext — хук бросает "preview hooks can only be called inside
// decorators and story functions" в обоих случаях (проверено руками).
//
// DocsContext — обычный React Context (не завязан на HooksContext), его
// можно читать через useContext где угодно в MDX. storyById()/getStoryContext()
// синхронно возвращают контекст primary story из CSF-файла, подключённого
// через <Meta of={...} />, включая актуальные globals — без ручной подписки
// на канал и без гонки при смене страницы: Storybook полностью перерендеривает
// Docs-страницу при смене глобала, так что это просто обычный React-рендер
// со свежим контекстом, а не состояние, которое надо синхронизировать вручную.
export function useLocale(): Locale {
  const context = useContext(DocsContext)
  const story = context.storyById()
  const storyContext = context.getStoryContext(story)
  return normalize(storyContext.globals?.locale)
}
