---
name: design-tokens
description: Используй при любой работе с дизайн-системой ds — создании или изменении токенов (Figma Variables, tokens.json, tokens.css, тема Tailwind), компонентов в Figma или в коде (React + shadcn/ui), историй Storybook, а также при переносе компонента из Figma в код. Все цвета, отступы, шрифты, радиусы и тени — только через токены.
---

# Дизайн-токены ds: Figma → tokens.json → Tailwind → Storybook

Мультибрендовая (white-label) система со светлой и тёмной темой. Источник правды — **Figma Variables**.
Логика имён — статья N. Curtis «Naming Tokens in Design Systems», адаптированная под Figma и Tailwind v4 (см. `references/naming.md`).
Компоненты — набор shadcn/ui, переписанный на наши токены (см. `references/shadcn-mapping.md`).

## Золотые правила (нарушение = задача не выполнена)

1. **Компонент использует только семантические токены** (слой Theme или Component). Никаких hex/rgb/oklch, никакой палитры Tailwind (`bg-blue-500`), никаких произвольных значений (`w-[123px]`, `text-[13px]`).
2. **Никаких `dark:` и проверок бренда в компонентах.** Тема и бренд переключаются заменой значений токенов, а не классами.
3. **Состояния — отдельные токены, а не прозрачность.** `hover:bg-primary-hover`, `active:bg-primary-pressed`. Не `bg-primary/90`, не `disabled:opacity-50`.
4. **Контент на поверхности — токен с префиксом `on-`:** `bg-primary text-on-primary`, `bg-surface-raised text-on-surface-raised`.
5. **Disabled и focus общие для всех контролов:** `disabled:bg-disabled disabled:text-on-disabled`, `focus-visible:ring-2 focus-visible:ring-focus-ring`.
6. **Отступы и размеры — шкала Tailwind** (`p-4` = 16px, шаг 4px). В Figma — переменные `spacing/*` с теми же числами.
7. **Текст — стили `typo-*`** (`typo-heading-1`, `typo-body-md`, `typo-label-md`…), 1:1 с текстовыми стилями Figma. Допустимы `text-xs…text-6xl` + `font-medium` и т.п. внутри компонентов, если нужен только размер.
8. **Нет нужного токена → не выдумывай значение.** Сначала локальный токен компонента (слой Component, `<component>/<name>`); когда он нужен 3+ компонентам — повышай в Theme. Новый токен сначала появляется в Figma, затем экспорт и сборка (раздел «Как добавить токен»).
9. **CSS токенов генерируется**, руками `tokens.css` не правим.

## Архитектура: 4 слоя = 4 коллекции Figma

| Слой | Коллекция Figma | Режимы | В коде | Кто использует |
|---|---|---|---|---|
| 1. Primitives | `Primitives` (скрыта из публикации, scopes пустые) | — | `--ds-color-blue-600` | только слой Brand/Theme |
| 2. Brand | `Brand` | `Main` (синий + фиолетовый), `Demo` (бирюзовый + оранжевый) | `[data-brand="main"]` | только слой Theme |
| 3. Theme | `Theme` | `Light`, `Dark` | `:root` / `.dark` | **компоненты** |
| 4. Component | `Component` | — (алиасы на Theme) | `--ds-sidebar-surface` | **один компонент или группа** |

Полный список токенов: `references/token-catalog.md` (сгенерирован, всегда сверяйся с ним).

## Как одно имя живёт в трёх местах

| Figma variable | CSS-переменная | Класс Tailwind |
|---|---|---|
| `color/primary/default` | `--ds-color-primary` | `bg-primary` |
| `color/primary/hover` | `--ds-color-primary-hover` | `hover:bg-primary-hover` |
| `color/on-primary` | `--ds-color-on-primary` | `text-on-primary` |
| `color/border/input` | `--ds-color-border-input` | `border-border-input` |
| `sidebar/hover` | `--ds-sidebar-hover` | `bg-sidebar-hover` |
| text style `heading/1` | — | `typo-heading-1` |

Правила перевода: `/` → `-`; хвост `/default` отбрасывается (в Figma явный, в коде усечённый); префикс `ds` есть у CSS-переменных и code syntax в Figma, но **не у классов** (так shadcn-компоненты переносятся без префиксов в каждом классе); категория `color-` в классе отбрасывается, потому что её уже называет утилита (`bg-`, `text-`, `border-`).

## Порядок работы (pipeline)

1. **Токены в Figma.** Пустой файл → создай коллекции из `assets/tokens.seed.json` скриптом `assets/figma-import.js`. Подробно: `references/figma.md`.
2. **Экспорт.** `assets/figma-export.js` через Figma MCP → сохрани результат в `tokens/tokens.json`.
3. **Сборка.** `npm run tokens:build` → `src/styles/tokens.css` (+ `references/token-catalog.md`, если нужно обновить каталог).
4. **Компонент в Figma.** Component set с теми же свойствами, что у кода (`variant`, `size`, `state`), все заливки/обводки/отступы/радиусы/текст привязаны к переменным и стилям. Подробно: `references/figma.md` → «Компоненты».
5. **Компонент в коде.** `npx shadcn@latest add <name>` → перепиши классы по `references/shadcn-mapping.md` → правила выше.
6. **История в Storybook.** Все варианты × состояния; проверка в 4 комбинациях бренд × тема через тулбар. Подробно: `references/code.md`.
7. **Проверка.** `npm run tokens:check` → 0 ошибок и `npm run tokens:contrast` → 0 ошибок (предупреждения APCA читаем, но они не блокируют). Сравни скриншот Figma (Figma MCP `get_screenshot`) с историей Storybook.
8. **Готово**, только если пункты 4–7 выполнены. Отчитайся одним абзацем: что сделано, какие токены добавлены (если были).

Пример всего цикла на кнопке: `examples/button.md`.

## Как добавить токен

1. Реши уровень по статье: нужен одному компоненту → `Component` (`<component>/<name>`); 3+ компонентам → `Theme` (`color/<concept>/<variant>`). Не глобализируй преждевременно.
2. Собери имя по формуле `[object/] category / concept / [variant] / [state]` (`references/naming.md`). Проверь, что такого смысла ещё нет под другим именем.
3. Добавь переменную в Figma (значения во **всех** режимах, только алиасы на нижний слой, scope и code syntax).
4. Экспорт → сборка → используй класс. Упомяни новый токен в отчёте.

## Когда спрашивать человека

- Нужен новый **глобальный** (Theme) токен или новый бренд.
- Дизайн в Figma противоречит правилам (например, hex вместо переменной, прозрачность вместо hover-токена) — покажи место и предложи токен, не исправляй молча.
- В режимах получился плохой контраст текста (`on-*` к своей поверхности ниже 4.5:1).

## Справочники

- `references/naming.md` — уровни имени по статье, наши решения и отступления от неё.
- `references/token-catalog.md` — все семантические токены, значения по режимам (генерируется).
- `references/figma.md` — коллекции, режимы, scopes, code syntax, текстовые стили, импорт/экспорт, правила сборки компонентов, «Ловушки Figma».
- `references/code.md` — структура проекта, Tailwind v4, Storybook (бренд/тема в тулбаре), npm-скрипты.
- `references/shadcn-mapping.md` — замена токенов shadcn на наши, варианты кнопок, список всех компонентов и порядок переноса.
- `examples/button.md` — эталон: Figma → код → история.
