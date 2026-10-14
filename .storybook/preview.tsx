import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";

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
  },
  initialGlobals: { brand: "main", theme: "light" },
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
  parameters: { layout: "fullscreen", controls: { expanded: true } },
};
export default preview;
