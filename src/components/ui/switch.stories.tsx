import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";
import { Label } from "./label";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { disabled: false },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultChecked: true } };

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch {...args} id="s-off" />
        <Label htmlFor="s-off">off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} id="s-on" defaultChecked />
        <Label htmlFor="s-on">on</Label>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(3,max-content)] items-center gap-x-6 gap-y-4">
      <Switch {...args} />
      <Switch {...args} id="sw-focus-off" />
      <Switch {...args} disabled />
      <Switch {...args} checked />
      <Switch {...args} checked id="sw-focus-on" />
      <Switch {...args} checked disabled />
      <span className="typo-caption text-on-surface-muted">default</span>
      <span className="typo-caption text-on-surface-muted">focus</span>
      <span className="typo-caption text-on-surface-muted">disabled</span>
    </div>
  ),
  parameters: { pseudo: { focusVisible: ["#sw-focus-off", "#sw-focus-on"] } },
};

// неудобный контент: длинная подпись слева от переключателя, строка настройки во всю ширину
export const Content: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <Label htmlFor="sc-long" className="block">
          Очень длинная подпись настройки, которая занимает несколько строк и не должна двигать
          переключатель
        </Label>
        <Switch {...args} id="sc-long" defaultChecked className="mt-0.5" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="sc-word" className="block">
          Супер-длинное-слово-без-пробелов-шире-колонки
        </Label>
        <Switch {...args} id="sc-word" />
      </div>
      <div className="group flex items-center justify-between gap-4" data-disabled="true">
        <Label htmlFor="sc-disabled">Недоступная настройка</Label>
        <Switch id="sc-disabled" disabled defaultChecked />
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
            <Switch {...args} />
            <Switch {...args} checked />
            <Switch {...args} disabled />
            <Switch {...args} checked disabled />
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Switch {...args} />
            <Switch {...args} checked />
          </div>
        </div>
      ))}
    </div>
  ),
};
