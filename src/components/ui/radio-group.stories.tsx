import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: { defaultValue: "one" },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {["one", "two", "three"].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`d-${v}`} />
          <Label htmlFor={`d-${v}`}>Вариант {v}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <RadioGroup {...args} className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="one" id="v-on" />
          <Label htmlFor="v-on">checked</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="two" id="v-off" />
          <Label htmlFor="v-off">unchecked</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const States: Story = {
  // выбранность у радиокнопки держит группа, поэтому на каждое состояние — своя группа
  render: () => (
    <div className="grid grid-cols-[repeat(3,max-content)] items-center gap-x-6 gap-y-4">
      {[
        { state: "default", props: {} },
        { state: "focus", props: {} },
        { state: "invalid", props: { "aria-invalid": true } },
        { state: "disabled", props: { disabled: true } },
      ].map(({ state, props }) => (
        <div key={state} className="contents">
          <RadioGroup defaultValue="on" className="contents">
            <RadioGroupItem value="on" id={state === "focus" ? "rb-focus-on" : undefined} {...props} />
            <RadioGroupItem value="off" id={state === "focus" ? "rb-focus-off" : undefined} {...props} />
          </RadioGroup>
          <span className="typo-caption text-on-surface-muted">{state}</span>
        </div>
      ))}
    </div>
  ),
  parameters: { pseudo: { focusVisible: ["#rb-focus-on", "#rb-focus-off"] } },
};

// неудобный контент: длинные подписи, пустая подпись, ошибка на группе
export const Content: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-lg border border-border p-4">
      <RadioGroup defaultValue="a" aria-describedby="rg-err">
        <div className="flex items-start gap-2">
          <RadioGroupItem value="a" id="rc-a" className="mt-0.5" />
          <Label htmlFor="rc-a" className="block">
            Очень длинная подпись варианта, которая занимает несколько строк и не должна съезжать
            относительно круга
          </Label>
        </div>
        <div className="flex items-start gap-2">
          <RadioGroupItem value="b" id="rc-b" className="mt-0.5" />
          <Label htmlFor="rc-b" className="block">
            Супер-длинное-слово-без-пробелов-шире-колонки
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="c" id="rc-c" aria-invalid />
          <Label htmlFor="rc-c">Вариант с ошибкой</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="d" id="rc-d" disabled />
          <Label htmlFor="rc-d">Недоступный вариант</Label>
        </div>
      </RadioGroup>
      <p id="rg-err" className="typo-body-xs text-on-surface-danger">
        Выберите один из вариантов
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
          <RadioGroup defaultValue="on" className="flex items-center gap-4">
            <RadioGroupItem value="on" />
            <RadioGroupItem value="off" />
            <RadioGroupItem value="invalid" aria-invalid />
            <RadioGroupItem value="disabled" disabled />
          </RadioGroup>
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <RadioGroup defaultValue="on2" className="flex items-center gap-4">
              <RadioGroupItem value="on2" />
              <RadioGroupItem value="off2" />
            </RadioGroup>
          </div>
        </div>
      ))}
    </div>
  ),
};
