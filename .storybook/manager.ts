import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"
import { managerThemes } from "./theme.generated"

// Статично main/light — живое переключение по тулбару Brand/Theme (proof-of-concept) добавится
// отдельно, см. docs/roadmap.md.
addons.setConfig({
  theme: create(managerThemes["main-light"]),
})
