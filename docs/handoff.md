# Handoff: документация компонентов

Текущее состояние на 2026-10-20. Вся история до этой даты — в `docs/handoff-archive.md`
(переносится без изменений). **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец — историю/находки/разборы вести в архиве или в самом PR, сюда идёт только
актуальный срез.

## Ветка / PR

PR #4 (`docs/batch-2` → `main`) смёржен обычным merge commit
(https://github.com/Vadim27Diz/inta-1.0/pull/4) — батч 2 в `main`. Перед мёржем ревью сделал
человек со стороны (напрямую, не в PR-комментариях) и нашёл 3 правки, внесённые отдельными
коммитами до мёржа:

1. **Баг в коде.** `progress.tsx` не передавал `value` в `ProgressPrimitive.Root` (только в
   `transform` индикатора) — Radix получал `value=null`, корень был всегда
   `data-state="indeterminate"` без `aria-valuenow`, независимо от реального значения. Полоса
   закрашивалась визуально правильно, скринридер — нет. Исправлено; проверено Playwright по DOM
   собранного Storybook.
2. **Баг в коде.** `slider.tsx` — у `SliderPrimitive.Thumb` не было способа задать доступное имя.
   Добавлен проп `thumbLabel` (строка или массив из двух строк для диапазона) → `aria-label` на
   `Thumb` по индексу.
3. **Доки.** `input-otp.docs.ts` → «Когда не использовать»: убрана неверная причина (вставка кода
   целиком штатно поддерживается компонентом).

Ветки `docs/component-guidelines`, `docs/batch-2` не удаляются, но не используются для новых
батчей. Каждый следующий батч — новая ветка от `main` (`docs/batch-3`, `docs/batch-4`, …) со своим
PR.

## Готово (19 из 31)

Button, Alert, Native Select — пилот. Input, Textarea, Checkbox, Switch, Radio Group, Select,
Field, Input Group — батч 1. Input OTP, Toggle, Toggle Group, Button Group, Slider, Progress,
Label, Kbd — батч 2.

## Осталось (12), батчами по ~8 — PR на каждый батч отдельно

| Батч | Компоненты |
|---|---|
| 3 — контент и отображение | Card, Empty, Badge, Avatar, Typography, Separator, Skeleton, Aspect Ratio |
| 4 — навигация и прочее | Breadcrumb, Collapsible, Item, Spinner |

## Формат страницы (образцы: `button.docs.ts`/`.mdx`, `select.docs.ts`, `field.docs.ts`)

- 8 фиксированных секций + `variantGuidance`/`forDevelopers` вне нумерации — см. `src/docs/types.ts`.
- Один `<component>.docs.ts` на компонент, рендер через `ComponentDocsPage.tsx` + тонкий `.mdx`.
- Тон — для дизайнера/продакта (без классов/токенов/data-slot/Radix) всюду, кроме `forDevelopers`.
- Варианты/состояния — только то, что реально есть в `cva()`/stories: что показывает story
  **Variants** → поле `variants`, что показывает **States** → `states`. Если у компонента нет
  `variant`/`size`, но есть содержательная ось (например, checked/unchecked у Checkbox — ровно то,
  что в его story Variants) — она тоже идёт в `variants`.
- Если у компонента вообще нет содержательных состояний (например, Kbd — статичный типографский
  элемент без Radix и своего состояния) — `states: []` и секция `<DocsStates>`/`<Canvas>` States в
  `.mdx` просто не рендерятся (компонент возвращает `null` на пустом массиве); это нормально, не
  ошибка формата.
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
  получалось `value=null` (indeterminate) при любом заполнении. Доки были написаны по тому, как
  *должен* работать примитив, а не по тому, что реально рендерит наш код. Проверка — прочитать сам
  `<component>.tsx`, в сомнительных случаях — Playwright по DOM собранного Storybook, не полагаться
  на память о том, как ведёт себя Radix. Найдено в батче 2 (Progress), ревью со стороны.

## Бэклог

- **Slider**: сейчас доступное имя бегунка — только строковый проп `thumbLabel` (→ `aria-label`).
  Добавить поддержку `aria-labelledby` — ссылку на id видимой подписи рядом со Slider, а не только
  инлайн-текст. Нужно решить, принимать ли оба варианта одновременно (как у большинства полей:
  `thumbLabel`/`aria-label` для одного, `aria-labelledby` как альтернатива) или только один из
  них на бегунок — зафиксировать перед реализацией.
- **Field**: `FieldError` не связывается с полем через `aria-describedby` автоматически — сейчас
  это явно задокументировано как ручная обязанность потребителя. Улучшение кода (автосвязка через
  `useId`) возможно позже, вне этого PR.
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

Батч 2 (PR #4, смёржен) — build #15 (после 3 правок, см. «Ветка / PR» выше):
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=15 — 137 историй, 0
визуальных изменений. Preview: https://6ad4a76c23be4704dc8eca20-oevxsxnzmz.chromatic.com/
