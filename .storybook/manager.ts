import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"
import { GLOBALS_UPDATED } from "storybook/internal/core-events"
import { managerThemes } from "./theme.generated"

addons.setConfig({
  theme: create(managerThemes["main-light"]),
})

// Proof-of-concept: живое переключение темы manager вслед за тулбаром Brand/Theme. Manager и
// preview — разные бандлы/документы, но оба слушают общий channel (addons.register даёт доступ к
// нему через api.getChannel()); GLOBALS_UPDATED приходит при каждом изменении тулбара с уже
// смёрженными globals — тот же паттерн, что у сторонних аддонов вроде storybook-dark-mode.
addons.register("inta-brand-theme-sync", (api) => {
  api.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals?: { brand?: string; theme?: string } }) => {
    const key = `${globals?.brand ?? "main"}-${globals?.theme ?? "light"}` as keyof typeof managerThemes
    const theme = managerThemes[key]
    if (!theme) return // неизвестная комбинация (например, globals ещё не оба выставлены) — не трогаем тему
    addons.setConfig({ theme: create(theme) })
  })
})
