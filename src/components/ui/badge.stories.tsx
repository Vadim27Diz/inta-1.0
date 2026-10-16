import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const variants = [
  "primary",
  "secondary",
  "neutral",
  "outline",
  "danger",
  "danger-subtle",
  "success",
  "warning",
  "info",
] as const;

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Badge", variant: "primary" },
  argTypes: {
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((v) => (
        <Badge key={v} {...args} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const Content: Story = {
  render: (args) => (
    <div className="flex max-w-xs flex-col items-start gap-2">
      <Badge {...args}>99+</Badge>
      <Badge {...args}>Очень длинная подпись бейджа, которая не помещается</Badge>
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
  render: (args) => (
    <div className="grid grid-cols-2 gap-4">
      {combos.map((c) => (
        <div
          key={c.brand + c.dark}
          data-brand={c.brand}
          className={
            (c.dark ? "dark " : "") +
            "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption w-full text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          {variants.map((v) => (
            <Badge key={v} {...args} variant={v}>
              {v}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};
