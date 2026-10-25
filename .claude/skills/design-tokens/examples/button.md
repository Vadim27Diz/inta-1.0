# Эталон: Button от Figma до Storybook

## 1. Figma: component set `Button`

Свойства: `Variant` (primary, secondary, neutral, outline, ghost, danger, danger-subtle, inverse, link, link-danger)
× `Size` (sm, md, lg, icon) × `State` (default, hover, pressed, focus, disabled) = 200 вариантов.
Плюс свойства компонента: boolean `Icon left`, `Icon right`, text `Label`. Осями вариантов они не делаются — иначе 800 ячеек.

Привязки для `Variant=primary, Size=md`:

| Слой | Свойство | Переменная / стиль |
|---|---|---|
| `root` (auto layout) | fill | `color/primary/default` → в `State=hover`: `color/primary/hover`, `pressed`: `color/primary/pressed`, `disabled`: `color/disabled` |
| `focus-ring` (только `State=focus`) | слой-прямоугольник | на 4px больше кнопки, absolute + constraints STRETCH, обводка 2px `color/focus-ring` снаружи, без заливки, радиус `radius/lg` |
| `root` | padding H / V, gap | `spacing/4` / `spacing/2`, gap `spacing/2` |
| `root` | height | `spacing/9` (36px) |
| `root` | corner radius | `radius/md` (Brand) |
| `label` | text style / fill | `label/md` / `color/on-primary` (disabled: `color/on-disabled`) |
| `icon-left`, `icon-right` | fill | `color/on-primary` (disabled: `color/on-disabled`), 16×16 |

Остальные варианты — по таблице «Кнопка: варианты» в `shadcn-mapping.md`.
Размеры: `sm` — h `spacing/8`, px `spacing/3`, стиль `label/sm`; `md` — h `spacing/9`, px `spacing/4`, py `spacing/2`, `label/md`;
`lg` — h `spacing/10`, px `spacing/6`, `label/lg`; `icon` — `spacing/9` квадрат, без подписи.
Вертикальный паддинг есть только у `md`: у `sm` 8+8 не помещаются в высоту 32.

Подпись однострочная: `textTruncation = ENDING`, `maxLines = 1`, `textAlignHorizontal = CENTER`.
Все ловушки сборки — в `references/figma-pitfalls.md`; без них тени не рисуются, а правки растекаются по вариантам.

