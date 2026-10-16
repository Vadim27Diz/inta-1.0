import type { Meta, StoryObj } from "@storybook/react-vite"
import { Progress } from "./progress"

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: { value: 40 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Progress {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Progress value={0} />
      <Progress value={40} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-6">
      <div>
        <p className="typo-caption mb-2 text-on-surface-muted">loading (40%)</p>
        <Progress value={40} />
      </div>
      <div>
        <p className="typo-caption mb-2 text-on-surface-muted">complete (100%)</p>
        <Progress value={100} />
      </div>
      <div>
        <p className="typo-caption mb-2 text-on-surface-muted">indeterminate (без value)</p>
        <Progress />
      </div>
    </div>
  ),
}

// неудобный контент: 0%, узкий контейнер
export const Content: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-64">
        <p className="typo-caption mb-2 text-on-surface-muted">0%</p>
        <Progress value={0} />
      </div>
      <div className="w-24">
        <p className="typo-caption mb-2 text-on-surface-muted">узкий контейнер</p>
        <Progress value={60} />
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
            <Progress value={40} />
          </div>
          <div className="w-56 rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Progress value={40} />
          </div>
        </div>
      ))}
    </div>
  ),
}
