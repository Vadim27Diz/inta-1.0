# Эталон: Button от Figma до Storybook

## 1. Figma: component set `Button`

Свойства: `Variant` (primary, secondary, neutral, outline, ghost, danger, link) × `Size` (sm, md, lg, icon) × `State` (default, hover, pressed, focus, disabled); boolean `Icon left`, `Icon right`; text `Label`.

Привязки для `Variant=primary, Size=md`:

| Слой | Свойство | Переменная / стиль |
|---|---|---|
| `root` (auto layout) | fill | `color/primary/default` → в `State=hover`: `color/primary/hover`, `pressed`: `color/primary/pressed`, `disabled`: `color/disabled` |
| `root` | stroke (только `State=focus`) | `color/focus-ring`, 2px, outside |
| `root` | padding H / V, gap | `spacing/4` / `spacing/2`, gap `spacing/2` |
| `root` | height | `spacing/9` (36px) |
| `root` | corner radius | `radius/md` (Brand) |
| `label` | text style / fill | `label/md` / `color/on-primary` (disabled: `color/on-disabled`) |
| `icon-left`, `icon-right` | fill | `color/on-primary` (disabled: `color/on-disabled`), 16×16 |

Остальные варианты — по таблице «Кнопка: варианты» в `shadcn-mapping.md`. Размеры: `sm` — h `spacing/8`, px `spacing/3`; `lg` — h `spacing/10`, px `spacing/6`; `icon` — `spacing/9` квадрат.

## 2. Код: `src/components/ui/button.tsx`

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // как сгенерировал shadcn CLI в вашем проекте
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md typo-label-md",
    "transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover active:bg-secondary-pressed",
        neutral: "bg-neutral text-on-neutral hover:bg-neutral-hover active:bg-neutral-pressed",
        outline: "border border-border bg-surface text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        ghost: "text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        danger: "bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-pressed",
        link: "text-link hover:text-link-hover underline-offset-4 hover:underline disabled:bg-transparent",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

function Button({
  className, variant, size, asChild = false, ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
```

Обрати внимание: `[&_svg]:size-4` — это селектор-вариант с шкалой Tailwind, не произвольное значение; линтер его пропускает. `ring-offset-surface` — токен, чтобы кольцо фокуса не сливалось с фоном.

## 3. История: `src/components/ui/button.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const variants = ["primary", "secondary", "neutral", "outline", "ghost", "danger", "link"] as const;

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
    <div className="flex flex-wrap gap-3">
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
             className={(c.dark ? "dark " : "") + "flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"}>
          <p className="typo-caption w-full text-on-surface-muted">{c.brand} / {c.dark ? "dark" : "light"}</p>
          {variants.map((v) => <Button key={v} {...args} variant={v}>{v}</Button>)}
        </div>
      ))}
    </div>
  ),
};
```

`grid-cols-[repeat(4,max-content)]` — единственное произвольное значение-раскладка, и оно в истории (истории линтер не проверяет). В компонентах так нельзя.

## 4. Проверка

1. `npm run tokens:check` → `0 errors`.
2. Storybook: тулбар Brand × Theme — 4 комбинации; `BrandMatrix` показывает их сразу.
3. Figma `get_screenshot` component set ↔ история `Variants`: цвета, радиусы, отступы совпадают.
