import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { placeholder: "Введите текст", disabled: false },
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Textarea {...args} className="w-80" /> };

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} className="w-80" defaultValue="Одна строка" />
      <Textarea {...args} className="w-80" defaultValue={"Несколько\nстрок\nподряд"} />
      <Textarea {...args} className="w-80" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(2,max-content)] items-start gap-4">
      <span className="typo-caption text-on-surface-muted">default</span>
      <Textarea {...args} className="w-80" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">hover</span>
      <Textarea {...args} id="ta-hover" className="w-80" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">focus</span>
      <Textarea {...args} id="ta-focus" className="w-80" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">invalid</span>
      <Textarea {...args} aria-invalid className="w-80" defaultValue="Неверное значение" />
      <span className="typo-caption text-on-surface-muted">invalid + focus</span>
      <Textarea {...args} aria-invalid id="ta-invalid-focus" className="w-80" defaultValue="Неверное значение" />
      <span className="typo-caption text-on-surface-muted">disabled</span>
      <Textarea {...args} disabled className="w-80" defaultValue="Значение" />
      <span className="typo-caption text-on-surface-muted">disabled + placeholder</span>
      <Textarea {...args} disabled className="w-80" />
    </div>
  ),
  parameters: {
    pseudo: { hover: ["#ta-hover"], focusVisible: ["#ta-focus", "#ta-invalid-focus"] },
  },
};

// неудобный контент: длинный текст, слово без пробелов, пустое значение, ошибка
export const Content: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col gap-4 rounded-lg border border-border p-4">
      <Textarea
        {...args}
        className="w-full"
        defaultValue="Очень длинный текст, который занимает несколько строк и проверяет, что поле растёт по содержимому, а не обрезает его и не ломает соседей по колонке."
      />
      <Textarea {...args} className="w-full" defaultValue="Супер-длинное-слово-без-пробелов-и-переносов-которое-шире-поля-целиком" />
      <Textarea {...args} className="w-full" defaultValue="" />
      <div className="flex flex-col gap-1">
        <Label htmlFor="ta-err" required>
          Комментарий
        </Label>
        <Textarea {...args} id="ta-err" aria-invalid aria-describedby="ta-err-msg" className="w-full" defaultValue="." />
        <p id="ta-err-msg" className="typo-body-xs text-on-surface-danger">
          Не меньше 10 символов
        </p>
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
          <Textarea {...args} className="w-full" defaultValue="На surface" />
          <Textarea {...args} className="w-full" aria-invalid defaultValue="Ошибка" />
          <Textarea {...args} className="w-full" disabled defaultValue="Недоступно" />
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Textarea {...args} className="w-full" defaultValue="На surface-raised" />
          </div>
        </div>
      ))}
    </div>
  ),
};
