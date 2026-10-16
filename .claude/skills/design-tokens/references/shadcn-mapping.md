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
- `focus-visible:ring-[3px] ring-ring/50` → `focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring`
  (зазор у `outline` прозрачный, в отличие от `ring`, которому нужен крашеный `ring-offset-*`).

Произвольные значения с переменными Radix/Base UI (`h-(--radix-select-trigger-height)`, `w-[var(--anchor-width)]`) разрешены — это не дизайн-решения.

## Кнопка: варианты

| shadcn `variant` | ds `variant` | Классы |
|---|---|---|
| `default` | `primary` | `bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed` |
| — | `secondary` (тональная primary) | `bg-primary-subtle text-on-primary-subtle hover:bg-primary-subtle-hover active:bg-primary-subtle-pressed` |
| `secondary` | `neutral` | `bg-neutral text-on-neutral hover:bg-neutral-hover active:bg-neutral-pressed` |
| `outline` | `outline` | `border border-border hover:bg-surface-hover hover:text-on-surface-hover` — без заливки, иначе на карточке появится заплатка цвета страницы |
| `ghost` | `ghost` | `hover:bg-surface-hover hover:text-on-surface-hover` |
| `destructive` | `danger` | `bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-pressed` |
| — | `danger-subtle` (мягкая destructive) | `bg-danger-subtle text-on-danger-subtle hover:bg-danger-subtle-hover active:bg-danger-subtle-pressed` |
| — | `inverse` | `bg-inverse text-on-inverse hover:bg-inverse-hover active:bg-inverse-pressed` |
| `link` | `link` | `text-link hover:text-link-hover` |
| — | `link-danger` | `text-link-danger hover:text-link-danger-hover` |

Подчёркивания у `link` нет ни в одном состоянии — почему, в `figma.md` → «Ловушки Figma», п. 5.
Когда брать `danger`, `danger-subtle` или `link-danger` — таблица в `examples/button.md`.

Размеры: `default` → `md`; `sm`, `lg`, `icon`, `icon-sm`, `icon-lg` без изменений. Те же имена вариантов используются в Badge, Toggle, Alert и т.д., где они есть.

## Поля ввода: Label, Input, Textarea

| Что | Решение | Почему |
|---|---|---|
| Фон поля | `bg-transparent` | `bg-surface` на карточке `surface-raised` выложил бы заплатку цвета страницы — та же причина, что у `outline`/`ghost` кнопки |
| Обводка | `border border-border-input`, hover нет | токена `border/input-hover` в системе нет, а выдумывать значение нельзя |
| Фокус | `focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring` | как у Button |
| Ошибка | `aria-invalid:border-danger` | красная только обводка; кольцо фокуса остаётся обычным `focus-ring`, иначе в состоянии «ошибка + фокус» два красных кольца спорят друг с другом |
| Disabled | `disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent disabled:placeholder:text-on-disabled` | не `opacity-50` |
| Placeholder | `placeholder:text-on-surface-muted` | |
| Размеры Input | `sm h-8 px-3 typo-body-sm`, `md h-9 px-4 typo-body-sm`, `lg h-10 px-4 typo-body-md` | высоты как у Button; кегль по шкале body, а не label — в поле лежит контент, а не подпись |
| Textarea | `min-h-16 px-3 py-2 typo-body-sm field-sizing-content` | растёт по содержимому |
| Label | `typo-label-md text-on-surface`, `required` → `<span aria-hidden>*</span>` с `text-on-surface-danger` | disabled приходит от контрола: `peer-disabled:` (поле-сосед) и `group-data-[disabled=true]:`; вариант `*:` красит и звёздочку, у неё свой цвет |

## Выборные контролы: Checkbox, Radio Group, Switch

| Что | Решение | Почему |
|---|---|---|
| Выбранное состояние | `enabled:data-[state=checked]:bg-primary` (и `border-primary`, `text-on-primary`) | без `enabled:` выбранное перебивает `disabled:`: у утилит Tailwind одинаковая специфичность, спор решает порядок в CSS, а не порядок в списке классов |
| Ошибка | `data-[state=unchecked]:aria-invalid:border-danger` | у выбранного контрола рамка остаётся `primary` — красная рамка вокруг уже выбранного пункта читается как «выбор неверен», хотя ошибка у группы. Так же собран и набор в Figma |
| Disabled | `disabled:bg-disabled disabled:border-transparent disabled:text-on-disabled`, точка радио — `group-disabled/radio:bg-on-disabled` | не `opacity-50` |
| Фокус | `focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring` | как у всех контролов |
| Область нажатия | `after:absolute after:-inset-x-2 after:-inset-y-2` | рамка остаётся 16×16, а палец попадает: это псевдоэлемент, а не увеличенный контрол |
| Checkbox | `size-4 rounded-sm`, галка и минус — `lucide-react` `size-3` (в Figma — `Icon Size=12`) | в наборе Icon нет 14, поэтому 12 и в коде, и в Figma |
| Radio | `size-4 rounded-full`, точка `size-2 bg-primary` | |
| Switch | дорожка `h-5 w-9 px-0.5 rounded-full`, бегунок `size-4 bg-on-primary`, ход `translate-x-0 → translate-x-4` | 36 − 4 (отступы) − 16 (бегунок) = 16, всё по шкале, без `translate-x-[calc(100%-2px)]` |
| Дорожка off | `bg-border-input` | `bg-surface-muted` неразличим на `surface`; `border-input` — единственный серый, который виден в обеих темах |

Размера `sm` у Switch нет: shadcn-овские `h-[18.4px]`/`w-[32px]` — произвольные значения, в шкалу не ложатся.

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
