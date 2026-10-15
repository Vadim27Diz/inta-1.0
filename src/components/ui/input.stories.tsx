import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "Введите текст", size: "md", disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
    disabled: { control: "boolean" },
  },
  parameters: { controls: { exclude: ["asChild"] } },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Input {...args} className="w-64" /> };

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {sizes.map((s) => (
        <div key={s} className="flex items-center gap-4">
          <span className="typo-caption w-8 text-on-surface-muted">{s}</span>
          <Input {...args} size={s} className="w-64" defaultValue="Значение" />
          <Input {...args} size={s} className="w-64" />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(2,max-content)] items-center gap-4">
      <span className="typo-caption text-on-surface-muted">default</span>
      <Input {...args} className="w-64" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">focus</span>
      <Input {...args} id="in-focus" className="w-64" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">invalid</span>
      <Input {...args} aria-invalid className="w-64" defaultValue="Неверное значение" />
      <span className="typo-caption text-on-surface-muted">invalid + focus</span>
      <Input {...args} aria-invalid id="in-invalid-focus" className="w-64" defaultValue="Неверное значение" />
      <span className="typo-caption text-on-surface-muted">disabled</span>
      <Input {...args} disabled className="w-64" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">disabled + placeholder</span>
      <Input {...args} disabled className="w-64" />
    </div>
  ),
  // hover у поля нет: токена border/input-hover в системе нет, и обводка в hover не меняется
  parameters: { pseudo: { focusVisible: ["#in-focus", "#in-invalid-focus"] } },
};

// неудобный контент: длинный текст, длинное слово, пустое значение, placeholder, ошибка
export const Content: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4 rounded-lg border border-border p-4">
      <Input {...args} className="w-full" defaultValue="Очень длинное значение, которое не помещается в поле целиком и должно прокручиваться" />
      <Input {...args} className="w-full" defaultValue="Супер-длинное-слово-без-пробелов-которое-шире-поля" />
      <Input {...args} className="w-full" defaultValue="" />
      <Input {...args} className="w-full" placeholder="Длинный placeholder, который тоже не помещается в одну строку" />
      <div className="flex flex-col gap-1">
        <Label htmlFor="c-err" required>
          Электронная почта
        </Label>
        <Input {...args} id="c-err" aria-invalid aria-describedby="c-err-msg" className="w-full" defaultValue="не-почта" />
        <p id="c-err-msg" className="typo-body-xs text-on-surface-danger">
          Введите адрес в формате name@example.com
        </p>
      </div>
      <Input {...args} type="file" className="w-full" />
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
          <Input {...args} className="w-full" defaultValue="На surface" />
          <Input {...args} className="w-full" aria-invalid defaultValue="Ошибка" />
          <Input {...args} className="w-full" disabled defaultValue="Недоступно" />
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Input {...args} className="w-full" defaultValue="На surface-raised" />
          </div>
        </div>
      ))}
    </div>
  ),
};
