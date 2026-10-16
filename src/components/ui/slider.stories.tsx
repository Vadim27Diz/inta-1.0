import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: { defaultValue: [40], max: 100, step: 1, disabled: false },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Slider {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-start gap-12">
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">одно значение</p>
        <Slider defaultValue={[40]} max={100} step={1} />
      </div>
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">диапазон</p>
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>
      <div className="h-44">
        <p className="typo-caption mb-2 text-on-surface-muted">vertical</p>
        <Slider defaultValue={[40]} max={100} step={1} orientation="vertical" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">default</p>
        <Slider defaultValue={[40]} max={100} step={1} />
      </div>
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">focus</p>
        <Slider defaultValue={[40]} max={100} step={1} id="slider-focus" />
      </div>
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">disabled</p>
        <Slider defaultValue={[40]} max={100} step={1} disabled />
      </div>
    </div>
  ),
  parameters: { pseudo: { focusVisible: ["#slider-focus [data-slot=slider-thumb]"] } },
}

// неудобный контент: значение на краю (0 и max), очень узкий контейнер
export const Content: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">min (0)</p>
        <Slider defaultValue={[0]} max={100} step={1} />
      </div>
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">max (100)</p>
        <Slider defaultValue={[100]} max={100} step={1} />
      </div>
      <div className="w-24">
        <p className="typo-caption mb-2 text-on-surface-muted">узкий контейнер</p>
        <Slider defaultValue={[40]} max={100} step={1} />
      </div>
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
            "flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <div className="w-56">
            <Slider defaultValue={[40]} max={100} step={1} />
          </div>
          <div className="w-56 rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Slider defaultValue={[40]} max={100} step={1} />
          </div>
        </div>
      ))}
    </div>
  ),
}
