# Handoff: документация компонентов

Текущее состояние на 2026-10-20. Вся история до этой даты — в `docs/handoff-archive.md`
(переносится без изменений). **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец — историю/находки/разборы вести в архиве или в самом PR, сюда идёт только
актуальный срез.

## Ветка / PR

PR #4 (`docs/batch-2` → `main`) открыт: https://github.com/Vadim27Diz/inta-1.0/pull/4 — батч 2
документации, ещё не смёржен. Ревью сделал человек со стороны (не в PR-комментариях, напрямую);
по итогам — 3 правки, уже внесены отдельными коммитами в ту же ветку:

1. **Баг в коде, не доки.** `progress.tsx`: `value` деструктурировался из пропсов и уходил только
   в `transform` индикатора, но не передавался в `ProgressPrimitive.Root` — Radix получал
   `value=undefined` (≡ `null`), из-за чего корень всегда был `data-state="indeterminate"` без
   `aria-valuenow`, независимо от реального значения. Полоса закрашивалась визуально правильно,
   скринридер — нет. Исправлено: `value` передан в `Root`. Проверено Playwright по DOM собранного
   Storybook: `value=40` → `aria-valuenow="40"` `data-state="loading"`, `value=100` →
   `data-state="complete"`, `value=0` → `aria-valuenow="0"` `data-state="loading"`.
2. **Баг в коде.** `slider.tsx`: у `SliderPrimitive.Thumb` не было способа задать доступное
   имя — ни `aria-label`, ни пробрасываемого снаружи пропа на конкретный бегунок. Добавлен проп
   `thumbLabel` (строка для одного значения, массив из двух строк для диапазона), ставится как
   `aria-label` по индексу `Thumb`. Без `thumbLabel` поведение не меняется.
3. **Доки.** `input-otp.docs.ts` → «Когда не использовать»: убрана неверная причина («пользователь
   может вставить значение целиком») — вставка кода целиком штатно поддерживается компонентом,
   это не повод выбрать `Input`. Оставлена настоящая причина: произвольная длина или значение
   другого рода (токен, ключ, номер карты).

После всех трёх — `npm run verify` (0 ошибок), Chromatic build #15:
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=15 — 137 историй, 0
визуальных изменений (ожидаемо: правки ARIA-атрибутов и прозы, не вёрстки). Готово к мёржу.

PR #3 (`docs/component-guidelines` → `main`) смёржен обычным merge commit
(https://github.com/Vadim27Diz/inta-1.0/pull/3) — батч 1 в `main`. Ветки `docs/component-guidelines`
и `docs/batch-2` не удаляются, но не используются для новых батчей.

Каждый следующий батч — новая ветка от `main` (`docs/batch-3`, `docs/batch-4`, …) со своим PR.

## Готово (19 из 31)

Button, Alert, Native Select — пилот. Input, Textarea, Checkbox, Switch, Radio Group, Select,
Field, Input Group — батч 1. Input OTP, Toggle, Toggle Group, Button Group, Slider, Progress,
Label, Kbd — батч 2 (PR #4, готов к мёржу, см. выше).

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
  `<component>.tsx`, в сомнительных случаях — Playwright по DOM собранного Storybook (см. разбор
  Progress выше), не полагаться на память о том, как ведёт себя Radix.

## Бэклог

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

Батч 2 (PR #4) — build #15 (после 3 правок, см. «Ветка / PR» выше):
https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=15 — 137 историй, 0
визуальных изменений. Preview: https://6ad4a76c23be4704dc8eca20-oevxsxnzmz.chromatic.com/
