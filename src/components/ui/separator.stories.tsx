import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
  args: { orientation: "horizontal" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Separator {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-64">
        <p className="typo-body-sm text-on-surface">horizontal</p>
        <Separator orientation="horizontal" className="my-2" />
      </div>
      <div className="flex h-12 items-center gap-3">
        <p className="typo-body-sm text-on-surface">vertical</p>
        <Separator orientation="vertical" />
        <p className="typo-body-sm text-on-surface">рядом</p>
      </div>
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div className="flex max-w-xs flex-col gap-4">
      <div>
        <p className="typo-label-sm text-on-surface">Раздел</p>
        <p className="typo-body-sm text-on-surface-muted">Описание раздела над разделителем</p>
        <Separator className="mt-3" />
      </div>
      <div className="flex items-center gap-2 typo-body-sm text-on-surface">
        <span>Очень длинный текст слева от разделителя</span>
        <Separator orientation="vertical" className="h-4" />
        <span>справа</span>
      </div>
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
            "flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <Separator />
        </div>
      ))}
    </div>
  ),
};
