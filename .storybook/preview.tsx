import type { Preview } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { create } from "storybook/theming";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import "../src/styles/globals.css";
import { docsThemes } from "./theme.generated";
import { parseGlobalsParam, brandThemeKey } from "./globals-from-url";

// DocsContainer рендерится вне декоратора/истории — Storybook-хук useGlobals там падает
// ("hooks can only be called inside decorators and story functions"), поэтому читаем globals
// через context.channel (как manager.ts: тот же канал, обычные React-хуки, не Storybook'овские).
//
// Начальное значение не может быть константой "main-light": DocsContainer пересоздаётся на
// каждый переход между Docs-страницами (Button → Alert) без нового GLOBALS_UPDATED, потому что
// globals не менялись — с константой компонент на каждой новой странице откатывался к
// main-light, пока тулбар не дёрнут вручную. Вместо этого читаем уже применённое состояние
// документа: декоратор в этом же файле выставляет data-brand/.dark на документе при рендере
// любой истории (в том числе внутри Canvas на предыдущей Docs-странице) — при переходе между
// страницами эти атрибуты никуда не делись, globals те же. Пусто (самая первая отрисовка
// iframe, ни одна история ещё не успела отрендериться) — тогда берём ?globals= из URL, как
// manager.ts для своей темы.
function initialDocsThemeKey(): keyof typeof docsThemes {
  const root = document.documentElement;
  if (root.dataset.brand) {
    const key = brandThemeKey({ brand: root.dataset.brand, theme: root.classList.contains("dark") ? "dark" : "light" });
    if (key in docsThemes) return key as keyof typeof docsThemes;
  }
  const key = brandThemeKey(parseGlobalsParam(window.location.search));
  return key in docsThemes ? (key as keyof typeof docsThemes) : "main-light";
}

function ThemedDocsContainer({ context, ...rest }: ComponentProps<typeof DocsContainer>) {
  const [key, setKey] = useState<keyof typeof docsThemes>(initialDocsThemeKey);
  useEffect(() => {
    const onGlobalsUpdated = ({ globals }: { globals?: { brand?: string; theme?: string } }) => {
      const next = brandThemeKey(globals ?? {}) as keyof typeof docsThemes
      if (docsThemes[next]) setKey(next)
    }
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated)
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated)
  }, [context.channel]);
  return <DocsContainer context={context} {...rest} theme={create(docsThemes[key])} />;
}

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
    // Большинство полей темы Docs — var(--ds-...), следуют data-brand/.dark сами (тот же
    // document, что и tokens.css); 8 литеральных полей (DOCS_LITERAL_COLOR_FIELDS в
    // build-manager-theme.mjs) не умеют var() — ThemedDocsContainer подставляет готовый набор
    // из 4 (main/demo × light/dark) по текущим globals, без перезагрузки iframe.
    docs: { container: ThemedDocsContainer },
  },
};
export default preview;
