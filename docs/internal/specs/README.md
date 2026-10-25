# Спеки компонентов: что копируется из Figma

Один компонент = два файла:

- `<slug>.json` — **машинный спек**, скопированный из Figma. Всё, что нужно коду, чтобы в Figma
  больше не ходить. Из него же генерируются ожидания для `npm run figma:diff` и таблицы в
  `.docs.ts` (данные снимаются один раз, используются дважды).
- `<slug>.md` — **человеческое**: что утверждено, открытые вопросы, принятые цветовые решения,
  ссылки на скриншоты. Дописывается, не перезаписывается.

Снимаются **в той же сессии**, где собирался или правился набор в Figma — см. правило 3 в
`../port-queue.md`.

## Главное правило: спек — это таблица, а не дамп

У `Tab` 48 вариантов, но различающихся наборов значений там около двадцати: геометрия зависит
только от `Size`, цвета — от `Style × Selected × State`. В спек идёт **по одной строке на
различающийся набор значений**, с указанием, при каком условии она действует. Полный перебор
вариантов не копируется никогда: он не нужен коду (там `cva` с теми же осями) и стоит токенов.

Второе правило: **имена переменных, не значения.** `color/primary/subtle`, а не `#EEF2FF`. Hex в
спеке — ошибка того же рода, что hex в компоненте.

## Формат (v1)

```json
{
  "$schema": "inta port spec v1",
  "component": "Tab",
  "slug": "tab",
  "capturedAt": "2026-10-26",
  "figma": {
    "fileKey": "uUb84csG4wOfbUjB38ODiz",
    "page": "Components",
    "setId": "637:1285",
    "sectionId": "637:1277",
    "defaultVariant": "Style=default, Size=lg, Selected=false, State=default",
    "layoutSignature": "хеш строки набора и его секции из figma/layout.json"
  },
  "properties": [
    { "name": "Style", "type": "VARIANT", "values": ["default", "line"] },
    { "name": "Size", "type": "VARIANT", "values": ["lg", "md", "sm"] },
    { "name": "Selected", "type": "VARIANT", "values": ["false", "true"] },
    { "name": "State", "type": "VARIANT", "values": ["default", "hover", "focus", "disabled"] },
    { "name": "Label", "type": "TEXT", "default": "Tab" },
    { "name": "Icon", "type": "BOOLEAN", "default": false }
  ],
  "layers": [
    { "name": "root", "type": "COMPONENT", "layout": "HORIZONTAL" },
    { "name": "icon", "type": "INSTANCE", "of": "Icon base", "exposed": true, "visibleByDefault": false },
    { "name": "label", "type": "TEXT", "property": "Label" },
    { "name": "focus-ring", "type": "INSTANCE", "of": "Utility / Focus ring", "absolute": true }
  ],
  "geometry": [
    { "when": "Size=lg", "height": 40, "padding": [8, 24, 8, 24], "itemSpacing": 8, "icon": 20, "typo": "label/lg" },
    { "when": "Size=md", "height": 36, "padding": [8, 16, 8, 16], "itemSpacing": 8, "icon": 16, "typo": "label/md" },
    { "when": "Size=sm", "height": 32, "padding": [8, 12, 8, 12], "itemSpacing": 8, "icon": 16, "typo": "label/sm" }
  ],
  "tokens": [
    { "when": "Style=default, Selected=false, State=default", "fill": null, "text": "color/on-surface-muted" },
    { "when": "Style=default, Selected=false, State=hover", "fill": "color/surface-hover", "text": "color/on-surface-hover" }
  ],
  "radius": [
    { "when": "*", "corners": ["radius/md", "radius/md", "radius/md", "radius/md"] }
  ],
  "focusRing": { "kind": "control", "scale": "md", "strokeWeight": 2 },
  "screenshot": "docs/internal/shots/tab-2026-10-26.png",
  "notes": "цвет Selected=true ждёт решения — см. tabs.md"
}
```

Соглашения, без которых числа читаются неверно:

- `padding` — **[top, right, bottom, left]**, порядок CSS. (В handoff раньше писали `pad[8,12,8,12]`
  без указания порядка — здесь он зафиксирован.)
- `corners` — **[topLeft, topRight, bottomRight, bottomLeft]**, порядок Figma
  `rectangleCornerRadii`.
- `when` — синтаксис имени варианта Figma (`Size=md, State=hover`), `"*"` = действует на всех.
- `fill: null` — заливки нет вовсе (не «прозрачная»).
- `typo` — имя текстового стиля Figma; в коде ему соответствует класс `typo-*`.
- `icon` — размер глифа в px; в коде это класс `size-*` (16 → `size-4`).
- `values` у VARIANT — **в том порядке, как в Figma**, потому что порядок задаётся порядком
  создания значения и правится только руками (см. ловушки).
- `layoutSignature` — хеш строки набора и его секции из `figma/layout.json`. Ловит структурные
  правки набора (размер, состав секции). Цветовые правки внутри варианта он не ловит — это
  `figma:diff`. Поле заполняет скрипт выгрузки; проверка появится вместе с
  `scripts/figma-spec-pull.mjs` (шаг 3 плана).

## Чем снимается

1. `COMPONENT = "<имя набора>"` в `.claude/skills/design-tokens/assets/figma-spec-export.js`,
   прогнать через `use_figma` (read-only).
2. Ответ сохранить **через скрипт, не руками**: `node scripts/port-spec-save.mjs <slug> spec.json`
   — он добавляет `layoutSignature` из `figma/layout.json` и печатает сводку (сколько вариантов
   свернулось в сколько строк). Тот же принцип, что у `figma-layout-save.mjs` с `exporterHash`.
3. Строку компонента в `../port-queue.md` перевести в `spec-captured` → `queued` (только `Edit`).

После перехода на REST шаги 1–2 заменяются одной локальной командой
`node scripts/figma-spec-pull.mjs <Component>` — тем же обходом, что и снимок раскладки, без
контекста (шаг 3 плана, нужен personal access token Figma).

Пример выше — **шаблон формата, а не снятый спек**: у `Tab` цвета ещё не утверждены.
