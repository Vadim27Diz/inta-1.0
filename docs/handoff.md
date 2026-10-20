# Handoff: документация компонентов

Текущее состояние на 2026-10-20. Вся история до этой даты — в `docs/handoff-archive.md`
(переносится без изменений). **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец — историю/находки/разборы вести в архиве или в самом PR, сюда идёт только
актуальный срез.

## Ветка / PR

PR #3 (`docs/component-guidelines` → `main`) смёржен обычным merge commit
(https://github.com/Vadim27Diz/inta-1.0/pull/3) — батч 1 в `main`. Ветка `docs/component-guidelines`
не удалена, но больше не используется для новых батчей.

Каждый следующий батч — новая ветка от `main` (`docs/batch-2`, `docs/batch-3`, …) со своим PR.

## Готово (11 из 31)

Button, Alert, Native Select — пилот. Input, Textarea, Checkbox, Switch, Radio Group, Select,
Field, Input Group — батч 1.

## Осталось (20), батчами по ~8 — PR на каждый батч отдельно

| Батч | Компоненты |
|---|---|
| 2 — составные/вспомогательные формы | Input OTP, Toggle, Toggle Group, Button Group, Slider, Progress, Label, Kbd |
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

## Chromatic (батч 1)

Build #8: https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=8 — 137 историй,
0 визуальных изменений. Preview: https://6ad4a76c23be4704dc8eca20-wtxggonpbs.chromatic.com/
