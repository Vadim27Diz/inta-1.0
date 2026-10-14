# Именование токенов: статья → наши правила

Основа: Nathan Curtis, «Naming Tokens in Design Systems» (EightShapes, 2020).
Статья написана до Figma Variables и Tailwind v4, поэтому часть уровней мы переносим из имени в режимы.

## Уровни имени (по статье)

| Группа | Уровень | Пример | У нас |
|---|---|---|---|
| Namespace | system | `ds` | префикс CSS-переменных и code syntax Figma (`--ds-…`) |
| Namespace | theme / brand | `ocean` | **режим** коллекции `Brand` (Main, Demo), не часть имени |
| Namespace | domain | `retail` | не используем |
| Object | component | `sidebar`, `button` | слой `Component`: `sidebar/hover` |
| Object | element | `left-icon` | `input/left-icon/…` — только если реально нужно |
| Object | component group | `forms` | `forms/…` — когда токен нужен 3+ компонентам группы |
| Base | category | `color`, `spacing`, `radius`, `font`, `text` | первое слово в Figma |
| Base | concept | `feedback`, `action`, `dataviz` | у нас: `surface`, `primary`, `success`, `dataviz`, `link`… |
| Base | property | `background`, `text`, `border` | **не пишем** для заливок: свойство уже в классе (`bg-`, `text-`). Пишем только `border` |
| Modifier | variant | `primary`, `secondary`, `subtle` | `color/success/subtle` |
| Modifier | state | `hover`, `pressed` | `color/primary/hover`. Disabled и focus — общие токены |
| Modifier | scale | `100`, `2-x`, `s/m/l` | шкалы Tailwind: `spacing/4`, `text/sm`, `radius/md`, `color/blue/600` |
| Modifier | mode | `on-dark` | **режим** коллекции `Theme` (Light, Dark), не часть имени |

Порядок: `[object /] category / concept [/ variant] [/ state]`.
Примеры: `color/primary/hover`, `color/success/subtle`, `color/on-danger-subtle`, `sidebar/on-primary`.

## Наши решения (и почему)

1. **`on-` = контент на поверхности.** У Curtis `on-dark` означает режим. Режимы ушли в Figma modes, поэтому `on-` освободился и теперь означает «текст/иконка, которые лежат на этой заливке»: `primary` ↔ `on-primary`. Аналог `-foreground` у shadcn и `on*` у Material.
2. **Default: явный в Figma, усечённый в коде** (принцип «Explicit vs Truncated Defaults»). Figma не позволяет переменной и группе иметь одно имя, поэтому `color/primary/default` + `color/primary/hover`. В коде `/default` отбрасывается: `bg-primary`, `bg-primary-hover`.
3. **Свойство не дублируем классом** (принцип «Flexibility vs Specificity», выбираем короче): `color/primary`, а не `color/primary/background`. Исключение — `border/*` и `focus-ring`, у которых нет пары-заливки.
4. **Шкалы — как в Tailwind** (решение по уроку 3): отступы 4px-шаг (`spacing/4` = 16px = `p-4`), размеры шрифта `xs…6xl`, радиусы `sm…xl`. Пропорции `1-x` из статьи не используем.
5. **Нет омонимов.** `text` в Tailwind — и размер, и цвет. Поэтому текстовые стили названы `typo-*`, а цвет текста всегда `on-*` или `link`.
6. **Бренд и тема — режимы, а не namespace в имени** (принцип «Theme ≠ Mode» соблюдён: это две независимые коллекции).
7. **`primary` однозначен:** это главный цвет бренда. Иерархия текста — не `text-primary/secondary`, а `on-surface` / `on-surface-muted`.
8. **`danger` один на две роли** (полииерархия из статьи): кнопка удаления и фидбек об ошибке используют общий `color/danger/*`; у фидбека есть ещё `danger/subtle`.
9. **`secondary` = второй цвет бренда** (фиолетовый в Main). Серый вариант shadcn `secondary` у нас называется `neutral`.

## Принципы статьи, которые обязательны

- **Однородность внутри, разнородность между:** в концепт `success` кладём только успех; `dataviz` — только графики.
- **Полнота без избыточности:** только уровни, которые различают токены. Плохо: `button/radius/default/on-light`.
- **Начинай локально, потом повышай:** токен рождается в `Component`, переезжает в `Theme`, когда нужен 3+ компонентам. При переезде старый локальный токен удаляется или становится алиасом.
- **Не глобализируй преждевременно:** «может быть пригодится» — не причина для глобального токена.
- **Полииерархия через алиасы:** если смысл совпадает, а набор разный — второй токен ссылается на первый (`sidebar/primary` → `color/primary/default`).

## Найденные нестыковки статьи (для справки)

- Порядок уровней в примерах плавает: `font-heading-size-1` и `font-size-heading-level-1`.
- Object то в начале (`forms-color-border`), то после категории (`color-forms-text-metadata`). У нас object всегда первым.
- Шкалы смешаны: пропорции для отступов, футболки для текста и брейкпоинтов. У нас везде шкалы Tailwind.
- `error` одновременно вариант (`feedback-error`) и состояние. У нас `danger` — вариант, состояния только `hover`, `pressed` (+ общие `disabled`, `focus-ring`).
