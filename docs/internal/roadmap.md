# Roadmap

Короткий упорядоченный список задач, не история — для истории см. `handoff.md`/`handoff-archive.md`
(документация компонентов) и сами PR/коммиты. Этот файл обновляется по мере появления новых задач
или смены приоритета, старые пункты не копятся как лог.

## 1. Storybook UI в стиле Inta 1.0 — этап 1 завершён, в main

Интерфейс самого Storybook (manager/sidebar/toolbar + Docs, не истории компонентов) оформлен в
токенах дизайн-системы: перекраска темой (4 комбинации бренд×тема, live-переключение по тулбару
без перезагрузки, шрифты Inter/IBM Plex, без мигания main-light на прямых ссылках с `?globals=`).
Смёржено в `main` — [PR #7](https://github.com/Vadim27Diz/inta-1.0/pull/7) (merge commit
`e668294`), Chromatic build #35 проверен (1 изменение — `Item:Content`, ожидаемое, принятое до
этого PR, не регрессия от него). Детали реализации, найденные грабли и история коммитов —
`handoff-archive.md`. Откат — см. «Бэкап и откат» ниже (тег и ветка сохранены).

**Дальше вглубь не идём.** Решено человеком: перекраска темой — предел этой задачи. Более глубокая
кастомизация (свои панели/аддоны в manager, или отдельный сайт дизайн-системы на наших же
компонентах вместо штатного Storybook UI) — отложена, не начата. Для второго варианта в любом
случае нужны компоненты, которых пока нет: Tabs, Table, Scroll Area (см. «Остаток группы 3» ниже) —
без них собрать такой сайт на своих компонентах не из чего.

## 2. Логотип Inta 1.0 для sidebar Storybook

Сейчас в sidebar — только текст (`brandTitle: "Inta 1.0"`, без картинки) — осознанное решение для
Этапа 1 пункта 1, не временная заглушка. Ассета логотипа нет ни в Figma (страница `Cover`
отсутствует, проверено по остальным трём страницам — ничего похожего не нашлось), ни в
репозитории (только дефолтный favicon Storybook). Если логотип понадобится — отдельная задача:
сначала согласовать с человеком сам визуальный логотип (новый бренд-ассет, не токен, но то же
правило "не выдумывать самостоятельно"), потом завести его в Figma, потом подключить как
`brandImage` в `managerThemes`/`scripts/build-manager-theme.mjs`.

## 3. Input OTP focus-ring — закрыто

