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
    "tokens:contrast": "node .claude/skills/design-tokens/scripts/check-contrast.mjs tokens/tokens.json",
    "tailwind:check": "node scripts/check-tailwind-classes.mjs",
    "storybook": "storybook dev -p 6006",
    "visual": "node scripts/visual.mjs",
    "icons:stroke": "node scripts/icon-stroke-check.mjs"
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
- **Исключение — порталы.** Radix `Portal` рендерит контент в `document.body`, вне DOM-дерева
  обёртки с `data-brand`/`dark` — CSS-каскад до него не доходит, действует только то, что стоит на
  `<html>` (глобальный тулбар Storybook). Компонент-обёртка над любым Radix-примитивом с порталом
  (`Select`, дальше `Popover`, `Dropdown Menu`, `Dialog`…) должен принимать проп `container` и
  передавать его в `<…Primitive.Portal container={container}>` — тогда вызывающий код (в том числе
  история `BrandMatrix`) может указать, КУДА портал рисуется, и локальный `data-brand`/`dark` снова
  работает. Без этого компонент нельзя полноценно проверить в 4 комбинациях бренд × тема иначе чем
  через глобальный тулбар по одной за раз. См. `select.tsx` → `SelectContent` (эталон) и SKILL.md →
  «Топ ловушек» → «Порталы».

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

Для компонента с порталом (см. «Как переключаются бренд и тема» выше) `BrandMatrix` должен открывать
портал внутри своей ячейки, иначе он покрасится в глобальный тулбар, а не в локальную ячейку:

```tsx
function BrandMatrixCell({ brand, dark }: { brand: "main" | "demo"; dark: boolean }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} data-brand={brand}
         className={(dark ? "dark " : "") + "bg-surface text-on-surface rounded-lg border border-border p-6"}>
      <p className="typo-caption text-on-surface-muted mb-3">{brand} / {dark ? "dark" : "light"}</p>
      {container && <Component {...args} defaultOpen container={container} />}
    </div>
  );
}
```

`container` — `null` до первого рендера (ref ещё не привязан), поэтому сам портал рендерится только
когда он не `null`; `defaultOpen` — чтобы открытая панель была видна на снимке без клика.

## Проверка в браузере

Storybook смотрят глазами, но три вещи проверяются числами — через Chromium (playwright,
devDependency; ревизия берётся из кеша `~/Library/Caches/ms-playwright`, поэтому версию
playwright менять без нужды не стоит — другая версия потянет новую сборку Chromium).

| Команда | Что делает |
|---|---|
| `npm run visual` | снимает перечисленные в `scripts/visual.mjs` истории в 4 комбинациях бренд × тема, 1x, в `visual.local/`. Бренд и тема передаются глобалами Storybook (`?globals=brand:demo;theme:dark`) — то же, что делает тулбар. Флаги: `--no-build` (по готовому `storybook-static/`), `--dev` (по запущенному dev-серверу), `--story <id>` |
| `npm run icons:stroke` | толщина линии `lucide-react` в настоящем Chrome: `isPointInStroke` + интеграл чернил по столбцу на скриншоте. Должна совпасть с `2 × size / 24` и с высотой слоя `Vector` у `li:minus` в Figma |
| `npm run verify` | `tokens:check` + `tokens:contrast` + `tailwind:check` + `figma:diff` + `figma:layout`. `visual` сюда не входит: снимки — для глаз, не для CI |
| `npm run tailwind:check` | каждый класс из `cn()`/`cva()`/`className` в `src/components` реально порождает правило в собранном Tailwind CSS (через `@tailwindcss/node` `candidatesToCss`, парсинг файлов — TS Compiler API). Ловит опечатку в имени класса и класс токена, который удалили из `tokens.css`: Tailwind v4 на такое не падает, он просто ничего не генерирует |
| `npm run figma:layout` | правило раскладки страницы Components по снимку `figma/layout.json` (см. figma.md → «Раскладка страницы Components») |
| `npm run figma:diff` | цифровая сверка Figma ↔ код: геометрия вариантов и имена привязанных переменных против `getComputedStyle` в 4 комбинациях. Цвета сравниваются со значением CSS-переменной в том же документе, размеры токенов переводятся из rem в px браузером |

Три ловушки снимков:

- `storybook-addon-pseudo-states` навешивает классы `pseudo-*` **после** первого кадра. Снимок
  сразу после `waitForSelector` ловит историю `States` без hover и фокуса — нужна пауза.
- id истории в URL — это kebab-case заголовка: `Components/Input` + `States` → `components-input--states`,
  через дефис, а не через слэш.
- `figma-code-diff.mjs` различал цвет и размер CSS-переменной по подстроке `"color"` в её имени —
  работало, пока у каждого цветового токена в имени был слой `color/` (`--ds-color-on-primary`).
  Токены слоя Component называются без типа (`--ds-switch-thumb`, `--ds-sidebar-*`), подстрока
  не находится, значение пытались распарсить как `px` — результат «background rgb(255,255,255) ≠
  1200». Починено: тип переменной определяется по полю EXPECT (`radius` → размер, `border`/`color`/
  `bg`/`outline`/`markColor` → цвет), а не по имени.

## Definition of done для компонента

- [ ] Классы только из `token-catalog.md` + шкалы Tailwind; `npm run tokens:check` — 0 ошибок.
- [ ] Ни один класс не опечатан; `npm run tailwind:check` — 0 ошибок.
- [ ] `npm run tokens:contrast` — 0 ошибок (WCAG ≥ 4.5). Предупреждения APCA (< 60) читаем, но они не блокируют.
- [ ] Варианты и размеры совпадают с Figma component set.
- [ ] Истории `Default`, `Variants`, `States`, `BrandMatrix`.
- [ ] Проверено в 4 комбинациях бренд × тема, текст читается.
- [ ] Фокус с клавиатуры виден: `focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring`.
- [ ] `npm run visual` — истории сняты в 4 комбинациях, неудобный контент не ломает раскладку.
- [ ] `node scripts/figma-code-diff.mjs` — 0 расхождений с Figma.
- [ ] Перед слиянием ветки — снимок `figma/layout.json` переснят заново, `npm run verify` прогнан после этого (см. SKILL.md → Definition of done, пункт 9: обычная проверка сверяет снимок сам с собой, дрейф живой Figma она не ловит).
