import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Input } from "./input";

const meta = {
  title: "Components/Label",
  component: Label,
  args: { children: "Электронная почта", required: false, size: "md" },
  argTypes: {
    required: { control: "boolean" },
    size: { control: "inline-radio", options: ["lg", "md", "sm"] },
  },
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Label {...args}>Обычная подпись</Label>
      <Label {...args} required>
        Обязательное поле
      </Label>
    </div>
  ),
};

const sizes = ["lg", "md", "sm"] as const;

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      {sizes.map((s) => (
        <div key={s} className="flex items-center gap-4">
          <span className="typo-caption w-8 text-on-surface-muted">{s}</span>
          <Label {...args} size={s} required>
            Электронная почта
          </Label>
        </div>
      ))}
    </div>
  ),
};

// disabled у подписи приходит от контрола: либо сосед-peer, либо обёртка group с data-disabled
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-col items-start gap-2">
        <Label {...args} htmlFor="s-enabled" required>
          Активное поле
        </Label>
        <Input id="s-enabled" className="peer w-64" placeholder="Можно вводить" />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Input id="s-disabled" className="peer w-64 order-2" disabled placeholder="Недоступно" />
        <Label {...args} htmlFor="s-disabled" required className="order-1">
          peer-disabled
        </Label>
      </div>
      <div className="group flex flex-col items-start gap-2" data-disabled="true">
        <Label {...args} required>
          group data-disabled
        </Label>
        <Input className="w-64" disabled placeholder="Недоступно" />
      </div>
    </div>
  ),
};

// неудобный контент: длинная подпись без переносов, пустая строка, перенос строки
export const Content: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col items-start gap-4 rounded-lg border border-border p-4">
      <Label {...args} required>
        Очень длинная подпись поля, которая не помещается в одну строку и должна переноситься
      </Label>
      <Label {...args} required>
        Супер-длинное-слово-без-пробелов-и-переносов-которое-шире-контейнера
      </Label>
      <Label {...args} required>
        {""}
      </Label>
      <Label {...args}>Без звёздочки</Label>
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
          key={c.brand + String(c.dark)}
          data-brand={c.brand}
          className={
            (c.dark ? "dark " : "") +
            "flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <Label {...args} required>
            На surface
          </Label>
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Label {...args} required>
              На surface-raised
            </Label>
          </div>
          <div className="group" data-disabled="true">
            <Label {...args} required>
              disabled
            </Label>
          </div>
        </div>
      ))}
    </div>
  ),
};
