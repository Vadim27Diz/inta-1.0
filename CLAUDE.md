# Проект: дизайн-система ds (Figma → Storybook)

Мультибрендовая (white-label) дизайн-система со светлой и тёмной темой.
Источник правды — Figma Variables. Код — React + TypeScript + Vite, Tailwind CSS v4, shadcn/ui, Storybook.

## Перед любой задачей по UI

Загрузи скилл **design-tokens** (`.claude/skills/design-tokens/SKILL.md`) и следуй ему. Это касается токенов, компонентов, Figma и историй Storybook.

## Неизменные правила

- В компонентах только семантические токены из `.claude/skills/design-tokens/references/token-catalog.md` и шкалы Tailwind. Нет hex/rgb, палитры (`bg-blue-500`), произвольных значений (`p-[13px]`), `dark:`, прозрачности вместо состояний (`bg-primary/90`).
- Пары поверхность/контент: `bg-X` + `text-on-X`.
- `src/styles/tokens.css` генерируется: правим Figma → экспорт → `npm run tokens:build`.
- Новый глобальный токен или новый бренд — только после согласования с человеком.
- Новую npm-зависимость можно ставить без согласования, но в отчёте по задаче указывать: название, лицензию, зачем нужна.
- Объекты в Figma, созданные не агентом, не удаляем и не переписываем без вопроса — даже если они мешают пересборке и выглядят как черновик. Перед любой чисткой страницы сверяем её состав и спрашиваем про чужое.

## Команды

| Команда | Что делает |
|---|---|
| `npm run tokens:build` | `tokens/tokens.json` → `src/styles/tokens.css` |
| `npm run tokens:catalog` | то же + обновляет каталог токенов в скилле |
| `npm run tokens:check` | линтер компонентов на «не-токены», должен давать 0 ошибок |
| `npm run tokens:contrast` | WCAG и APCA для пар `X` / `on-X` во всех состояниях × 4 комбинации |
| `npm run storybook` | Storybook на :6006, тулбар Brand (main/demo) × Theme (light/dark) |
| `npm run visual` | снимки историй в 4 комбинациях бренд × тема → `visual.local/` |
| `npm run icons:stroke` | толщина линии иконок lucide-react в настоящем Chrome |
| `npm run figma:diff` | цифровая сверка Figma ↔ `getComputedStyle` в 4 комбинациях |
| `npm run figma:layout` | раскладка страницы Components по снимку `figma/layout.json` |
| `npm run verify` | tokens:check + tokens:contrast + figma:diff + figma:layout |

## Бренды

| Бренд | `data-brand` | Primary | Secondary | Шрифт | Радиусы |
|---|---|---|---|---|---|
| Main | `main` (по умолчанию) | синий (blue) | фиолетовый (violet) | Inter | мягкие (8px lg) |
| Demo | `demo` | бирюзовый (teal) | оранжевый (orange) | IBM Plex Sans / Serif | строгие (4px lg) |

Demo нужен, чтобы проверять white-label: если компонент не перекрасился при переключении — в нём нет токена.

## Порядок работы над компонентом

Figma component set → код (shadcn + токены) → истории (`Default`, `Variants`, `States`, `BrandMatrix`) → `npm run tokens:check` и `npm run tokens:contrast` (оба по нулю ошибок) → сверка скриншота Figma со Storybook. Подробно — в скилле.

## Стиль отчёта

Коротко: что сделано, какие файлы, какие токены добавлены или нужны, что проверить человеку.
