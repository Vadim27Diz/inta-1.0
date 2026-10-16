import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { disabled: false },
  argTypes: { checked: { control: "inline-radio", options: [false, true, "indeterminate"] } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultChecked: true } };

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {([false, true, "indeterminate"] as const).map((v) => (
        <div key={String(v)} className="flex items-center gap-2">
          <Checkbox {...args} checked={v} id={`v-${String(v)}`} />
          <Label htmlFor={`v-${String(v)}`}>{v === "indeterminate" ? "indeterminate" : v ? "checked" : "unchecked"}</Label>
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(4,max-content)] items-center gap-x-6 gap-y-4">
      {([false, true, "indeterminate"] as const).map((v) => (
        <div key={String(v)} className="contents">
          <Checkbox {...args} checked={v} />
          <Checkbox {...args} checked={v} id={`cb-focus-${String(v)}`} />
          <Checkbox {...args} checked={v} aria-invalid />
          <Checkbox {...args} checked={v} disabled />
        </div>
      ))}
      <span className="typo-caption text-on-surface-muted">default</span>
      <span className="typo-caption text-on-surface-muted">focus</span>
      <span className="typo-caption text-on-surface-muted">invalid</span>
      <span className="typo-caption text-on-surface-muted">disabled</span>
    </div>
  ),
  parameters: {
    pseudo: { focusVisible: ["#cb-focus-false", "#cb-focus-true", "#cb-focus-indeterminate"] },
  },
};

// неудобный контент: длинная подпись в несколько строк, подпись рядом с disabled
export const Content: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4 rounded-lg border border-border p-4">
      <div className="flex items-start gap-2">
        <Checkbox {...args} defaultChecked id="c-long" className="mt-0.5" />
        <Label htmlFor="c-long" className="block">
          Очень длинная подпись к чекбоксу, которая занимает несколько строк и не должна съезжать
          относительно квадрата
        </Label>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox {...args} id="c-word" className="mt-0.5" />
        <Label htmlFor="c-word" className="block">
          Супер-длинное-слово-без-пробелов-шире-колонки
        </Label>
      </div>
      <div className="group flex items-center gap-2" data-disabled="true">
        <Checkbox disabled id="c-disabled" />
        <Label htmlFor="c-disabled">Недоступный пункт</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox {...args} aria-invalid aria-describedby="c-err" id="c-invalid" />
        <Label htmlFor="c-invalid" required>
          Согласие обязательно
        </Label>
      </div>
      <p id="c-err" className="typo-body-xs text-on-surface-danger">
        Без согласия продолжить нельзя
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
          <div className="flex items-center gap-4">
            <Checkbox {...args} />
            <Checkbox {...args} checked />
            <Checkbox {...args} checked="indeterminate" />
            <Checkbox {...args} checked aria-invalid />
            <Checkbox {...args} checked disabled />
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Checkbox {...args} />
            <Checkbox {...args} checked />
            <Checkbox {...args} checked="indeterminate" />
          </div>
        </div>
      ))}
    </div>
  ),
};
