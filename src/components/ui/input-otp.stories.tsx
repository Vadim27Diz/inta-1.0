import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp"

// без `component: InputOTP`: его тип пропсов — объединение { render } | { children },
// из-за которого Storybook требует `args`, подходящие сразу под обе ветки объединения.
const meta = {
  title: "Components/Input OTP",
} satisfies Meta

export default meta
type Story = StoryObj

function SixSlots({
  value,
  onChange,
  disabled,
  autoFocus,
  invalid,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  autoFocus?: boolean
  invalid?: boolean
}) {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      aria-invalid={invalid}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("")
    return <SixSlots value={value} onChange={setValue} />
  },
}

export const Variants: Story = {
  render: () => {
    const [v4, setV4] = useState("")
    const [v6, setV6] = useState("")
    return (
      <div className="flex flex-col gap-4">
        <InputOTP maxLength={4} value={v4} onChange={setV4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        <SixSlots value={v6} onChange={setV6} />
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SixSlots value="123" onChange={() => {}} />
      <SixSlots value="123" autoFocus onChange={() => {}} />
      <SixSlots value="123456" invalid onChange={() => {}} />
      <SixSlots value="123" disabled onChange={() => {}} />
    </div>
  ),
}

// неудобный контент: пустое значение, частично заполненный код, набор меньшей длины
export const Content: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SixSlots value="" onChange={() => {}} />
      <SixSlots value="1" onChange={() => {}} />
      <InputOTP maxLength={2} value="" onChange={() => {}}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
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
          <SixSlots value="123" onChange={() => {}} />
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <SixSlots value="123" onChange={() => {}} />
          </div>
        </div>
      ))}
    </div>
  ),
}
