# Handoff: документация компонентов

Текущее состояние на 2026-10-20. Вся история до этой даты — в `docs/handoff-archive.md`
(переносится без изменений). **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец — историю/находки/разборы вести в архиве или в самом PR, сюда идёт только
актуальный срез.

## Ветка / PR

Батч 3 — ветка `docs/batch-3` от свежего `main` (после мёржа PR #4). PR #5
(https://github.com/Vadim27Diz/inta-1.0/pull/5) открыт, ждём Chromatic и ревью. Ветки
`docs/component-guidelines`, `docs/batch-2` не удаляются, но не используются для новых батчей.
Каждый следующий батч — новая ветка от `main` со своим PR.

## Готово (27 из 31)

Button, Alert, Native Select — пилот. Input, Textarea, Checkbox, Switch, Radio Group, Select,
Field, Input Group — батч 1. Input OTP, Toggle, Toggle Group, Button Group, Slider, Progress,
Label, Kbd — батч 2. Card, Empty, Badge, Avatar, Typography, Separator, Skeleton, Aspect Ratio —
батч 3.

## Осталось (4) — один батч

| Батч | Компоненты |
|---|---|
| 4 — навигация и прочее | Breadcrumb, Collapsible, Item, Spinner |

## Формат страницы (образцы: `button.docs.ts`/`.mdx`, `select.docs.ts`, `field.docs.ts`)

- 8 фиксированных секций + `variantGuidance`/`forDevelopers` вне нумерации — см. `src/docs/types.ts`.
- Один `<component>.docs.ts` на компонент, рендер через `ComponentDocsPage.tsx` + тонкий `.mdx`.
- Тон — для дизайнера/продакта (без классов/токенов/data-slot/Radix) всюду, кроме `forDevelopers`.
- Варианты/состояния — только то, что реально есть в `cva()`/stories: что показывает story
  **Variants** → поле `variants`, что показывает **States** → `states`. Если у компонента нет
  `variant`/`size`, но есть содержательная ось (например, checked/unchecked у Checkbox — ровно то,
  что в его story Variants) — она тоже идёт в `variants`.
- `variants`/`states` не обязаны быть завязаны на `cva()` — источник это то, что показывает story.
  Прецедент из батча 2 (Kbd: «одна клавиша» / «сочетание», без единого cva) расширен в батче 3 на
  компоненты без единого prop-а вовсе: у Card нет `variant`, но его story **Variants** показывает
  4 содержательных композиции слотов (минимальный набор / с Action / с Footer / с Media) — они и
  стали `variants`. Та же логика для Skeleton («одна плашка» / «составной паттерн»).
- Если у компонента вообще нет содержательных состояний (например, Kbd — статичный типографский
  элемент без Radix и своего состояния) — `states: []` и секция `<DocsStates>`/`<Canvas>` States в
  `.mdx` просто не рендерятся (компонент возвращает `null` на пустом массиве); это нормально, не
  ошибка формата. То же для `variants: []`, если у компонента нет и story Variants (Aspect Ratio —
  единственный такой случай во всём наборе на сейчас: только story Default).
- `.mdx` никогда не ссылается на `Canvas of={...Stories.Content}` или `...BrandMatrix` — эти две
  story не часть стандартного рендера страницы (подтверждено во всех `.mdx` батчей 1–3), только
  `Default`, `Variants` (+ доп. `Canvas`, если иллюстрирует `variantGuidance`) и `States`.
- Доп. `<Canvas>` сверх стандартного набора — разрешён, если иллюстрирует правило из
  `variantGuidance` (пример: `select.mdx` → `<Canvas of={SelectStories.IndicatorSide} />` под
  текстом про выбор стороны чекмарка).
- Ничего не выдумывать: неочевидные решения — в `openQuestions`, решённые — утверждением в тексте,
  не вопросом.
- RU — «скринридер»; EN — обычный технический английский, не дословный перевод.

## Известные грабли

- `npm run tokens:check` сканирует весь `src/components`, включая прозу в `.docs.ts`, а не только
  `.tsx`. Два `data-[state=…]` подряд, соединённые без завершающего `:utility` (например,
  `data-[state=checked]/data-[state=indeterminate]`), читаются линтером как один произвольный
  Tailwind-класс и падают. Писать так, чтобы каждое выражение заканчивалось реальным классом
  (`data-[state=checked]:bg-primary`) — см. `switch.docs.ts`/`radio-group.docs.ts`.
- Тот же линтер падает и на одиночное упоминание атрибута в скобочной нотации без утилити-суффикса
  (`data-[state=on]`) — встретилось в батче 2 при описании Toggle. Если нужно упомянуть
  Radix-атрибут в прозе `forDevelopers`, пишите его словами («атрибут data-state со значением
  “on”»), не в синтаксисе Tailwind-селектора.
- **Каждое утверждение в «Доступности» вида «автоматически / из коробки» сверять с кодом нашей
  обёртки, а не с документацией Radix/shadcn.** Обёртка может ломать то, что у примитива работает
  из коробки — пример: `progress.docs.ts` утверждал, что скринридер объявляет `aria-valuenow`
  автоматически, но `progress.tsx` не передавал `value` в `ProgressPrimitive.Root`, и у Radix
  получалось `value=null` (indeterminate) при любом заполнении. Найдено в батче 2 (Progress),
  ревью со стороны. В батче 3 проверка велась так же — читали сам `.tsx` каждого компонента и (для
  Radix-примитивов без своей обёртки-логики — Avatar, Separator, AspectRatio) код самого
  `@radix-ui/*` пакета в `node_modules`, а не по памяти о поведении Radix. Накопленные находки:
  CardTitle/EmptyTitle/CardDescription/EmptyDescription — `<div>`, не `<h*>`/`<p>` (уровень
  заголовка карточки зависит от места на странице, решение осознанное, не баг); Badge не имеет
  своего focus-visible кольца (в отличие от Button) — для интерактивного `asChild` его нужно
  добавлять вручную; Skeleton не проставляет `aria-busy`/`role="status"` сам; Separator и Avatar
  проверены прямым чтением `@radix-ui/react-separator`/`react-avatar` в `node_modules` (роль
  `none`/`separator` у Separator зависит от `decorative`, `AvatarFallback` рендерится немедленно,
  если `delayMs` не передан).

## Бэклог

- **Slider**: сейчас доступное имя бегунка — только строковый проп `thumbLabel` (→ `aria-label`).
  Добавить поддержку `aria-labelledby` — ссылку на id видимой подписи рядом со Slider, а не только
  инлайн-текст. Нужно решить, принимать ли оба варианта одновременно (как у большинства полей:
  `thumbLabel`/`aria-label` для одного, `aria-labelledby` как альтернатива) или только один из
  них на бегунок — зафиксировать перед реализацией.
- **Field**: `FieldError` не связывается с полем через `aria-describedby` автоматически — сейчас
  это явно задокументировано как ручная обязанность потребителя. Улучшение кода (автосвязка через
  `useId`) возможно позже, вне этого PR.
- **Skeleton**: нет встроенного `aria-busy`/`role="status"` — сейчас это задокументировано как
  обязанность того, кто оборачивает группу Skeleton. Возможное улучшение — необязательный проп
  (например, `label`), который сам рендерит visually-hidden текст и `role="status"` на обёртке;
  нужно решить, не усложнит ли это текущий «один div» компонент без веской причины.
  Найдено в батче 3 при проверке доступности.
- **Badge**: `badgeVariants` не включает `focus-visible` классы (в отличие от `buttonVariants`) —
  при интерактивном использовании через `asChild` кольцо фокуса нужно добавлять вручную на вызывающей
  стороне. Возможное улучшение — добавить `focus-visible:outline-*` прямо в базовые классы (они
  безвредны для неинтерактивного `<span>`, так как `outline` не появляется без фокуса). Найдено в
  батче 3 при проверке доступности.
- **Link** — отдельного компонента нет; see `button.docs.ts` → анатомия (asChild + `<a>` для
  переходов). **Toast/snackbar** — компонента нет, see `alert.docs.ts` → «Когда не использовать».

## Параллельно, не часть документации

Ветка `feat/group-3` (построение самих компонентов — Figma + код, не доки) смёржена в `main`
(PR #1): Typography, Avatar (+ Badge/Group/Count), Item, Card, Empty, Alert, Aspect Ratio,
Breadcrumb, Collapsible. Остаток группы 3 не начат: Table, Tabs, Accordion, Pagination, Scroll
Area, Resizable, Direction. Это отдельная задача со своим треком — не путать с батчами
документации выше (документация идёт по уже существующим в `main` компонентам).

## Chromatic

Батч 1 — build #8: https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=8 —
137 историй, 0 визуальных изменений.

Батч 2 (PR #4, смёржен) — build #15 (после 3 правок, см. архив):
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=15 — 137 историй, 0
визуальных изменений. Preview: https://6ad4a76c23be4704dc8eca20-oevxsxnzmz.chromatic.com/

Батч 3 (PR #5, https://github.com/Vadim27Diz/inta-1.0/pull/5, открыт) — build #20:
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=20 — 137 историй, 0
визуальных изменений (батч 3 добавляет только `.docs.ts`/`.mdx`, без новых `.stories.tsx` — число
историй не меняется, это ожидаемо). Preview: https://6ad4a76c23be4704dc8eca20-priresoeng.chromatic.com/
