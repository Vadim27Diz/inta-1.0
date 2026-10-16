import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

function Fruits({ size }: { size?: "sm" | "md" }) {
  return (
    <Select defaultValue="apple">
      <SelectTrigger size={size} className="w-48">
        <SelectValue placeholder="Выберите фрукт" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Фрукты</SelectLabel>
          <SelectItem value="apple">Яблоко</SelectItem>
          <SelectItem value="banana">Банан</SelectItem>
          <SelectItem value="cherry">Вишня</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const Default: Story = {
  render: () => <Fruits />,
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Fruits size="sm" />
      <Fruits size="md" />
    </div>
  ),
}

// defaultOpen — чтобы выпадающая поверхность (surface-overlay, тень, обводка) была видна
// на снимке истории без ручного клика
export const States: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <Select defaultValue="apple">
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Яблоко</SelectItem>
          <SelectItem value="banana">Банан</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="apple" defaultOpen>
        <SelectTrigger id="select-open" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Яблоко</SelectItem>
          <SelectItem value="banana">Банан</SelectItem>
          <SelectItem value="cherry">Вишня</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-invalid className="w-48">
          <SelectValue placeholder="Ошибка" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Яблоко</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Недоступно" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Яблоко</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

// неудобный контент: длинный пункт, слово без пробелов, разделитель, пустой выбор (placeholder)
export const Content: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Выберите вариант" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="long">
          Очень длинный пункт списка, который не помещается в видимую ширину триггера
        </SelectItem>
        <SelectItem value="word">Суперкалифрагилистикэкспиалидошес-без-пробелов</SelectItem>
        <SelectSeparator />
        <SelectItem value="short">Короткий</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// Портал Select рендерит SelectContent в document.body — локальные обёртки BrandMatrix
// (data-brand/dark на div внутри истории) на неё не действуют, работает только глобальный
// тулбар (он выставлен на :root). Поэтому здесь показываем закрытый триггер во всех 4
// комбинациях — он не порталится и красится корректно; открытую панель в тёмной теме
// проверяем отдельно глазами через тулбар Theme на States.
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
          <Fruits />
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Fruits />
          </div>
        </div>
      ))}
    </div>
  ),
}
