# shadcn/ui → токены ds

Компоненты ставим CLI (`npx shadcn@latest add <name>`), затем переписываем классы. Линтер `check-tokens.mjs` находит всё, что осталось от shadcn, и подсказывает замену.

## Замена токенов

| shadcn | ds | Комментарий |
|---|---|---|
| `background` / `foreground` | `surface` / `on-surface` | |
| `card` / `card-foreground` | `surface-raised` / `on-surface-raised` | |
| `popover` / `popover-foreground` | `surface-overlay` / `on-surface-overlay` | меню, поповеры, диалоги |
| `primary` / `primary-foreground` | `primary` / `on-primary` | + `primary-hover`, `primary-pressed` |
| **`secondary` / `secondary-foreground`** | **`neutral` / `on-neutral`** | ⚠ у shadcn secondary серый. Наш `secondary` — второй цвет бренда. Меняй secondary → neutral **первым**, до добавления нашего secondary |
| `muted` | `surface-muted` | |
| `muted-foreground` | `on-surface-muted` | вторичный текст на любой поверхности |
| `accent` / `accent-foreground` | `surface-hover` / `on-surface-hover` | hover/selected в меню, ghost, строки таблиц |
| `destructive` (+ `text-white`) | `danger` / `on-danger` | + `danger-hover`, `danger-pressed`, `danger-subtle` |
| `border` | `border` | класс `border-border` |
| `input` (как обводка) | `border-input` | класс `border-border-input` |
| `bg-input` (трек switch, dark-фон полей) | `bg-border-input` или `bg-surface-muted` | по Figma |
| `ring` | `focus-ring` | `focus-visible:ring-2 focus-visible:ring-focus-ring` |
| `chart-1…5` | `dataviz-1…5` | |
| `sidebar*` | `sidebar-surface`, `sidebar-on-surface`, `sidebar-primary`, `sidebar-on-primary`, `sidebar-hover`, `sidebar-on-hover`, `sidebar-border`, `sidebar-focus-ring` | слой Component |
| `bg-black/50`, `bg-black/80` | `bg-scrim` | оверлеи Dialog, Sheet, Drawer, Alert Dialog |
| `--radius` | `radius-sm…xl` из Brand | `rounded-md` и т.п. работают как раньше, значения от бренда |

Что ещё убрать при переносе:
- все `dark:` → значения уже в токенах (часто `dark:bg-input/30`, `dark:bg-destructive/60`, `dark:aria-invalid:…`);
- `hover:bg-primary/90` и любые `/NN` на токенах → токены состояний;
- `disabled:opacity-50` → `disabled:bg-disabled disabled:text-on-disabled` (для контролов без заливки, например ghost/link, — `disabled:text-on-disabled`);
- `aria-invalid:border-destructive aria-invalid:ring-destructive/20` → `aria-invalid:border-danger aria-invalid:ring-danger-subtle`;
- `focus-visible:ring-[3px] ring-ring/50` → `focus-visible:ring-2 focus-visible:ring-focus-ring` (без произвольных значений).

Произвольные значения с переменными Radix/Base UI (`h-(--radix-select-trigger-height)`, `w-[var(--anchor-width)]`) разрешены — это не дизайн-решения.

## Кнопка: варианты

| shadcn `variant` | ds `variant` | Классы |
|---|---|---|
| `default` | `primary` | `bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed` |
| — | `secondary` (новый, бренд) | `bg-secondary text-on-secondary hover:bg-secondary-hover active:bg-secondary-pressed` |
| `secondary` | `neutral` | `bg-neutral text-on-neutral hover:bg-neutral-hover active:bg-neutral-pressed` |
| `outline` | `outline` | `border border-border bg-surface hover:bg-surface-hover hover:text-on-surface-hover` |
| `ghost` | `ghost` | `hover:bg-surface-hover hover:text-on-surface-hover` |
| `destructive` | `danger` | `bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-pressed` |
| `link` | `link` | `text-link hover:text-link-hover underline-offset-4 hover:underline` |

Размеры: `default` → `md`; `sm`, `lg`, `icon`, `icon-sm`, `icon-lg` без изменений. Те же имена вариантов используются в Badge, Toggle, Alert и т.д., где они есть.

## Все компоненты shadcn и порядок переноса

Порядок важен: каждый следующий слой собирается из предыдущего. Сверяй список с https://ui.shadcn.com/docs/components — там могут появиться новые.

| # | Группа | Компоненты | Ключевые токены |
|---|---|---|---|
| 1 | Базовые контролы | Button, Label, Input, Textarea, Checkbox, Radio Group, Switch, Badge, Separator, Kbd, Spinner, Skeleton | primary/secondary/neutral/danger + states, `border-input`, `focus-ring`, `disabled`, `surface-muted` |
| 2 | Составные контролы | Field, Input Group, Input OTP, Native Select, Select, Toggle, Toggle Group, Button Group, Slider, Progress | то же + `surface-overlay` (Select), `surface-hover` (Toggle on) |
| 3 | Контент и раскладка | Card, Alert, Avatar, Empty, Item, Typography, Table, Tabs, Accordion, Collapsible, Breadcrumb, Pagination, Aspect Ratio, Scroll Area, Resizable, Direction | `surface-raised`, `*-subtle`/`on-*-subtle` (Alert), `on-surface-muted`, `border`, `typo-*` |
| 4 | Оверлеи | Tooltip, Popover, Hover Card, Dropdown Menu, Context Menu, Menubar, Navigation Menu, Dialog, Alert Dialog, Sheet, Drawer, Command, Toast | `surface-overlay`, `scrim`, `surface-hover`, тени `shadow-*` |
| 5 | Сложные | Combobox, Calendar, Date Picker, Data Table, Carousel, Chart, Sidebar | `primary` (выбранная дата), `dataviz-*`, слой Component `sidebar/*` |
| 6 | Чат / AI | Message, Bubble, Message Scroller, Attachment, Marker, Questionnaire | `surface-raised`, `primary` (своё сообщение), `on-surface-muted` |

Alert (feedback): варианты `info`, `success`, `warning`, `danger` → `bg-<x>-subtle text-on-<x>-subtle border-<…>`; если нужна обводка своего цвета — добавь локальный токен `alert/<x>/border` (слой Component), не используй примитив.

Для каждого компонента: Figma component set → код → истории → `tokens:check` (см. Definition of done в `code.md`). Если компоненту нужен токен, которого нет, — правило 8 из SKILL.md.
