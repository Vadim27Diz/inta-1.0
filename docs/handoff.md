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
  буквальные темы manager + var()-темы для Docs; `npm run storybook:theme` пересобирает.
- `.storybook/manager.ts` — `addons.setConfig({ theme: create(...) })`; шрифты Inter/IBM Plex
  через `.storybook/manager-head.html` + `public/fonts/` (latin-only).
- `.storybook/preview.tsx` — `parameters.docs.theme`.
- `DocsTitle` в `ComponentDocsPage.tsx`, заменяет `<Title>` во всех 31 `.mdx` (typo-heading-1).
- Живое переключение manager-темы по тулбару Brand/Theme (`addons.register` +
  `channel.on(GLOBALS_UPDATED)`).

## Что сделано (доработки после ревью)

Все 4 пункта из прошлого «Что осталось» — закрыты, каждый отдельным коммитом (от
`backup/pre-storybook-ui`): генератор темы → manager.ts+шрифты → preview.tsx → live-switch →
DocsTitle → roadmap → **staticDirs (`d78ed34`) → Docs-тема 4 комбинации (`7aced15`) → manager
без мигания (`cbad2bb`)**. После каждого шага — `npm run verify` и `npm run build-storybook`,
оба зелёные.

1. **Шрифты в проде**: `.storybook/main.ts` → `staticDirs: ["../public"]`. Проверено
   `build-storybook` + локальный static-сервер (`http-server storybook-static`) — оба шрифта
   (`inter-400.woff2`, `ibm-plex-sans-400.woff2`) отдают 200 по `/fonts/*.woff2`, не 404.
2. **Docs-тема — все 4 комбинации**: `buildDocsTheme(brandMode, themeMode)` в
   `build-manager-theme.mjs` теперь принимает бренд (раньше 8 литеральных полей всегда
   резолвились под `Main`) — `docsThemes` содержит `main-light`/`main-dark`/`demo-light`/
   `demo-dark`, те же ключи, что `managerThemes`. В `preview.tsx` — `ThemedDocsContainer`
   (обёртка над `DocsContainer` из `@storybook/addon-docs/blocks`, параметр `docs.container`),
   подставляет нужный набор по `GLOBALS_UPDATED` без перезагрузки iframe. Подробности и причина,
   почему не через `useGlobals` — «Известные грабли» ниже.
3. **Manager без мигания на первой загрузке**: `managerThemeKeyFromLocation()` в `manager.ts`
   читает `window.location.search` (`?globals=brand:demo;theme:dark`) синхронно при загрузке
   модуля, до прихода первого `GLOBALS_UPDATED` из preview-iframe — `addons.setConfig` сразу
   получает правильную тему. Проверено Playwright: скриншот через 150мс после `goto` (ещё идёт
   спиннер) уже тёмный/demo, не `main-light`.
4. **Скриншоты для ревью**: пересняты (Playwright, dev-сервер) под итоговое состояние всех трёх
   доработок — `after-docs-{main,demo}-{light,dark}.png` (4 шт, полная Docs-страница Button),
   `after-controls-main-light.png` (панель Controls под canvas истории), `after-codeblock-main-
   light.png` (блок кода, раскрыт «Show code»). Лежат в `visual.local/storybook-ui/` (в
   `.gitignore`, не часть кода) вместе с нетронутыми `before-*` (дефолтный Storybook, снято до
   начала задачи — не зависит от доработок этой сессии). Присланы файлами в этом же сообщении.

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
  story functions». Рабочий вариант — обычные React-хуки (`useState`/`useEffect`) + подписка на
  `context.channel.on(GLOBALS_UPDATED, …)`, тот же канал, что слушает `manager.ts`, но без
  Storybook-обёртки над хуками. См. `ThemedDocsContainer` в `preview.tsx`.
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
  делается по скриншотам (см. «Что сделано» → п.4), не по Chromatic diff.

## Что дальше

Все 4 доработки из прошлого ревью закрыты. Ждёт решения человека: ревью скриншотов (приложены) и
решение про мёрж `feat/storybook-ui` → `main` (см. `docs/roadmap.md` → «Бэкап и откат»).
