import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bold, Italic, Underline, Star } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

const variants = ["default", "outline"] as const
const sizes = ["sm", "md", "lg"] as const

const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  args: { type: "multiple", variant: "default", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {variants.map((v) => (
        <ToggleGroup
          key={v}
          type="multiple"
          size={args.size}
          variant={v}
          defaultValue={["bold"]}
        >
          <ToggleGroupItem value="bold" aria-label="bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      {variants.map((v) => (
        <ToggleGroup
          key={v}
          type="multiple"
          size={args.size}
          variant={v}
          defaultValue={["bold"]}
        >
          <ToggleGroupItem value="bold" aria-label="bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="italic" id={`${v}-focus`}>
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="underline" disabled>
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
  parameters: { pseudo: { focusVisible: variants.map((v) => `#${v}-focus`) } },
}

// неудобный контент: один элемент, много элементов (перенос), size=sm с текстовой подписью
export const Content: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <ToggleGroup type="multiple" variant={args.variant} size={args.size}>
        <ToggleGroupItem value="only" aria-label="only">
          <Star />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        variant={args.variant}
        size="sm"
        className="flex-wrap"
        defaultValue="md"
      >
        {["sm", "md", "lg", "xl", "2xl"].map((s) => (
          <ToggleGroupItem key={s} value={s} className="w-auto px-3">
            {s}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
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
          <div className="flex items-center gap-4">
            <ToggleGroup type="multiple" size={args.size} defaultValue={["bold"]}>
              <ToggleGroupItem value="bold" aria-label="bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="italic">
                <Italic />
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup
              type="multiple"
              size={args.size}
              variant="outline"
              defaultValue={["bold"]}
            >
              <ToggleGroupItem value="bold" aria-label="bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="italic">
                <Italic />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      ))}
    </div>
  ),
}
