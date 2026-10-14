# ds-kit: правила и скилл для Claude в VS Code

## Что внутри

```
CLAUDE.md                              ← правила проекта (Claude читает их всегда)
.claude/skills/design-tokens/
├── SKILL.md                           ← главная инструкция (Claude открывает её для UI-задач)
├── references/
│   ├── naming.md                      ← логика имён по статье + наши решения
│   ├── token-catalog.md               ← все токены и значения (сгенерирован)
│   ├── figma.md                       ← коллекции, режимы, компоненты в Figma
│   ├── code.md                        ← Tailwind v4, Storybook, структура проекта
│   └── shadcn-mapping.md              ← shadcn → наши токены, все 64 компонента
├── examples/button.md                 ← эталон: Figma → код → история
├── assets/
│   ├── tokens.seed.json               ← стартовый набор токенов (251 переменная, 11 текстовых стилей)
│   ├── tokens.css                     ← пример сгенерированного CSS
│   ├── figma-import.js                ← создаёт переменные и стили в Figma
│   └── figma-export.js                ← выгружает их обратно в JSON
└── scripts/
    ├── build-tokens.mjs               ← JSON → CSS для Tailwind
    └── check-tokens.mjs               ← линтер: находит цвета и размеры не из токенов
```

## Как установить

1. Распакуйте архив **в корень проекта** (там, где будет `package.json`). Папка `.claude` скрытая — проверьте, что она скопировалась.
2. В VS Code должен быть подключён Figma MCP (официальный сервер Figma), иначе Claude не сможет создавать переменные и компоненты.
3. Первое сообщение агенту, например:
   > Прочитай CLAUDE.md и скилл design-tokens. Настрой проект по references/code.md, затем создай токены в новом Figma-файле по references/figma.md. Остановись после smoke-теста и покажи результат.
4. Дальше — по компоненту или по группе из `shadcn-mapping.md`:
   > Сделай группу 1 (базовые контролы): Figma → код → истории, проверь tokens:check.

## Проверено здесь

- `build-tokens.mjs` собирает CSS из `tokens.seed.json` (195 CSS-переменных, 11 текстовых стилей).
- `check-tokens.mjs` находит 13 ошибок в «сырой» shadcn-кнопке и пропускает эталонную.
- Компиляция Tailwind v4 здесь не запускалась (нет доступа к npm). Первым делом в проекте сделайте smoke-тест из `references/code.md`.

## Шрифты

Подключены self-hosted через `@fontsource` (импорты в начале `src/styles/globals.css`, веса 400/500/600/700):

| Пакет | Семейство | Где используется |
|---|---|---|
| `@fontsource/inter` | Inter | `font/sans` и `font/heading` бренда Main |
| `@fontsource/ibm-plex-sans` | IBM Plex Sans | `font/sans` бренда Demo |
| `@fontsource/ibm-plex-serif` | IBM Plex Serif | `font/heading` бренда Demo |
| `@fontsource/jetbrains-mono` | JetBrains Mono | `font/mono` (общий для брендов) |

Имена семейств в пакетах совпадают со значениями токенов из Figma, поэтому `@font-face` ничего не переопределяет — достаточно импорта. Каждый вес приходит с подмножествами latin, latin-ext, cyrillic, greek, vietnamese и `unicode-range`: браузер качает только то, что встретилось на странице. Теперь переключение бренда main ↔ demo меняет и гарнитуру, а не только цвета и радиусы.

## Бэклог

- Пусто.
