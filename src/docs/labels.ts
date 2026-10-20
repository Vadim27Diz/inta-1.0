import type { Text } from "./types"

export const labels = {
  purpose: { ru: "Назначение", en: "Purpose" },
  whenToUse: { ru: "Когда использовать", en: "When to use" },
  whenNotToUse: { ru: "Когда не использовать", en: "When not to use" },
  anatomy: { ru: "Анатомия", en: "Anatomy" },
  variantsAndStates: { ru: "Варианты и состояния", en: "Variants & states" },
  variants: { ru: "Варианты", en: "Variants" },
  states: { ru: "Состояния", en: "States" },
  contentRules: { ru: "Правила контента", en: "Content guidelines" },
  accessibility: { ru: "Доступность", en: "Accessibility" },
  related: { ru: "Связанные компоненты", en: "Related components" },
  insteadOf: { ru: "Вместо используйте:", en: "Use instead:" },
  forDevelopers: { ru: "Для разработчиков", en: "For developers" },
} satisfies Record<string, Text>
