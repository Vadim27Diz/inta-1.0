# Roadmap

Короткий упорядоченный список задач, не история — для истории см. `handoff.md`/`handoff-archive.md`
(документация компонентов) и сами PR/коммиты. Этот файл обновляется по мере появления новых задач
или смены приоритета, старые пункты не копятся как лог.

## 1. Storybook UI в стиле Inta 1.0 — в работе

Оформить интерфейс самого Storybook (не истории, а manager/sidebar/toolbar + Docs) в токенах
дизайн-системы. Статус, бэкап и инвентаризация — см. отчёт по «Этапу 0» в PR/коммитах ветки
`feat/storybook-ui` (или в самом чате, если PR ещё не открыт). Откат — см. «Бэкап и откат» ниже.

## 2. Бэклог доступности и компонентов

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

Подробности и контекст каждой находки — в `handoff-archive.md` и в самих `.docs.ts` компонентов
(`forDevelopers`/`accessibility`).

## 3. Конструктор страниц drag-and-drop — заблокирован

`storybook-page-builder` не ставится на Storybook 10: пакет требует `peerDependencies.storybook:
^9.0.0`, репозиторий — на `storybook@10.6.2`. Пакет аудирован, не вредоносный (MIT, без install
script, один мейнтейнер, обёртка над `@puckeditor/core`, хранит страницы в `localStorage` браузера
— без общего бэкенда). Решение отложено человеком: ждать релиз под Storybook 10 или обсуждать
даунгрейд Storybook (сам по себе большое изменение, нужно отдельное согласование). Следующий шаг —
искать альтернативу, совместимую с Storybook 10 (или рабочую независимо от Storybook), либо
дождаться релиза `storybook-page-builder` под мажорную версию 10. Не начинать без решения по
Storybook-версии.

## 4. Остаток группы 3 (компоненты)

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
drag-and-drop конструктора страниц (пункт 3) и вообще для сборки реальных экранов, поэтому порядок
между пунктами 3 и 4 стоит пересмотреть, когда дойдёт очередь.

## Бэкап и откат (для пункта 1)

- Тег `backup/pre-storybook-ui` на коммите `main` **до** начала работы над Storybook UI:
  `b80ae96` (`Docs: handoff.md — PR #6 смёржен, Chromatic build #30 принят...`), запушен на
  `origin`.
- Визуальный эталон «до» — Chromatic build #30 (батч 4, принят человеком как baseline):
  https://www.chromatic.com/build?appId=6ad4a76c23be4704dc8eca20&number=30
- Вся работа по пункту 1 — в ветке `feat/storybook-ui` от `main`, `main` не трогаем до ревью.
- Файлы, которые задача будет менять (ожидаемо, уточнится на этапе реализации):
  - `.storybook/main.ts`, `.storybook/preview.tsx` — конфигурация.
  - `.storybook/manager.ts` (новый файл) — тема manager через `storybook/theming` → `create()`.
  - Возможный генератор темы manager из `tokens/tokens.json` (по аналогии с `tokens:build`) —
    новый скрипт в `scripts/` + новая npm-команда.
  - Возможный кастомный `DocsContainer`/блоки в `src/docs/` — для типографики и цвета самого Docs
    (не историй) через `parameters.docs.container`.
  - `package.json` — новая npm-команда для сборки темы manager, если понадобится.
  - Не трогает: `src/components/ui/*` (сами компоненты и их `.docs.ts`/`.mdx`/`.stories.tsx`),
    `tokens/tokens.json`, `src/styles/tokens.css`.
- Откат к состоянию «до», если что-то пошло не так:
  ```
  git checkout main
  git reset --hard backup/pre-storybook-ui   # ИЛИ, мягче: git revert <коммиты ветки> по одному
  ```
  (`reset --hard` — только если ветка `feat/storybook-ui` ещё не смёржена и откатываем сам `main`;
  обычно достаточно просто не мёржить ветку и/или закрыть PR без мёржа — тег нужен как
  подтверждённая точка отсчёта на случай, если `main` всё же продвинется до ревью).
