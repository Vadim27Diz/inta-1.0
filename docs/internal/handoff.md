# Handoff: иконки-слоты мигрированы, сетка Components — 9 колонок, правило figma:layout готово

Текущее состояние на 2026-10-22. История предыдущих задач — `handoff-archive.md`. **Правило:** этот
файл перезаписывается при каждом обновлении, не дописывается в конец.

## Статус

- **PR #9–#13 смёржены в `main`**, порядок 9 → 10 → 11 → 12 → 13, без конфликтов (кроме `handoff.md`
  между #9/#10 — разрешён версией PR #10). Button icon glyph, Avatar/Item/Empty/Alert icon glyph,
  навыки `figma-icon-slots`/`inta-handoff`/`inta-component-docs`, Toggle T2 (icon glyph, другая
  схема — см. ниже), Button icon-sm/icon-lg (код + Figma).
- **Сетка Button** (`87:298`, 300 вариантов: `sm/md/lg/icon/icon-sm/icon-lg` × 10 `Variant` × 5
  `State`) переставлена в порядок строк `lg, md, sm, icon-lg, icon, icon-sm`. Порядок значений
  `Size` в панели Properties **не подтянулся** за порядком `children` (проверено, API не
  позволяет переставить программно) — пользователь поправит вручную в UI или оставит как есть.
- **Раскладка страницы `Components`: 9 колонок слева направо** (x = `-2236, -1222, -64, 1204, 2598,
  3656, 4714, 5772, 6830`), зазоры внутри каждой колонки выровнены ровно до 160. Решение человека,
  зафиксировано в `scripts/figma-layout-check.mjs` → `COLUMNS` (список секций по колонкам — там же,
  не дублируется здесь).
- **Правило `figma:layout` для слотов-иконок реализовано** (`iconSlots` в снимке) — `npm run
  figma:layout`/`npm run verify` зелёные. `figma/layout.json` пересобран 2026-10-22 (прежний снимок
  был от 2026-10-18 и не видел реальное состояние Figma).
- **Toggle мигрирован полностью**, но другой схемой, чем остальные: `componentPropertyReferences`
  на `li:star`-инстансе указывает на свойство `Icon#518:0` набора (INSTANCE_SWAP, 33
  `preferredValues` = канонический список глифов) — не `isExposedInstance`+`Icon base`, как у
  Button/Avatar/Item/Empty/Alert. Правило `figma:layout` признаёт оба способа валидными.
- **Select (триггер), Native Select, Checkbox, Select / Item, Spinner — не мигрированы, решение
  человека**: зашитые по дизайну глифы, не Instance Swap. В списке исключений правила (ниже).
- **Card (`media`)** — вне трека миграции, не иконочный слот (пустой `FRAME`, без инстанса).
- **Известный, не закрытый сейчас пробел — Input OTP focus-ring** (2 структурных нарушения,
  временно в исключениях правила) — `docs/internal/roadmap.md` → п. 3.

## Факты (ID, имена, пути — не выводятся из кода)

- Figma `fileKey` = `uUb84csG4wOfbUjB38ODiz`. Общие примитивы, не трогать: `Icon` (`115:32`,
  component set с `Size=16/20/24`), `Icon base` (`115:5`), 33 глифа `li:*` на странице `Icon /
  Glyphs`.
- **Слот-иконка compliant**, если кандидат (инстанс, resolved-имя которого через родительский
  `COMPONENT_SET` — `Icon`/`Icon base`/`li:*`) удовлетворяет (а) ИЛИ (б):
  - (а) `isExposedInstance === true` И resolved-имя `"Icon base"` (путь к кандидату — через чистые
    `FRAME`/`GROUP`, без пересечения границы другого топ-уровневого компонента);
  - (б) `componentPropertyReferences.mainComponent` указывает на `INSTANCE_SWAP`-свойство.
  Алгоритм детекции — `.claude/skills/design-tokens/assets/figma-layout-export.js` → блок
  `iconSlots`, подробный комментарий там же.
- **Исключения — зашитые глифы по дизайну** (`EXEMPT_ICON_SLOTS`): `Checkbox|mark`, `Select|Icon`
  (шеврон триггера), `Native Select|Icon` (шеврон), `Select / Item|Icon` (чекмарк пункта),
  `Spinner|li:loader-circle`.
- **Исключения — известные, не закрытые этой сессией** (`EXEMPT_ABSOLUTE_LAYERS`,
  `EXEMPT_FOCUS_RING_SHAPE`): `Input OTP|Utility / Focus ring` (абсолютно спозиционированный
  focus-ring), `Input OTP / Slot|focus-ring` (угол скругления 12 вместо 0 там, где угол
  родителя-слота 0) — починить и убрать исключения, план в `roadmap.md` п. 3.
- **Баги миграции иконок (Button) и их механизм** (delete+recreate рвёт даунстрим-оверрайды,
  `createInstance`+INSTANCE_SWAP не наследует заливку, drill-in может заморозить заливку как
  персональный оверрайд, скрытые слои требуют `skipInvisibleInstanceChildren=false`) —
  `docs/internal/figma-icon-audit.md` → «Баги, найденные и исправленные по ходу», не пересказано
  здесь.
- `figma.skipInvisibleInstanceChildren = false` теперь стоит в начале `figma-layout-export.js`
  (было пробелом — скрытые слоты вроде Button `icon-left`/`icon-right` по умолчанию давали пустой
  `.children`).

## Открытые решения человека

- Порядок значений `Size` в панели Properties у Button (сейчас `sm, md, lg, icon, icon-sm,
  icon-lg`, хотели `lg, md, sm, icon-lg, icon, icon-sm`) — править вручную в UI, если нужно.

## Что дальше

1. **Input OTP**: починить focus-ring (2 нарушения), убрать исключения из
   `EXEMPT_ABSOLUTE_LAYERS`/`EXEMPT_FOCUS_RING_SHAPE`, пересобрать `figma/layout.json` —
   `docs/internal/roadmap.md` → п. 3.
2. **`scripts/figma-code-diff.mjs` не проверяет Button и остальные компоненты этого пакета** —
   отдельный, не закрытый этой сессией пробел (другой скрипт — computed-style vs код, не раскладка).
3. Остальные задачи — `docs/internal/roadmap.md`.

## Правила

- Figma: чужие объекты не удалять/не переписывать без вопроса (не нарушалось).
- Новый глобальный токен — не потребовался ни в одной из задач этой сессии.
- Перед любой записью в Figma — дождаться подтверждения «версия сохранена» от человека (соблюдалось
  всю сессию).

## Проверки для продолжения

`npm run verify` (включает `figma:layout`), `tsc -b`, `npm run build-storybook` — все зелёные на
`main` после мёржа #9–#13. Эта задача (сетка Button, 9 колонок, правило `iconSlots`) — только
Figma + `.claude/skills/design-tokens/assets/figma-layout-export.js` +
`scripts/figma-layout-check.mjs` + `figma/layout.json`, код (`src/`) не менялся.