[PR #15](https://github.com/Vadim27Diz/inta-1.0/pull/15) (merge commit `02057c1`, 2026-10-24): оба
структурных нарушения устранены — 3 слоя `Utility / Focus ring` переименованы в `focus-ring`
(Position уже был верный), 12 колец получили `Position: all → first/last` по роли слота в ряду.
`EXEMPT_ABSOLUTE_LAYERS`/`EXEMPT_FOCUS_RING_SHAPE` сняты из `figma-layout-export.js`, `npm run
figma:layout` проходит без единого исключения по Input OTP. Снимок «до» всех затронутых колец —
`docs/internal/figma-input-otp-focus-ring-before.json`. Детали хода работы — `handoff-archive.md`.

**Открытый побочный вопрос, не закрыт этим PR**: код `input-otp.tsx` красит активный слот через
`outline-offset-2` (control-стиль, с зазором), а Figma-кольцо — `Kind=seam` (вплотную, без зазора).
Решить отдельно: привести код к `ring`/вплотную (как Input/Textarea/Select, `Kind=field`) или
признать Input OTP легитимным исключением с зазором.

## 4. Бэклог доступности и компонентов

Перенесено из `handoff.md` → «Бэклог» без изменений:

- **Link** — отдельного компонента нет; see `button.docs.ts` → анатомия (asChild + `<a>` для
  переходов).
- **Toast/snackbar** — компонента нет, see `alert.docs.ts` → «Когда не использовать».
- **Field**: `FieldError` не связывается с полем через `aria-describedby` автоматически — сейчас
  это явно задокументированная ручная обязанность потребителя; автосвязка через `useId` возможна
  позже.
- **Slider**: нужна поддержка `aria-labelledby` у бегунка, не только инлайн
  `thumbLabel`/`aria-label`. Решить, принимать оба способа одновременно или только один — до
  реализации.
- **Badge**: `badgeVariants` не включает `focus-visible` классы — при `asChild` добавлять вручную.
  Возможное решение — добавить `focus-visible:outline-*` в базовые классы (безвредно для
  неинтерактивного `<span>`).
- **Skeleton**: нет встроенного `aria-busy`/`role="status"` — задокументировано как обязанность
  оборачивающего. Возможный необязательный проп `label`, рендерящий это самостоятельно — решить, не
  усложнит ли это текущий «один div» компонент без веской причины.
- **Разнобой языка у захардкоженных подписей для скринридера**: `Spinner` →
  `aria-label="Загрузка"` (RU); `Breadcrumb` → `aria-label="breadcrumb"` и `BreadcrumbEllipsis` →
  sr-only текст «More» (оба EN). Решить единообразно вместе с i18n (сейчас в проекте нет механизма
  i18n для строк компонентов — только `Text`/`Locale` в самой документации, `src/docs`).
- **Item asChild внутри ItemGroup — проверить display:contents в Safari + VoiceOver**: фикс
  `role="listitem"` оборачивает asChild-ссылку/кнопку в `<div role="listitem" className="contents">`.
  Playwright/Chromium подтвердил и роль, и `display:contents`, но старые версии WebKit исторически
  теряли роль у элементов с `display:contents` целиком. Если в реальном Safari + VoiceOver роль не
  долетает — заменить обёртку на одну с настоящим layout, не держаться за `display:contents`.
- **На Docs-страницах нет таблицы свойств компонентов** — ни один из 31 `.mdx` не использует
  `<Controls/>`/`<ArgTypes/>` из `@storybook/addon-docs/blocks`, только `<Canvas/>` + текстовые
  блоки `ComponentDocsPage.tsx`. Найдено при ревью Storybook UI (задача 1): единственное, что
  addon-docs вставляет сам — скрытый `aria-hidden` skeleton-плейсхолдер `table.sb-argstableBlock`
  из `base-preview-body.html`, не связанный с реальными пропсами и никогда не видимый. Решить,
  нужна ли таблица пропсов на Docs-странице вообще (сейчас документация текстовая, вручную
  описывает варианты/состояния через `*.docs.ts`) и если да — добавлять ли `<Controls/>` во все
  31 файл разом или по компоненту.

Подробности и контекст каждой находки — в `handoff-archive.md` и в самих `.docs.ts` компонентов
(`forDevelopers`/`accessibility`).

## 5. Конструктор страниц drag-and-drop — заблокирован

`storybook-page-builder` не ставится на Storybook 10: пакет требует `peerDependencies.storybook:
^9.0.0`, репозиторий — на `storybook@10.6.2`. Пакет аудирован, не вредоносный (MIT, без install
script, один мейнтейнер, обёртка над `@puckeditor/core`, хранит страницы в `localStorage` браузера
— без общего бэкенда). Решение отложено человеком: ждать релиз под Storybook 10 или обсуждать
даунгрейд Storybook (сам по себе большое изменение, нужно отдельное согласование). Следующий шаг —
искать альтернативу, совместимую с Storybook 10 (или рабочую независимо от Storybook), либо
дождаться релиза `storybook-page-builder` под мажорную версию 10. Не начинать без решения по
Storybook-версии.

## 6. Остаток группы 3 (компоненты)

Figma + код для компонентов, которых пока нет в наборе: Table, Tabs, Accordion, Pagination, Scroll
Area, Resizable, Direction. Отдельный трек от документации — ветка `feat/group-3` (часть уже
смёржена PR #1: Typography, Avatar, Item, Card, Empty, Alert, Aspect Ratio, Breadcrumb,
Collapsible — но см. замечание ниже).

**Замечание (найдено 2026-10-21, не часть этой задачи — просто зафиксировано):** на странице
`Components` в Figma нет секций для Aspect Ratio, Breadcrumb и Collapsible, хотя в коде и
документации они числятся готовыми (смёржены через PR #1). Разошлось Figma ↔ код для этих трёх
компонентов — требует внимания при следующей работе над группой 3 или над самой Figma, но не
трогалось и не чинилось в рамках текущей задачи.

Pagination/Scroll Area/Resizable/Table/Tabs/Accordion — частые зависимости для будущего
drag-and-drop конструктора страниц (пункт 5) и вообще для сборки реальных экранов, поэтому порядок
между пунктами 5 и 6 стоит пересмотреть, когда дойдёт очередь.

## Бэкап и откат (для пункта 1)

- Тег `backup/pre-storybook-ui` на коммите `main` **до** начала работы над Storybook UI:
  `b80ae96` (`Docs: handoff.md — PR #6 смёржен, Chromatic build #30 принят...`), запушен на
  `origin`.
- Визуальный эталон «до» — Chromatic build #30 (батч 4, принят человеком как baseline):
  https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=30
- Пункт 1 смёржен в `main` через `feat/storybook-ui` → [PR #7](https://github.com/Vadim27Diz/inta-1.0/pull/7)
  (merge commit `e668294`); ветка и тег сохранены (не удалены по мёржу).
- Файлы, которые меняет пункт 1 (финальное состояние после мёржа):
  - `scripts/build-manager-theme.mjs` (новый) — генератор тем manager+docs из `tokens/tokens.json`,
    все 4 комбинации бренд×тема для обеих тем.
  - `.storybook/theme.generated.ts` (новый, генерируется) — не править руками, пересобирать
    `npm run storybook:theme`.
  - `.storybook/manager.ts` (новый) — `addons.setConfig({ theme })`, live-переключение по тулбару
    (`addons.register` + `channel.on(GLOBALS_UPDATED)`), тема первой отрисовки — из `?globals=`.
  - `.storybook/manager-head.html` (новый) — `@font-face` для Inter/IBM Plex (manager — отдельный
    бандл, без доступа к `@fontsource` из `globals.css`).
  - `public/fonts/` (новое) — latin-only `.woff2` для manager (кириллица только в Docs/preview).
  - `.storybook/globals-from-url.ts` (новый) — общий парсинг `?globals=` для manager.ts и preview.tsx.
  - `.storybook/preview.tsx` — `docs.container` (`ThemedDocsContainer`, обёртка над
    `DocsContainer` из `@storybook/addon-docs/blocks`) вместо статичного `docs.theme`: нужен, чтобы
    8 литеральных полей docs-темы следовали за тулбаром живьём и не откатывались к `main-light` при
    переходе между Docs-страницами.
  - `src/docs/ComponentDocsPage.tsx` — новый `DocsTitle` (заменяет `<Title>` из
    `@storybook/addon-docs/blocks` на `typo-heading-1`).
  - `src/components/ui/*.mdx` — все 31 файл, `<Title>` → `<DocsTitle docs={...} />` (механическая
    правка, формат `.docs.ts` не менялся).
  - `package.json` — `storybook:theme` npm-скрипт.
  - `.storybook/main.ts` — `staticDirs: ["../public"]` (шрифты manager-темы в проде).
  - Не менял: `src/components/ui/*.tsx`/`*.docs.ts`/`*.stories.tsx` (сами компоненты и их
    документация), `tokens/tokens.json`, `src/styles/tokens.css`.
- Откат к состоянию «до», если что-то пошло не так (main уже продвинулся после мёржа):
  ```
  git checkout main
  git reset --hard backup/pre-storybook-ui   # ИЛИ, мягче: git revert e668294 (merge commit)
  ```
