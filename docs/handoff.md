# Handoff: документация компонентов

Текущее состояние на 2026-10-20. Вся история до этой даты — в `docs/handoff-archive.md`
(переносится без изменений). **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец — историю/находки/разборы вести в архиве или в самом PR, сюда идёт только
актуальный срез.

## Ветка / PR

PR #6 (`docs/batch-4` → `main`, https://github.com/Vadim27Diz/inta-1.0/pull/6) открыт — батч 4,
последний из запланированных. Chromatic build #26 — зелёный, 0 визуальных изменений (см.
«Chromatic» ниже). В процессе документирования доступности Item/ItemGroup найден реальный пробел
(`role="list"` без `role="listitem"`) — по решению человека исправлен тут же, в этом PR: `Item`
теперь сам проставляет `role="listitem"`, отдельным коммитом `Fix: Item — role="listitem"...`.
Ждём ревью.

Ветки `docs/component-guidelines`, `docs/batch-2`, `docs/batch-3` не удаляются, но не используются
для новых батчей.

## Готово (31 из 31) — документация всех текущих компонентов набора завершена

Button, Alert, Native Select — пилот. Input, Textarea, Checkbox, Switch, Radio Group, Select,
Field, Input Group — батч 1. Input OTP, Toggle, Toggle Group, Button Group, Slider, Progress,
Label, Kbd — батч 2. Card, Empty, Badge, Avatar, Typography, Separator, Skeleton, Aspect Ratio —
батч 3. Breadcrumb, Collapsible, Item, Spinner — батч 4 (PR #6, см. выше).

Новых батчей документации сейчас не запланировано. Если группа 3 (ниже, «Параллельно») добавит в
`main` новые компоненты (Table, Tabs, Accordion, Pagination, Scroll Area, Resizable, Direction) —
на них понадобится отдельный батч документации, по этому же формату.

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
  стали `variants`. Та же логика для Skeleton («одна плашка» / «составной паттерн») и в батче 4 для
  Spinner (`size` — не проп, а произвольный className size-3…size-8 из его story Variants).
- Если у компонента вообще нет содержательных состояний (например, Kbd — статичный типографский
  элемент без Radix и своего состояния) — `states: []` и секция `<DocsStates>`/`<Canvas>` States в
  `.mdx` просто не рендерятся (компонент возвращает `null` на пустом массиве); это нормально, не
  ошибка формата. То же для `variants: []`, если у компонента нет и story Variants.
- Новый случай из батча 4: у Breadcrumb и Collapsible есть только story **Default** — ни Variants,
  ни States. У обоих при этом реально есть содержательная ось (у Breadcrumb — hover/focus
  BreadcrumbLink; у Collapsible — open/closed), но раз её не показывает ни одна story — не
  изобретаем, `variants: []`/`states: []`, а пробел зафиксирован в `openQuestions` каждого файла
  (нужна ли отдельная story States). Это отличается от «нет состояний вовсе» (Kbd/Aspect Ratio) —
  там пустой массив корректен по смыслу компонента, а не из-за дырки в покрытии stories.
- `.mdx` никогда не ссылается на `Canvas of={...Stories.Content}` или `...BrandMatrix` — эти две
  story не часть стандартного рендера страницы (подтверждено во всех `.mdx` батчей 1–4), только
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
  (`data-[state=checked]:bg-primary`) — см. `switch.docs.ts`/`radio-group.docs.ts`. Упоминать
  bracket-нотацию Radix-атрибутов в прозе без завершающего класса (`data-[state=on]`) — тоже падает,
  писать словами («атрибут data-state со значением “on”»).
- **Каждое утверждение в «Доступности» вида «автоматически / из коробки» сверять с кодом нашей
  обёртки, а не с документацией Radix/shadcn.** Обёртка может ломать то, что у примитива работает
  из коробки — пример: `progress.docs.ts` утверждал, что скринридер объявляет `aria-valuenow`
  автоматически, но `progress.tsx` не передавал `value` в `ProgressPrimitive.Root` (батч 2, ревью
  со стороны). Для Radix-примитивов без своей обёртки-логики читаем код самого `@radix-ui/*` пакета
  в `node_modules`, а не по памяти о поведении Radix — так в батче 3 (Avatar, Separator,
  AspectRatio) и в батче 4 (Collapsible — пробовали `@radix-ui/react-collapsible/dist/index.mjs`:
  trigger — нативный `<button>` с `aria-expanded`/`aria-controls`, content — `hidden` при закрытии).
  Накопленные находки: CardTitle/EmptyTitle/CardDescription/EmptyDescription — `<div>`, не
  `<h*>`/`<p>` (осознанно); Badge и BreadcrumbLink не имеют своего focus-visible кольца (в отличие
  от Button/Item) — для интерактивного использования добавлять вручную; Skeleton не проставляет
  `aria-busy`/`role="status"` сам; Separator/Avatar — роль `none`/`separator` зависит от
  `decorative`, `AvatarFallback` рендерится немедленно без `delayMs`.
  **Новое в батче 4**: `aria-hidden="true"` на родителе выключает из дерева доступности вообще всех
  потомков, включая их собственный `sr-only`-текст — у `BreadcrumbEllipsis` это буквально стирает
  скрытый текст «More» (сам элемент и так `aria-hidden`). Проверять это сочетание отдельно, когда
  decorative-обёртка (`role="presentation"`/`aria-hidden`) содержит вложенный sr-only-текст «для
  скринридера» — такой текст в реальности никуда не доходит. Также нашли `role="list"` без
  `role="listitem"` на детях (`ItemGroup`/`Item`) — наполовину выполненный ARIA-паттерн, в отличие
  от корректной пары в `ComponentDocsPage.tsx` → `DocsRelated`; в этот раз (в отличие от Progress в
  батче 2) человек решил чинить сразу в этом же PR — см. «Ветка / PR» выше.

## Бэклог

- **Slider**: нужна поддержка `aria-labelledby` у бегунка, не только инлайн `thumbLabel`/`aria-label`.
  Решить, принимать оба способа одновременно или только один — до реализации.
- **Field**: `FieldError` не связывается с полем через `aria-describedby` автоматически — сейчас это
  явно задокументированная ручная обязанность потребителя; автосвязка через `useId` возможна позже.
- **Skeleton**: нет встроенного `aria-busy`/`role="status"` — задокументировано как обязанность
  оборачивающего. Возможный необязательный проп `label`, рендерящий это самостоятельно — решить, не
  усложнит ли это текущий «один div» компонент без веской причины.
- **Badge**: `badgeVariants` не включает `focus-visible` классы — при `asChild` добавлять вручную.
  Возможное решение — добавить `focus-visible:outline-*` в базовые классы (безвредно для
  неинтерактивного `<span>`).
- **BreadcrumbLink** (найдено в батче 4): нет явного `focus-visible:outline-*`, как у Button/Item —
  виден только нативный браузерный фокус поверх общего `outline-focus-ring/50`. Решить, нужно ли
  выравнять с явным кольцом фокуса остальных интерактивных компонентов, или нативного достаточно —
  неочевидно без проверки в реальном браузере/скринридере, не только по коду.
- **BreadcrumbEllipsis** (найдено в батче 4): чисто декоративный (`aria-hidden`, без `asChild`).
  Решить, станет ли он рабочим триггером показа скрытых уровней (например, через DropdownMenu) — и
  если да, как убрать `aria-hidden`/`role="presentation"` только для интерактивного случая.
- **Spinner внутри Button** (найдено в батче 4): когда рядом с Spinner есть видимый текст с тем же
  смыслом («Загрузка…»), его собственный `aria-label` дублирует объявление в вычисляемом accessible
  name кнопки. Задокументировано решение на стороне потребителя (`aria-hidden="true"` на Spinner в
  этом случае) — не меняли код; решить, не стоит ли сделать это поведением по умолчанию внутри
  самого Button, когда Spinner передан как children рядом с текстом.
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

Батч 3 (PR #5, смёржен, https://github.com/Vadim27Diz/inta-1.0/pull/5) — build #20:
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=20 — 137 историй, 0
визуальных изменений. Preview: https://6ad4a76c23be4704dc8eca20-priresoeng.chromatic.com/

Батч 4 (PR #6, https://github.com/Vadim27Diz/inta-1.0/pull/6, открыт) — build #26 (до правки
`role="listitem"`, 137 историй, 0 изменений), затем build #27 (после коммита
`Fix: Item — role="listitem"`):
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=27 — 137 историй, 0
визуальных изменений (подтверждено: ARIA-атрибут не влияет на пиксели). Preview:
https://6ad4a76c23be4704dc8eca20-rguuqchjsi.chromatic.com/
