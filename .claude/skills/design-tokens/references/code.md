# Код: Tailwind v4 + React + Storybook

Стек: Vite + React + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui, Storybook (framework `@storybook/react-vite`).

## Структура

```
tokens/tokens.json                 ← экспорт из Figma (источник правды для кода)
src/styles/tokens.css              ← СГЕНЕРИРОВАН (npm run tokens:build), руками не правим
src/styles/globals.css             ← подключение Tailwind и токенов
src/components/ui/<name>.tsx       ← компоненты (shadcn, переписанные на токены)
src/components/ui/<name>.stories.tsx
.storybook/main.ts, preview.tsx
```

## Первичная настройка (один раз)

1. `npm create vite@latest . -- --template react-ts`, затем `npm i -D tailwindcss @tailwindcss/vite`, плагин `tailwindcss()` в `vite.config.ts`.
2. `npx shadcn@latest init` (alias `@/` → `src/`). shadcn запишет свои `:root/.dark` в CSS — **удали их**, оставь только то, что ниже.
3. `npx storybook@latest init` (выбери React + Vite). Storybook подхватит `vite.config.ts`, Tailwind заработает сам.
4. Скопируй `assets/tokens.seed.json` в `tokens/tokens.json` (до первого экспорта из Figma), выполни `npm run tokens:build`.
5. **Smoke-тест:** временная история с `bg-primary text-on-primary hover:bg-primary-hover typo-heading-1 rounded-lg`. Убедись в браузере, что стили применились, а класс `bg-blue-500` не даёт цвета (палитра отключена). Удали историю.

## npm-скрипты

```json
{
  "scripts": {
    "tokens:build": "node .claude/skills/design-tokens/scripts/build-tokens.mjs tokens/tokens.json src/styles/tokens.css",
    "tokens:catalog": "node .claude/skills/design-tokens/scripts/build-tokens.mjs tokens/tokens.json src/styles/tokens.css .claude/skills/design-tokens/references/token-catalog.md",
    "tokens:check": "node .claude/skills/design-tokens/scripts/check-tokens.mjs src/components",
    "storybook": "storybook dev -p 6006"
  }
}
```

## src/styles/globals.css

```css
@import "tailwindcss";
@import "./tokens.css";

/* тёмная тема — класс .dark на <html> или на обёртке */
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  * { @apply border-border outline-focus-ring/50; }
  body { @apply bg-surface text-on-surface font-sans; }
}
```

Если `shadcn init` добавил `@import "shadcn/tailwind.css"` (анимации) или `tw-animate-css` — оставь, это не токены.
`dark:` объявлен только для редких случаев вне компонентов; в `src/components` он запрещён линтером.

## Как переключаются бренд и тема

- Бренд: атрибут `data-brand="main" | "demo"` на `<html>` (или на любой обёртке — токены пересчитаются внутри).
- Тема: класс `dark` на том же элементе.
- Компоненты ничего об этом не знают — меняются только значения CSS-переменных.

## .storybook/preview.tsx

```tsx
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
```

Импорт типа `Preview` зависит от версии Storybook: используй тот, что сгенерировал `storybook init` (`@storybook/react-vite` или `@storybook/react`).

## Шаблон истории

Каждый компонент: `Default` (с controls), `Variants` (все варианты), `States` (hover/pressed/focus/disabled), `BrandMatrix` (4 комбинации рядом).

```tsx
const combos = [
  { brand: "main", dark: false }, { brand: "main", dark: true },
  { brand: "demo", dark: false }, { brand: "demo", dark: true },
];
export const BrandMatrix: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4">
      {combos.map((c) => (
        <div key={c.brand + c.dark} data-brand={c.brand}
             className={(c.dark ? "dark " : "") + "bg-surface text-on-surface rounded-lg border border-border p-6"}>
          <p className="typo-caption text-on-surface-muted mb-3">{c.brand} / {c.dark ? "dark" : "light"}</p>
          <Component {...args} />
        </div>
      ))}
    </div>
  ),
};
```

Hover/pressed/focus — это CSS-состояния, пропсов для них нет и добавлять их ради историй нельзя. Чтобы показать их статично, поставь аддон `storybook-addon-pseudo-states` и в истории `States` задай `parameters: { pseudo: { hover: [...], active: [...], focusVisible: [...] } }`. Без аддона история `States` показывает только `disabled`, а остальное проверяется мышью и клавишей Tab.

## Definition of done для компонента

- [ ] Классы только из `token-catalog.md` + шкалы Tailwind; `npm run tokens:check` — 0 ошибок.
- [ ] Варианты и размеры совпадают с Figma component set.
- [ ] Истории `Default`, `Variants`, `States`, `BrandMatrix`.
- [ ] Проверено в 4 комбинациях бренд × тема, текст читается.
- [ ] Фокус с клавиатуры виден (`ring-focus-ring`).
