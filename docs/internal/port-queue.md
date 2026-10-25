# Очередь переноса Figma → код

Пайплайн: **Figma первая, код батчами**. Компонент не переносится в код сразу после Figma — он
ждёт в этой очереди, пока человек не скажет «переносим». Очередь существует, чтобы между Figma-
сессией и сессией переноса ничего не потерялось: все числа, имена переменных и ID узлов
**копируются из Figma в спек** (`specs/<slug>.json`) в той же сессии, где собирался набор.

**Правила файла (нарушение = потеря данных):**

1. Файл **только дописывается и правится через `Edit`**, никогда через `Write` — как
   `handoff-archive.md`. Записи не удаляются никогда, даже перенесённые и даже отклонённые.
2. Отказ человека от переноса — это строка `отложено YYYY-MM-DD: причина` в примечании, а не
   удаление и не откат статуса. Запись остаётся в `queued`, накопление продолжается.
3. Спек снимается **до конца Figma-сессии**, а не «потом, когда дойдём до кода». При сжатии
   контекста (`autoCompactWindow: 400000`) первыми теряются ID узлов и точные числа — после
   сжатия спек уже не восстановить без нового похода в Figma.
4. Начинать код по компоненту без строки в статусе `queued` и без файла спека — нельзя.
5. Целостность очереди проверяется машиной: `npm run port:check` (входит в `npm run verify`).

**Статусы** (строго по порядку движения): `figma-build` → `figma-approved` → `spec-captured` →
`queued` → `ported` → `verified`. Боковые ветки: `code-only` (компонент есть только в коде, набор
в Figma заводить решено не надо), `figma-planned` (специфицирован, набор в Figma не собран).

**Порог батча** считает сам `port:check`, чтобы напоминание не зависело от памяти агента: 3 записи
в `queued` **или** 40 КБ спеков. Срабатывание порога — повод один раз сказать человеку «накопилось
N, переносим?», а не повторять это каждую сессию.

Колонка «Файл кода» — имя файла в `src/components/ui/`, `—` если кода ещё нет. Спек всегда лежит в
`docs/internal/specs/<slug>.json`, формат — `docs/internal/specs/README.md`.

<!-- queue:start -->

| Компонент (Figma) | slug | Статус | Дата | Файл кода | Примечание |
| --- | --- | --- | --- | --- | --- |
| Button | button | ported | 2026-10-25 | button.tsx | занесено задним числом; icon-sm/icon-lg и геометрия закрыты PR #13/#16 |
| Label | label | ported | 2026-10-25 | label.tsx | Size lg/md/sm — в составе PR #17, не в main |
| Input | input | ported | 2026-10-25 | input.tsx | ручная задача: порядок Size в Figma привести к lg/md/sm; спек снят задним числом 2026-10-25 для пакета D1 (`specs/input.json`), `figma-code-diff.mjs` берёт ожидания из него |
| Textarea | textarea | ported | 2026-10-25 | textarea.tsx | в Figma нет свойства Size — расхождение в бэклоге |
| Checkbox | checkbox | ported | 2026-10-25 | checkbox.tsx | занесено задним числом |
| Radio Group | radio-group | ported | 2026-10-25 | radio-group.tsx | занесено задним числом |
| Switch | switch | ported | 2026-10-25 | switch.tsx | занесено задним числом |
| Badge | badge | ported | 2026-10-25 | badge.tsx | бэклог доступности: focus-visible не определён |
| Separator | separator | ported | 2026-10-25 | separator.tsx | занесено задним числом |
| Kbd | kbd | ported | 2026-10-25 | kbd.tsx | занесено задним числом |
| Spinner | spinner | ported | 2026-10-25 | spinner.tsx | занесено задним числом |
| Skeleton | skeleton | ported | 2026-10-25 | skeleton.tsx | бэклог доступности: aria-busy не проставлен |
| Field | field | ported | 2026-10-25 | field.tsx | Size lg/md/sm — в составе PR #17, не в main |
| Input Group | input-group | ported | 2026-10-25 | input-group.tsx | занесено задним числом |
| Input OTP | input-otp | ported | 2026-10-25 | input-otp.tsx | focus-ring исправлен PR #15; открыт вопрос Kind=seam vs outline-offset-2 |
| Native Select | native-select | ported | 2026-10-25 | native-select.tsx | ручная задача: порядок Size в Figma |
| Select | select | ported | 2026-10-25 | select.tsx | в Figma нет Size, в коде расходится с Input — бэклог |
| Toggle | toggle | ported | 2026-10-25 | toggle.tsx | Instance swap на корне, PR #12; ручная задача: порядок Size |
| Toggle Group | toggle-group | ported | 2026-10-25 | toggle-group.tsx | ручная задача: порядок Size в Figma |
| Button Group | button-group | ported | 2026-10-25 | button-group.tsx | занесено задним числом |
| Slider | slider | ported | 2026-10-25 | slider.tsx | бэклог доступности: aria-labelledby не проверен |
| Progress | progress | ported | 2026-10-25 | progress.tsx | занесено задним числом |
| Typography | typography | ported | 2026-10-25 | typography.tsx | занесено задним числом |
| Avatar | avatar | ported | 2026-10-25 | avatar.tsx | ручная задача: порядок Size в Figma |
| Avatar Group | avatar-group | ported | 2026-10-25 | avatar.tsx | компонент живёт в avatar.tsx, отдельного файла нет |
| Item | item | ported | 2026-10-25 | item.tsx | не трогаем в текущем пакете; нужна ручная проверка в Safari/VoiceOver |
| Empty | empty | ported | 2026-10-25 | empty.tsx | занесено задним числом |
| Card | card | ported | 2026-10-25 | card.tsx | занесено задним числом |
| Alert | alert | ported | 2026-10-25 | alert.tsx | занесено задним числом |
| Breadcrumb | breadcrumb | ported | 2026-10-25 | breadcrumb.tsx | код есть (PR #1), набора в Figma нет — обратное расхождение, Figma в плане пакета PR #17 |
| Aspect Ratio | aspect-ratio | code-only | 2026-10-25 | aspect-ratio.tsx | решено: набор в Figma не заводим, оформляем паттерном в aspect-ratio.docs.ts |
| Collapsible | collapsible | code-only | 2026-10-25 | collapsible.tsx | решено: набор в Figma не заводим, оформляем паттерном в collapsible.docs.ts |
| Tab | tab | figma-build | 2026-10-25 | — | 48 вариантов собраны; ждёт решения по цвету Style=default (specs/tabs.md), затем правки → спек |
| Tabs | tabs | figma-build | 2026-10-25 | — | 6 вариантов собраны, 3 вложенных Tab; тот же блокер по цвету |
| Link | link | figma-planned | 2026-10-25 | — | план ≈24 варианта, переиспользует цвета Button variant=link; Figma не тронута |

<!-- queue:end -->

## Как выглядит сессия переноса

1. Прочитать эту таблицу и спеки **только тех** записей, что переносим.
2. Прочитать **один** компонент-образец того же класса из `src/components/ui` — не по одному на
   каждый переносимый.
3. Код + истории + `.docs.ts`/`.mdx` по спеку. В Figma при этом не ходим вообще.
4. `npm run verify` (`figma:diff` берёт ожидания из того же спека), `npx tsc -b`.
5. Статус `ported`; после того как человек посмотрел Storybook — `verified`. Коммит в пакет PR.
