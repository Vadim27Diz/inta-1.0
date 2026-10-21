# Handoff: Storybook UI

Текущее состояние на 2026-10-21. История документации компонентов (батчи 1–4, завершены) —
`docs/handoff-archive.md`. **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец.

## Задача

Оформить интерфейс самого Storybook (manager/sidebar/toolbar + Docs) в токенах Inta 1.0. Ветка
`feat/storybook-ui`, в `main` не мёржим до ревью. Бэкап — тег `backup/pre-storybook-ui` на
`b80ae96`; как откатиться и что именно меняется — `docs/roadmap.md` → «Бэкап и откат».

## Что сделано (Этап 1)

- `scripts/build-manager-theme.mjs` — резолвит `tokens.json` (Theme→Brand→Primitives) в 4
  буквальные темы manager + 2 var()-темы для Docs; `npm run storybook:theme` пересобирает.
- `.storybook/manager.ts` — `addons.setConfig({ theme: create(...) })`; шрифты Inter/IBM Plex
  через `.storybook/manager-head.html` + `public/fonts/` (latin-only).
- `.storybook/preview.tsx` — `parameters.docs.theme`.
- `DocsTitle` в `ComponentDocsPage.tsx`, заменяет `<Title>` во всех 31 `.mdx` (typo-heading-1).
- Живое переключение manager-темы по тулбару Brand/Theme (`addons.register` +
  `channel.on(GLOBALS_UPDATED)`) — **вердикт: GO**, все 4 комбинации без перезагрузки.

Коммиты на ветке (от `backup/pre-storybook-ui`): генератор темы → manager.ts+шрифты →
preview.tsx → live-switch proof-of-concept → DocsTitle во всех `.mdx` → roadmap (логотип
отдельным пунктом). Каждый шаг — отдельный коммит, см. `git log backup/pre-storybook-ui..`.

## Что осталось (доработки после ревью, пока НЕ сделаны)

1. **Шрифты**: в `.storybook/main.ts` нет `staticDirs` — проверить, что `public/fonts/*.woff2`
   реально попадают в `storybook-static` при `build-storybook` и грузятся без 404 (в dev работало
   через Vite, прод не перепроверен после последних правок).
2. **Docs-тема статична (main/light)**: 8 полей-литералов (`appBorderColor`, `appBg`,
   `appContentBg`, `inputBg`, `textColor`, `colorSecondary`, `barSelectedColor`,
   `textMutedColor`) не следуют за demo/dark, потому что зашиты как константы на сборке темы, не
   `var()`. Нужны все 4 набора в `docsThemes` + переключение по `globals` (тот же механизм, что у
   manager, но в preview).
3. **Первая загрузка**: manager-тема должна сразу совпадать с сохранёнными globals (например,
   URL с `?globals=brand:demo;theme:dark`), без мигания main-light до первого
   `GLOBALS_UPDATED`. Сейчас `addons.setConfig` в `manager.ts` вызывается один раз статично с
   `managerThemes["main-light"]`.
4. **Скриншоты для ревью**: `visual.local/` в `.gitignore`, ревьюер их не видит через git —
   приложить файлами: 4 `after-docs-*` (все комбинации, с таблицей Controls и блоком кода) +
   before/after пара для main-light. Файлы уже лежат в `visual.local/storybook-ui/` (12 штук) —
   осталось переслать/прикрепить, не часть кода.

## Известные грабли

- 8 полей docs-темы (список в п.2 выше) нельзя через `var()` — addon-docs в нескольких местах
  (не в `create()`, а в `DocsContainer`/`Styled`-компонентах) прогоняет их через
  `opacify`/`darken`/`lighten`/`transparentize` без guard на `var`/`gradient`/`calc` (этот guard
  есть только в `create()`/`isValidColorForPolished`). Остальные поля — безопасно `var()`.
  Проверено исчерпывающе: `grep -noE "curried(Opacify|Darken|Lighten|Transparentize)(\$[0-9]+)*\([^)]*\)"`
  по собранным чанкам `theming-*.js`/`blocks-*.js`.
- `npm run tokens:check` сканирует и прозу `.docs.ts`/`.mdx`, не только `.tsx` — два
  `data-[state=…]` подряд без завершающего `:utility` читаются как один произвольный класс и
  падают (см. архив, батч 1).
- Каждое утверждение в «Доступности» вида «автоматически» сверять с кодом нашей обёртки, не с
  памятью о Radix/shadcn (накопленные находки — архив).

## Бэклог

Полный список — `docs/roadmap.md` → «Бэклог доступности и компонентов» (Link, Toast, FieldError
aria-describedby, Slider aria-labelledby, Badge focus-visible, Skeleton aria-busy, разнобой языка
встроенных aria-подписей, Item display:contents в Safari/VoiceOver).

## Правила

- Каждый шаг Storybook UI — отдельный коммит.
- Figma не менять без согласования (и вообще без необходимости — эта задача Figma не трогает).
- Новая npm-зависимость — можно, но в отчёте указывать название/лицензию/зачем.
- Chromatic не снимает интерфейс Storybook (только истории внутри preview) — ревью manager/Docs
  делается по скриншотам (см. «Что осталось» → п.4), не по Chromatic diff.
