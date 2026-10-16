import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from "./button-group"

const meta = {
  title: "Components/Button Group",
  component: ButtonGroup,
  args: { orientation: "horizontal" },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <ButtonGroup orientation="horizontal">
        <Button variant="outline">One</Button>
        <Button variant="outline">Two</Button>
        <Button variant="outline">Three</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline">One</Button>
        <Button variant="outline">Two</Button>
        <Button variant="outline">Three</Button>
      </ButtonGroup>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <ButtonGroup>
        <Button variant="outline">
          <ChevronLeft />
        </Button>
        <Button variant="outline" id="bg-focus">
          Page 2
        </Button>
        <Button variant="outline" disabled>
          <ChevronRight />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>
          <Search />
        </ButtonGroupText>
        <Input placeholder="Поиск…" className="w-48" />
      </ButtonGroup>
    </div>
  ),
  parameters: { pseudo: { focusVisible: ["#bg-focus"] } },
}

// неудобный контент: один элемент, текстовый аддон + разделитель, длинная подпись
export const Content: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <ButtonGroup>
        <Button variant="outline">Один</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button variant="outline">Очень-длинная-подпись-без-пробелов</Button>
      </ButtonGroup>
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
          <ButtonGroup>
            <Button variant="outline">One</Button>
            <Button variant="outline">Two</Button>
            <Button variant="outline">Three</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
}
