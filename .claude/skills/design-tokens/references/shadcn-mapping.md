# shadcn/ui → токены ds

Компоненты ставим CLI (`npx shadcn@latest add <name>`), затем переписываем классы. Линтер `check-tokens.mjs` находит всё, что осталось от shadcn, и подсказывает замену.

Версии, с которыми сверены `data-*`-атрибуты ниже: `shadcn` CLI **4.21.5**, `radix-ui` **1.8.1**
(пакет-бандл, не отдельные `@radix-ui/react-*`). После `npx shadcn@latest add <name>` сверь
фактическую версию `radix-ui` в `package.json` с этой — другая мажорная/минорная версия может
поменять набор `data-*` (так и было: разметка CLI ожидала `data-checked`, а установленный Radix
отдавал `data-state=checked|unchecked|indeterminate` — см. «Выборные контролы» ниже). Если версия
разошлась — проверь атрибуты вручную (DevTools на смонтированном компоненте) прежде чем переносить
классы на `data-[...]`.

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

Произвольные значения с переменными Radix/Base UI (`h-(--radix-select-trigger-height)`, `w-[var(--anchor-width)]`) разрешены — это не дизайн-решения. `npm run tokens:check` явно пропускает `--radix-*`/`--anchor-*`, а любую другую `var(--x)`/`util-(--x)` сверяет с `tokens.css` — опечатка в имени токена (например, `--ds-color-primry`) теперь ловится линтером, а не глазами на скриншоте.

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

## Badge, Separator, Kbd, Spinner, Skeleton

Без состояний (не интерактивны) — истории `Default`/`Variants`/`Content`/`BrandMatrix`, без `States`.

- **Badge.** `variant`: `primary`/`secondary`/`neutral`/`outline`/`danger` — по аналогии с Button; плюс
  `danger-subtle`/`success`/`warning`/`info` — статусы на `*-subtle` токенах. У Button уже есть ровно
  такая же пара `danger`/`danger-subtle` (сплошной и приглушённый), поэтому статус «danger» — это
  variant `danger-subtle`, а не второй вариант с тем же именем `danger`. `success`/`warning`/`info`
  всегда приглушённые — непри глушённых аналогов `bg-success`/`bg-warning`/`bg-info` в Badge нет (они
  резервируются под Alert, группа 3). Форма — `rounded-full`, не токен. Текст — component property
  `Text` (дефолт «Badge», как у Button «Button»), общий на все 9 вариантов — реальное использование
  произвольное (`<Badge variant="success">3 new</Badge>`), поэтому не литерал, совпадающий с именем
  варианта. На ревью это было багом: каждый вариант нёс свой жёстко вшитый текст без привязки к
  свойству — нечем было управлять с инстанса, и `figma:layout` это теперь ловит (правило 10,
  «Раскладка страницы Components»).
- **Separator.** Единственный цвет — `border-border` (не `border-border-input`: это декоративная линия,
  а не обводка поля). Размер по `data-[orientation=…]` — `h-px w-full` / `h-full w-px`.
- **Kbd.** Не из Radix — обычный `<kbd>`. Текст — `typo-code` (`font/mono` = JetBrains Mono, **не** шрифт
  бренда Inter/IBM Plex Sans): при цифровой сверке (`figma-code-diff.mjs`) шрифт клавиши проверяется
  отдельно от общего допущения «шрифт = бренд», иначе ложное расхождение на каждой комбинации.
  Текст — component property `Text` (дефолт «K»). Ширина компонента — Hug, не Fixed: с зафиксированной
  шириной 20 более длинный текст («K+⌘») вылезал за рамку — тот же баг, что у Input/Textarea мог бы
  быть, не будь они намеренным исключением (см. правило 9 там же). Код уже был верным (`min-w-5`,
  без фиксированной ширины) — чинить пришлось только Figma.
- **Spinner.** Обёртка над `lucide-react` `LoaderCircle`, не над кастомным Icon-компонентом (иконки в
  проекте — всегда `lucide-react` напрямую). Вращение — `motion-safe:animate-spin`. Числовая проверка
  геометрии идёт с `reducedMotion: "reduce"` в Playwright: без этого `getBoundingClientRect()` ловит
  иконку в случайный момент вращения, и ось-выровненный прямоугольник повёрнутого квадрата оказывается
  больше исходного — ложное расхождение по `height`/`width`, не связанное с токенами.
- **Skeleton.** Прямоугольник `bg-surface-muted`, пульсация `motion-safe:animate-pulse`. В Figma оба —
  статичный кадр; анимация и `prefers-reduced-motion` проверяются только в коде/браузере, не в макете.

## Field, Input Group, Input OTP, Native Select, Select

- **Select.** `SelectContent` по умолчанию берёт `position="popper"` (не Radix-дефолт `item-aligned`) и
  не переопределяет `align` — так панель привязана к ширине/краю триггера
  (`min-w-(--radix-select-trigger-width)` на Viewport реально работает только в `popper`). С
  `item-aligned` панель выравнивалась по выделенному пункту и могла выступать за край поля — баг
  нашёлся и в коде, и в Figma на ревью.
- **Select / Item.** Пункт списка — отдельный компонент (variant `State`: default/highlighted/disabled;
  свойства `Text` TEXT и `Selected` BOOLEAN, чек-марк переключается видимостью дочернего инстанса, а не
  вариантом — так на 3 нарисованных варианта приходится 2×3=6 видимых комбинаций). Ширина — **Fill**
  внутри списка, не Hug: подсветка состояния должна тянуться на всю ширину панели
  (`npm run figma:layout`, правило «пункты списков — Fill»). Сейчас компонент локальный для Select. При
  переносе группы 4 (Dropdown Menu, Context Menu, Command) — сравнить их пункты с `Select / Item` и
  решить: выносить общую основу в `Menu / Item` (общий Figma-компонент + общий React-примитив) или
  оставить раздельными, если состояния/структура разойдутся сильнее, чем кажется сейчас.
- **Input OTP / Slot.** Та же логика, что у `Select / Item`: слот кода — отдельный компонент (variant
  `State`: default/active/invalid/disabled; свойства `Filled`/`Cursor` BOOLEAN, `Digit` TEXT). В отличие
  от Select-пункта, слот **фиксированной** ширины по дизайну (как поле ввода — см. `EXEMPT_FIXED_WIDTH`
  в `figma-layout-export.js`), поэтому к нему не применяется правило Fill.
- Оба компонента выше возникли из ловушки `figma:layout`: «повторяющиеся элементы внутри компонента
  (пункты списков, вкладки, ячейки) — экземпляры компонента, а не нарисованные слои» — до правки пункты
  Select и слоты Input OTP были нарисованы напрямую, без общего компонента.

## Card

- **CardMedia.** Не из upstream shadcn (там Card не предполагает отдельного media-слота, картинка просто
  кладётся в `CardContent` руками). Локальное расширение ds: `-mt-6 overflow-hidden rounded-t-xl`,
  изображение на всю ширину карточки заподлицо с верхними углами. Обсуждено и принято явно, не перенос
  из исходника.

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
