# Handoff: Storybook UI

Текущее состояние на 2026-10-21. История документации компонентов (батчи 1–4, завершены) —
`docs/handoff-archive.md`. **Правило:** этот файл перезаписывается при каждом обновлении, не
дописывается в конец.

## Статус: завершено, смёржено в main

Задача — оформить интерфейс самого Storybook (manager/sidebar/toolbar + Docs) в токенах Inta 1.0 —
закрыта на уровне «перекраска темой» (Этап 1). Ревью пройдено, решение человека: глубже не идём
(подробности и дальнейшие шаги — `docs/roadmap.md` → пункт 1).

- Ветка `feat/storybook-ui` → `main` через [PR #7](https://github.com/Vadim27Diz/inta-1.0/pull/7),
  merge commit `e668294`. Ветка и тег `backup/pre-storybook-ui` сохранены (не удалены).
- Chromatic build #35 проверен человеком: 1 изменение (`Item:Content`) — ожидаемое, принятое до
  этого PR, не регрессия от него.
- После мёржа на опубликованной (не локальной) сборке Chromatic проверено: шрифты без 404, прямая
  ссылка с `?globals=brand:demo;theme:dark` открывается сразу в нужной теме и в manager, и в Docs.

## Что сделано

- `scripts/build-manager-theme.mjs` — резолвит `tokens.json` (Theme→Brand→Primitives) в 4
  буквальные темы manager **и** 4 темы Docs (`main/demo` × `light/dark` — не только manager, как
  было на раннем этапе); `npm run storybook:theme` пересобирает.
- `.storybook/manager.ts` — `addons.setConfig({ theme: create(...) })`, живое переключение по
  тулбару без перезагрузки (`addons.register` + `channel.on(GLOBALS_UPDATED)`), тема первой
  отрисовки читается из `?globals=` в URL — без мигания `main-light`. Шрифты Inter/IBM Plex через
  `.storybook/manager-head.html` + `public/fonts/` (latin-only, свой бандл без `@fontsource`).
- `.storybook/preview.tsx` — `docs.container` (`ThemedDocsContainer`, обёртка над `DocsContainer`),
  живое переключение Docs-темы по тулбару; начальное значение читается лениво из уже применённого
  состояния документа (`data-brand`/`.dark`), чтобы не откатываться к `main-light` при переходе
  между Docs-страницами без смены globals.
- `.storybook/globals-from-url.ts` — общий парсинг `?globals=` для manager.ts и preview.tsx.
- `.storybook/main.ts` — `staticDirs: ["../public"]`, чтобы шрифты не давали 404 в проде.
- `DocsTitle` в `ComponentDocsPage.tsx` — заменяет `<Title>` во всех 31 `.mdx` (`typo-heading-1`).

Полная история коммитов (от `backup/pre-storybook-ui`) и находки каждого шага —
`git log backup/pre-storybook-ui..e668294` и `docs/handoff-archive.md`.

## Известные грабли

- 8 полей docs-темы (`appBorderColor`, `appBg`, `appContentBg`, `inputBg`, `textColor`,
  `colorSecondary`, `barSelectedColor`, `textMutedColor`) нельзя через `var()` — addon-docs в
  нескольких местах (не в `create()`, а в `DocsContainer`/`Styled`-компонентах) прогоняет их
  через `opacify`/`darken`/`lighten`/`transparentize` без guard на `var`/`gradient`/`calc` (guard
  есть только в `create()`/`isValidColorForPolished`). Остальные поля — безопасно `var()`.
  Проверено исчерпывающе: `grep -noE "curried(Opacify|Darken|Lighten|Transparentize)(\$[0-9]+)*\([^)]*\)"`
  по собранным чанкам `theming-*.js`/`blocks-*.js`.
- **`useGlobals` (Storybook-хук) нельзя вызвать внутри `DocsContainer`** — он рендерится вне
  декоратора/истории, падает с «Storybook preview hooks can only be called inside decorators and
  story functions». Рабочий вариант — обычные React-хуки + подписка на
  `context.channel.on(GLOBALS_UPDATED, …)`, тот же канал, что слушает `manager.ts`.
- **`ThemedDocsContainer` с константным начальным `useState` откатывается к `main-light`** при
  переходе между Docs-страницами: компонент пересоздаётся на каждый переход, а `GLOBALS_UPDATED`
  не приходит, если globals не менялись. Фикс — ленивый инициализатор, читающий уже применённые
  `data-brand`/`.dark` на `document.documentElement` (их выставляет декоратор при рендере любой
  истории, в том числе на предыдущей странице), с fallback на `?globals=` из URL для самой первой
  отрисовки.
- `npm run tokens:check` сканирует и прозу `.docs.ts`/`.mdx`, не только `.tsx` — два
  `data-[state=…]` подряд без завершающего `:utility` читаются как один произвольный класс и
  падают (см. архив, батч 1).
- Каждое утверждение в «Доступности» вида «автоматически» сверять с кодом нашей обёртки, не с
  памятью о Radix/shadcn (накопленные находки — архив).

## Бэклог

Полный список — `docs/roadmap.md` → «Бэклог доступности и компонентов» (Link, Toast, FieldError
aria-describedby, Slider aria-labelledby, Badge focus-visible, Skeleton aria-busy, разнобой языка
встроенных aria-подписей, Item display:contents в Safari/VoiceOver, **отсутствие таблицы
свойств/Controls на Docs-страницах** — найдено при этом ревью, кандидат в бэклог).

## Правила

- Каждый шаг Storybook UI — отдельный коммит.
- Figma не менять без согласования (эта задача Figma не трогала).
- Новая npm-зависимость — можно, но в отчёте указывать название/лицензию/зачем.
- Chromatic не снимает интерфейс Storybook (только истории внутри preview) — ревью manager/Docs
  делается по скриншотам, не по Chromatic diff.

## Что дальше

Задача закрыта. Следующие шаги по дизайн-системе — `docs/roadmap.md`: логотип sidebar (пункт 2,
нужен ассет — не начинать без согласования), бэклог доступности и Controls-таблицы (пункт 3),
конструктор страниц (пункт 4, заблокирован версией Storybook), остаток группы 3 — Table/Tabs/
Scroll Area и др. (пункт 5, также нужен для возможной будущей глубокой кастомизации Storybook UI).