## 2. Код: `src/components/ui/button.tsx`

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";              // как сгенерировал shadcn CLI в вашем проекте
import { Slot } from "radix-ui";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "transition-colors outline-none",
    // Кольцо фокуса — outline, а не ring: зазор прозрачный и показывает подложку,
    // поэтому кнопка одинаково выглядит на surface и на surface-raised.
    // outline-solid обязателен: outline-none в этой же базе ставит --tw-outline-style: none.
    "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "bg-primary-subtle text-on-primary-subtle hover:bg-primary-subtle-hover active:bg-primary-subtle-pressed",
        neutral: "bg-neutral text-on-neutral hover:bg-neutral-hover active:bg-neutral-pressed",
        outline: "border border-border text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        ghost: "text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        danger: "bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-pressed",
        "danger-subtle":
          "bg-danger-subtle text-on-danger-subtle hover:bg-danger-subtle-hover active:bg-danger-subtle-pressed",
        inverse: "bg-inverse text-on-inverse hover:bg-inverse-hover active:bg-inverse-pressed",
        link: "text-link hover:text-link-hover disabled:bg-transparent",
        "link-danger": "text-link-danger hover:text-link-danger-hover disabled:bg-transparent",
      },
      // один typo-* на размер и ни одного в базе: у кастомных утилит одинаковая специфичность,
      // два класса разрешались бы порядком в CSS, а не порядком в списке классов
      size: {
        sm: "h-8 px-3 typo-label-sm",
        md: "h-9 px-4 py-2 typo-label-md",
        lg: "h-10 px-6 typo-label-lg",
        icon: "size-9 typo-label-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

function Button({
  className, variant, size, asChild = false, ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
```

Обрати внимание: `[&_svg]:size-4` — это селектор-вариант со шкалой Tailwind, не произвольное значение; линтер его пропускает.
Фокус — `outline`, а не `ring`. У `ring` зазор приходится красить (`ring-offset-surface`), и на карточке
`surface-raised` кнопка выкладывает вокруг себя заплатку цвета страницы. У `outline` зазор прозрачный —
кнопка одинаково выглядит на любой подложке. По той же причине у `outline` и `ghost` нет заливки.
У `link` и `link-danger` подчёркивания нет ни в одном состоянии: при hover меняется только цвет (почему — «Ловушки Figma», п. 5).

## 3. Какой вариант когда: danger / danger-subtle / link-danger

| Вариант | Когда | Вес на экране | Пример |
|---|---|---|---|
| `danger` | Подтверждение необратимого действия — основная кнопка в диалоге, одна на экран | Максимальный: сплошная заливка `color/danger` | «Удалить аккаунт» в модалке подтверждения |
| `danger-subtle` | Опасное действие в ряду обычных: в карточке, строке таблицы, панели инструментов — когда красная заливка перетянула бы на себя весь экран | Средний: `color/danger/subtle` + `color/on-danger-subtle` | «Удалить» рядом с «Дублировать» в меню элемента |
| `link-danger` | Опасное действие внутри текста или как третьестепенная ссылка, без собственной коробки | Минимальный: только цвет текста | «Отозвать доступ» под списком участников |

Правила: `danger` — не больше одной на экран; `danger-subtle` не ставим как основную кнопку в диалоге подтверждения;
`link-danger` не используем там, где нужна область клика ≥ 32px. Для неопасных действий тех же трёх весов —
`primary` / `neutral` / `link`.

`inverse` — для подложек противоположной яркости: тост на тёмном фоне в светлой теме, кнопка поверх фотографии.
Это единственный вариант, который в тёмной теме становится светлым.

`secondary` — тональная primary (`primary/subtle`), а не второй цвет бренда: вторая по важности кнопка должна
читаться как «тот же primary, но тише». Рампа `brand/secondary` остаётся для акцентов и графиков,
кнопкой не используется.

## 4. История: `src/components/ui/button.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const variants = ["primary", "secondary", "neutral", "outline", "ghost",
                  "danger", "danger-subtle", "inverse", "link", "link-danger"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Button", variant: "primary", size: "md", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((v) => <Button key={v} {...args} variant={v}>{v}</Button>)}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(4,max-content)] gap-3">
      {variants.map((v) => (
        <div key={v} className="contents">
          <Button {...args} variant={v} id={`${v}-hover`}>hover</Button>
          <Button {...args} variant={v} id={`${v}-pressed`}>pressed</Button>
          <Button {...args} variant={v} id={`${v}-focus`}>focus</Button>
          <Button {...args} variant={v} disabled>disabled</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    pseudo: {
      hover: variants.map((v) => `#${v}-hover`),
      active: variants.map((v) => `#${v}-pressed`),
      focusVisible: variants.map((v) => `#${v}-focus`),
    },
  },
};

const combos = [
  { brand: "main", dark: false }, { brand: "main", dark: true },
  { brand: "demo", dark: false }, { brand: "demo", dark: true },
];
export const BrandMatrix: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4">
      {combos.map((c) => (
        <div key={c.brand + c.dark} data-brand={c.brand}
             className={(c.dark ? "dark " : "") + "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"}>
          <p className="typo-caption w-full text-on-surface-muted">{c.brand} / {c.dark ? "dark" : "light"}</p>
          {variants.map((v) => <Button key={v} {...args} variant={v}>{v}</Button>)}
        </div>
      ))}
    </div>
  ),
};
```

`grid-cols-[repeat(4,max-content)]` — единственное произвольное значение-раскладка, и оно в истории (истории линтер не проверяет). В компонентах так нельзя.

## 5. Проверка

1. `npm run tokens:check` → `0 errors`.
2. `npm run tokens:contrast` → пары `X` / `on-X` во всех состояниях × 4 комбинации бренд × тема, WCAG ≥ 4.5 и |APCA| ≥ 60.
3. Storybook: тулбар Brand × Theme — 4 комбинации; `BrandMatrix` показывает их сразу.
4. Figma `get_screenshot` component set ↔ история `Variants`: цвета, радиусы, отступы совпадают.
