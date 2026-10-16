import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search, Copy } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "./input-group"

const meta = {
  title: "Components/Input Group",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Поиск" />
    </InputGroup>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Иконка слева" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Кнопка справа" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Копировать">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Многострочный ввод" />
        <InputGroupAddon align="block-end">
          <InputGroupText>0 / 280</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="default" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="focus" autoFocus />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput aria-invalid defaultValue="некорректно" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput disabled placeholder="disabled" />
      </InputGroup>
    </div>
  ),
}

// неудобный контент: длинный текст, слово без пробелов, пустое значение, placeholder, ошибка
export const Content: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>Суперкалифрагилистикэкспиалидошес</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput defaultValue="" placeholder="Плейсхолдер вместо значения" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput aria-invalid defaultValue="ошибка" />
      </InputGroup>
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
          <InputGroup className="w-56">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="На surface" />
          </InputGroup>
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <InputGroup className="w-48">
              <InputGroupInput placeholder="На surface-raised" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton aria-label="Копировать">
                  <Copy />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      ))}
    </div>
  ),
}
