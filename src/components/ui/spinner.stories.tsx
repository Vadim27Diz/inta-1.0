import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";
import { Button } from "./button";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-5" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
};

// text-current на спиннере внутри Button: сам Spinner по умолчанию — on-surface-muted
// (для использования на простой поверхности, как в Default/Variants/BrandMatrix), а
// text-current здесь берёт цвет уже решённый кнопкой (text-on-primary / disabled:text-on-disabled),
// а не фиксированный заранее — иначе в disabled-состоянии цвет кнопки меняется, а
// захардкоженный цвет спиннера — нет, и он перестаёт совпадать с реальным фоном.
export const Content: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Button>
        <Spinner className="text-current" />
        Загрузка…
      </Button>
      <Button disabled>
        <Spinner className="text-current" />
        Загрузка…
      </Button>
      <p className="flex items-center gap-2 typo-body-sm text-on-surface">
        <Spinner />
        Очень длинный статус загрузки, который не помещается в одну строку на маленьком экране
      </p>
    </div>
  ),
};

const combos = [
  { brand: "main", dark: false },
  { brand: "main", dark: true },
  { brand: "demo", dark: false },
  { brand: "demo", dark: true },
];

export const BrandMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {combos.map((c) => (
        <div
          key={c.brand + c.dark}
          data-brand={c.brand}
          className={
            (c.dark ? "dark " : "") +
            "flex items-center gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <Spinner />
        </div>
      ))}
    </div>
  ),
};
