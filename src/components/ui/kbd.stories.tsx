import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./kbd";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  args: { children: "K" },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd>K</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
      <div className="flex items-center gap-1">
        <Kbd>Ctrl</Kbd>
        <span className="typo-body-sm text-on-surface-muted">+</span>
        <Kbd>K</Kbd>
      </div>
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div className="flex max-w-xs flex-wrap items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>PageDown</Kbd>
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
            "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption w-full text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </div>
      ))}
    </div>
  ),
};
