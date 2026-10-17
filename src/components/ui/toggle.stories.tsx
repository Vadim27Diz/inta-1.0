import type { Meta, StoryObj } from "@storybook/react-vite"
import { Star, Bold } from "lucide-react"
import { Toggle } from "./toggle"

const variants = ["default", "outline"] as const
const sizes = ["sm", "md", "lg"] as const

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  args: { variant: "default", size: "md", disabled: false, children: <Star /> },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {variants.map((v) => (
        <Toggle key={v} {...args} variant={v} />
      ))}
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(4,max-content)] items-center gap-x-6 gap-y-4">
      {variants.map((v) => (
        <div key={v} className="contents">
          <Toggle {...args} variant={v} />
          <Toggle {...args} variant={v} id={`${v}-focus`} />
          <Toggle {...args} variant={v} defaultPressed />
          <Toggle {...args} variant={v} disabled />
        </div>
      ))}
      <span className="typo-caption text-on-surface-muted">off</span>
      <span className="typo-caption text-on-surface-muted">focus</span>
      <span className="typo-caption text-on-surface-muted">on</span>
      <span className="typo-caption text-on-surface-muted">disabled</span>
    </div>
  ),
  parameters: { pseudo: { focusVisible: variants.map((v) => `#${v}-focus`) } },
}

// неудобный контент: без иконки (буква), длинное слово, пустое содержимое
export const Content: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle {...args}>
        <Bold />
      </Toggle>
      <Toggle {...args} size="lg" className="w-auto px-3">
        Очень-длинное-слово-без-пробелов
      </Toggle>
      <Toggle {...args} aria-label="empty" />
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
          <div className="flex items-center gap-3">
            <Toggle {...args} />
            <Toggle {...args} defaultPressed />
            <Toggle {...args} variant="outline" />
            <Toggle {...args} variant="outline" defaultPressed />
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Toggle {...args} />
            <Toggle {...args} defaultPressed />
          </div>
        </div>
      ))}
    </div>
  ),
}
