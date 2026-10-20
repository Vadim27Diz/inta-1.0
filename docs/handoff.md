# Handoff: документация компонентов

Текущее состояние на 2026-10-20. Вся история до этой даты — в `docs/handoff-archive.md`
(переносится без изменений). **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец — историю/находки/разборы вести в архиве или в самом PR, сюда идёт только
актуальный срез.

## Ветка / PR

PR #6 (`docs/batch-4` → `main`, https://github.com/Vadim27Diz/inta-1.0/pull/6) открыт — батч 4,
последний из запланированных. Ревью со стороны после первой версии PR нашло 4 пункта, все
исправлены отдельными коммитами:

1. **Регрессия из первой версии этого же PR**: `role="listitem"` стоял на `Item` безусловно —
   при `asChild` Slot клал его прямо на `<a>`/`<button>` и перекрывал implicit-роль ссылки/кнопки
   (скринридер перестаёт объявлять её как ссылку), а `Item` вне `ItemGroup` получал `listitem` без
   родителя `list` (невалидный ARIA). Исправлено через `ItemGroupContext`: внутри группы без
   `asChild` — `role="listitem"` на себе; внутри группы с `asChild` — на обёртке `display:contents`
   вокруг Slot-рендера, сама ссылка/кнопка сохраняет свою роль; вне группы — без роли вовсе.
   Добавлена демонстрирующая строка (asChild-ссылка внутри `ItemGroup`) в story
   `Item/Content`. Проверено Playwright'ом по вычисленному accessibility-дереву (10 проверок: роль
   группы, роль обычного `Item`, тег и роль `<a>` не потеряны, `getByRole("link")` находит ссылку
   и внутри, и вне группы, обёртка `role="listitem"`+`display:contents`, количество listitem в
   группе, `Item` вне группы без роли) — все 10 прошли.
2. `BreadcrumbEllipsis` — `aria-hidden="true"` стоял на всём элементе и глушил вложенный sr-only
   текст «More»; убрали с контейнера, повесили на декоративную иконку — текст реально озвучивается.
3. `BreadcrumbLink` — добавлено собственное focus-visible кольцо (`outline-focus-ring`), тот же
   паттерн, что у Button/Item, вместо нативного браузерного фокуса.
4. Документация `Spinner`+`Button` (дублирующееся объявление) оставлена как есть по решению
   человека — не код, а ответственность потребителя (`aria-hidden` на `Spinner`).

`item.docs.ts`/`breadcrumb.docs.ts` обновлены под новое поведение. `npm run verify`, `npx tsc -b`,
`npm run build-storybook` — чисто. **Chromatic build #29 — ожидает подтверждения человеком**: 1
визуальное изменение, это ожидаемо — новая demo-строка в story `Item/Content` (пункт 1 выше), не
регрессия в существующих снимках; принять/отклонить нужно в самом Chromatic UI, не через код.

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
  `<h*>`/`<p>` (осознанно); Badge не имеет своего focus-visible кольца (в отличие от Button/Item) —
  для интерактивного использования добавлять вручную; Skeleton не проставляет
  `aria-busy`/`role="status"` сам; Separator/Avatar — роль `none`/`separator` зависит от
  `decorative`, `AvatarFallback` рендерится немедленно без `delayMs`.
  **Новое в батче 4**: `aria-hidden="true"` на родителе выключает из дерева доступности вообще всех
  потомков, включая их собственный `sr-only`-текст — у `BreadcrumbEllipsis` это буквально стирало
  скрытый текст «More» (сам элемент и так `aria-hidden`); исправлено (см. «Ветка / PR»). Проверять
  это сочетание отдельно, когда decorative-обёртка (`role="presentation"`/`aria-hidden`) содержит
  вложенный sr-only-текст «для скринридера» — такой текст в реальности никуда не доходит.
- **Фикс половинчатого ARIA-паттерна может сам внести новую регрессию — проверять фикс тем же
  способом, что и исходную находку, не только глазами.** В батче 4 нашли `role="list"` без
  `role="listitem"` на детях (`ItemGroup`/`Item`); первая версия фикса просто добавила
  `role="listitem"` на `Item` безусловно — и тут же сломала asChild (роль `listitem` перекрыла
  implicit-роль `<a>`/`<button>`) и создала новый невалидный ARIA у `Item` вне `ItemGroup`
  (`listitem` без родителя `list`). Нашло повторное ревью со стороны. Исправлено через контекст
  (`ItemGroupContext`, подробности — `item.docs.ts` → «Для разработчиков») и подтверждено
  Playwright-проверкой вычисленного accessibility-дерева (не только чтением кода) — именно такой
  тест и должен был быть у первой версии фикса.

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
- **BreadcrumbEllipsis** (найдено в батче 4): чисто декоративный (без `asChild`, без `onClick`) —
  это намеренно не менялось. Решить, станет ли он рабочим триггером показа скрытых уровней
  (например, через DropdownMenu) — и если да, как убрать `role="presentation"` только для
  интерактивного случая, не трогая декоративный. (`aria-hidden`, который глушил собственный
  sr-only-текст, уже исправлен — не часть этого пункта.)
- **Spinner внутри Button** (найдено в батче 4): когда рядом с Spinner есть видимый текст с тем же
  смыслом («Загрузка…»), его собственный `aria-label` дублирует объявление в вычисляемом accessible
  name кнопки. Решение зафиксировано в документации на стороне потребителя (`aria-hidden="true"` на
  Spinner в этом случае) — человек подтвердил не менять код; решить позже, не стоит ли сделать это
  поведением по умолчанию внутри самого Button, когда Spinner передан как children рядом с текстом.
- **Разнобой языка у захардкоженных подписей для скринридера** (найдено в батче 4, зафиксировано
  человеком после ревью): `Spinner` → `aria-label="Загрузка"` (RU); `Breadcrumb` →
  `aria-label="breadcrumb"` и `BreadcrumbEllipsis` → sr-only текст «More» (оба EN). После фикса
  `BreadcrumbEllipsis` текст «More» реально доходит до скринридера — несоответствие языка стало
  практически заметным, не только в коде. Решить единообразно вместе с i18n (сейчас в проекте нет
  механизма i18n для строк компонентов — только `Text`/`Locale` в самой документации, `src/docs`).
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

Батч 4 (PR #6, https://github.com/Vadim27Diz/inta-1.0/pull/6, открыт) — промежуточные build #26
(до правки `role="listitem"`, 0 изменений) и #27 (после той правки, тоже 0 — ARIA-атрибут не
влияет на пиксели). После 4 фиксов второго ревью — build #29 (0 принятых изменений, ещё не просмотрен), затем build
#30 (после коммита с этим файлом — тот же набор историй, то же изменение переносится как
ожидающее): https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=30 — **1
визуальное изменение, ожидает подтверждения человеком в Chromatic UI**. Изменение ожидаемое: новая
demo-строка (asChild-ссылка внутри `ItemGroup`) в story `Item/Content`, добавленная как цель
Playwright-проверки фикса `role="listitem"` — не регрессия в существующих снимках. Preview:
https://6ad4a76c23be4704dc8eca20-qbnrkcckqs.chromatic.com/
