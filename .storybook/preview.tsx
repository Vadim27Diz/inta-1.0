import type { Preview } from "@storybook/react-vite";
import { create } from "storybook/theming";
import "../src/styles/globals.css";
import { docsThemes } from "./theme.generated";

const preview: Preview = {
  globalTypes: {
    brand: {
      description: "Бренд",
      toolbar: { title: "Brand", icon: "paintbrush", items: ["main", "demo"], dynamicTitle: true },
    },
    theme: {
      description: "Тема",
      toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
    },
    locale: {
      description: "Язык документации",
      toolbar: {
        title: "Docs language",
        icon: "globe",
        items: [
          { value: "ru", title: "Русский" },
          { value: "en", title: "English" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: "main", theme: "light", locale: "ru" },
  decorators: [
    (Story, { globals }) => {
      const root = document.documentElement;
      root.dataset.brand = globals.brand;
      root.classList.toggle("dark", globals.theme === "dark");
      return (
        <div className="bg-surface text-on-surface p-6 min-h-screen">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    // Статично light — цвета внутри var() следуют data-brand/.dark сами (тот же document,
    // что и tokens.css), менять объект при переключении тулбара не нужно. dark/light всё же
    // нужно переключать явно — см. proof-of-concept в docs/roadmap.md.
    docs: { theme: create(docsThemes.light) },
  },
};
export default preview;
