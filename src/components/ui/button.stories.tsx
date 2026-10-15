import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const variants = [
  "primary",
  "secondary",
  "neutral",
  "outline",
  "ghost",
  "danger",
  "danger-subtle",
  "inverse",
  "link",
  "link-danger",
] as const;
const sizes = ["sm", "md", "lg", "icon"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Button", variant: "primary", size: "md", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(4,max-content)] gap-3">
      {variants.map((v) => (
        <div key={v} className="contents">
          <Button {...args} variant={v} id={`${v}-hover`}>
            hover
          </Button>
          <Button {...args} variant={v} id={`${v}-pressed`}>
            pressed
          </Button>
          <Button {...args} variant={v} id={`${v}-focus`}>
            focus
          </Button>
          <Button {...args} variant={v} disabled>
            disabled
          </Button>
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
            "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption w-full text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          {variants.map((v) => (
            <Button key={v} {...args} variant={v}>
              {v}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
