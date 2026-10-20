import type { Meta, StoryObj } from "@storybook/react-vite"
import { NativeSelect } from "./native-select"

const meta = {
  title: "Components/Native Select",
  component: NativeSelect,
  args: { size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

function Options() {
  return (
    <>
      <option value="">Выберите вариант</option>
      <option value="a">Вариант А</option>
      <option value="b">Вариант Б</option>
      <option value="c">Вариант В</option>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <NativeSelect {...args} className="w-56">
      <Options />
    </NativeSelect>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <NativeSelect size="sm" className="w-56">
        <Options />
      </NativeSelect>
      <NativeSelect size="md" className="w-56">
        <Options />
      </NativeSelect>
      <NativeSelect size="lg" className="w-56">
        <Options />
      </NativeSelect>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(4,max-content)] items-center gap-3">
      <NativeSelect id="ns-default" className="w-48">
        <Options />
      </NativeSelect>
      <NativeSelect id="ns-focus" className="w-48">
        <Options />
      </NativeSelect>
      <NativeSelect id="ns-invalid" aria-invalid className="w-48" defaultValue="a">
        <Options />
      </NativeSelect>
      <NativeSelect id="ns-disabled" disabled className="w-48">
        <Options />
      </NativeSelect>
    </div>
  ),
  parameters: { pseudo: { focusVisible: ["#ns-focus"] } },
}

// неудобный контент: длинная опция, пустой выбор, placeholder-опция, ошибка
export const Content: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <NativeSelect className="w-56">
        <option value="">Выберите вариант</option>
        <option value="long">
          Очень длинное название опции, которое не помещается в видимую ширину поля
        </option>
      </NativeSelect>
      <NativeSelect className="w-56" defaultValue="">
        <option value="">Плейсхолдер вместо значения</option>
      </NativeSelect>
      <NativeSelect className="w-56" aria-invalid defaultValue="a">
        <Options />
      </NativeSelect>
    </div>
  ),
}

const combos = [
  { brand: "main", dark: false },
  { brand: "main", dark: true },
  { brand: "demo", dark: false },
  { brand: "demo", dark: true },
] as const

export const BrandMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {combos.map((c) => (
        <div
          key={c.brand + String(c.dark)}
          data-brand={c.brand}
          className={
            (c.dark ? "dark " : "") +
            "flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"} — шеврон внутри узкого поля (w-48/w-40), не у
            края родителя
          </p>
          <NativeSelect className="w-48">
            <Options />
          </NativeSelect>
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <NativeSelect className="w-40">
              <Options />
            </NativeSelect>
          </div>
        </div>
      ))}
    </div>
  ),
}
