# Third-party notices

Этот проект использует открытое ПО. Ниже — прямые зависимости из `package.json`
(`dependencies` + `devDependencies`), версия — фактически установленная (`node_modules`),
лицензия и ссылка — взяты из `package.json` самой зависимости, не из предположений.

## Runtime (dependencies)

| Пакет | Версия | Лицензия | Ссылка |
|---|---|---|---|
| @fontsource/ibm-plex-sans | 5.3.0 | OFL-1.1 | https://fontsource.org/fonts/ibm-plex-sans |
| @fontsource/ibm-plex-serif | 5.3.0 | OFL-1.1 | https://fontsource.org/fonts/ibm-plex-serif |
| @fontsource/inter | 5.3.0 | OFL-1.1 | https://fontsource.org/fonts/inter |
| @fontsource/jetbrains-mono | 5.3.0 | OFL-1.1 | https://fontsource.org/fonts/jetbrains-mono |
| class-variance-authority | 0.7.1 | Apache-2.0 | https://github.com/joe-bell/cva |
| cn | 0.4.0 | MIT | https://github.com/shadcn-ui/cn |
| input-otp | 1.5.0 | MIT | https://input-otp.rodz.dev/ |
| lucide-react | 1.57.0 | ISC | https://lucide.dev |
| radix-ui | 1.8.1 | MIT | https://radix-ui.com/primitives |
| react | 19.3.0 | MIT | https://react.dev/ |
| react-dom | 19.3.0 | MIT | https://react.dev/ |
| shadcn | 4.21.5 | MIT | https://ui.shadcn.com |
| tw-animate-css | 1.4.0 | MIT | https://github.com/Wombosvideo/tw-animate-css |

## Build / dev tooling (devDependencies)

| Пакет | Версия | Лицензия | Ссылка |
|---|---|---|---|
| @storybook/addon-docs | 10.6.2 | MIT | https://github.com/storybookjs/storybook |
| @storybook/react-vite | 10.6.2 | MIT | https://github.com/storybookjs/storybook |
| @tailwindcss/node | 4.3.3 | MIT | https://tailwindcss.com |
| @tailwindcss/vite | 4.3.3 | MIT | https://tailwindcss.com |
| @types/node | 24.19.2 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/react | 19.3.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/react-dom | 19.3.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @vitejs/plugin-react | 6.1.2 | MIT | https://github.com/vitejs/vite-plugin-react |
| lucide-static | 1.57.0 | ISC | https://lucide.dev |
| oxlint | 1.88.0 | MIT | https://oxc.rs/docs/guide/usage/linter |
| playwright | 1.63.0 | Apache-2.0 | https://playwright.dev |
| storybook | 10.6.2 | MIT | https://storybook.js.org |
| storybook-addon-pseudo-states | 10.6.2 | MIT | https://github.com/storybookjs/storybook |
| tailwindcss | 4.3.3 | MIT | https://tailwindcss.com |
| typescript | 6.0.3 | Apache-2.0 | https://www.typescriptlang.org/ |
| vite | 8.3.4 | MIT | https://vite.dev |

## Лицензии, не входящие в MIT/BSD/Apache

Обе — permissive/free, не copyleft и не проприетарные, но называю отдельно, как попросили,
а не вписываю молча в общий список:

- **ISC** (`lucide-react`, `lucide-static`) — функционально эквивалентна MIT (минимальная
  permissive-лицензия без её исторического boilerplate-текста), широко используется в npm-экосистеме.
- **OFL-1.1** (SIL Open Font License, все 4 пакета `@fontsource/*`) — лицензия специально для
  шрифтов: разрешает использование, встраивание, модификацию и распространение бесплатно, но
  запрещает продажу самого шрифта отдельно от продукта и требует переименования изменённых версий.
  Здесь шрифты используются как есть, без модификации — условия не создают конфликта с MIT-лицензией
  остального проекта, но это другой тип лицензии, не «MIT-подобная», поэтому не объединял её с
  остальными в один список.
