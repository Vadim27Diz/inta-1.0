import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"
import { GLOBALS_UPDATED } from "storybook/internal/core-events"
import { managerThemes } from "./theme.generated"
import { parseGlobalsParam, brandThemeKey } from "./globals-from-url"

// Первая загрузка должна сразу отрисовать тему под сохранённые globals (например, URL с
// ?globals=brand:demo;theme:dark) — не мигать main-light до первого GLOBALS_UPDATED, который
// приходит только после того, как preview-iframe успеет смёржить globals и отдать их по
// channel. Manager — отдельный top-level документ и сам владеет window.location, поэтому может
// прочитать тот же query-параметр синхронно, до похода в channel.
function managerThemeKeyFromLocation(): keyof typeof managerThemes {
  const key = brandThemeKey(parseGlobalsParam(window.location.search))
  return key in managerThemes ? (key as keyof typeof managerThemes) : "main-light"
}

addons.setConfig({
  theme: create(managerThemes[managerThemeKeyFromLocation()]),
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
