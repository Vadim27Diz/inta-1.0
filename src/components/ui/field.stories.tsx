import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "./field"
import { Input } from "./input"
import { Checkbox } from "./checkbox"

const meta = {
  title: "Components/Field",
  component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="default-email">Email</FieldLabel>
      <Input id="default-email" placeholder="you@example.com" />
      <FieldDescription>Мы не передаём его третьим лицам.</FieldDescription>
    </Field>
  ),
}

export const Variants: Story = {
  render: () => (
    <FieldGroup className="w-96">
      <FieldSet>
        <FieldLegend>Контакты</FieldLegend>
        <FieldDescription>Как с вами связаться.</FieldDescription>
        <Field>
          <FieldLabel htmlFor="v-name">Имя</FieldLabel>
          <Input id="v-name" placeholder="Имя" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="v-email">Email</FieldLabel>
          <Input id="v-email" placeholder="you@example.com" />
        </Field>
      </FieldSet>
      <FieldSeparator>или</FieldSeparator>
      <FieldLabel htmlFor="v-card">
        <Field orientation="horizontal">
          <Checkbox id="v-card" />
          <FieldContent>
            <FieldTitle>Карточка выбора</FieldTitle>
            <FieldDescription>Field внутри FieldLabel — чекбокс управляет подсветкой.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="s-default">Email</FieldLabel>
        <Input id="s-default" placeholder="you@example.com" />
        <FieldDescription>Подсказка по умолчанию.</FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="s-invalid">Email</FieldLabel>
        <Input id="s-invalid" aria-invalid defaultValue="not-an-email" />
        <FieldError>Введите корректный email.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="s-disabled" className="group-data-[disabled=true]/field:text-on-disabled">
          Email
        </FieldLabel>
        <div className="group/field" data-disabled="true">
          <Input id="s-disabled" disabled placeholder="Недоступно" />
        </div>
      </Field>
    </div>
  ),
}

// неудобный контент: длинная подсказка, слово без пробелов, пустое значение, placeholder, ошибка
export const Content: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="c-long">Очень длинная подпись поля, которая не помещается в одну строку</FieldLabel>
        <Input id="c-long" placeholder="Длинный-плейсхолдер-без-пробелов-и-переносов-строки" />
        <FieldDescription>
          Длинная подсказка под полем — она тоже должна переноситься по словам, а не раздувать поле
          вбок.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="c-empty">Пустое значение</FieldLabel>
        <Input id="c-empty" defaultValue="" placeholder="Плейсхолдер вместо значения" />
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="c-error">Суперкалифрагилистикэкспиалидошес-без-пробелов-значение</FieldLabel>
        <Input id="c-error" aria-invalid defaultValue="суперкалифрагилистикэкспиалидошес" />
        <FieldError>Суперкалифрагилистикэкспиалидошес — слишком длинное слово без пробелов в тексте ошибки.</FieldError>
      </Field>
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
          <Field className="w-64">
            <FieldLabel htmlFor={`bm-${c.brand}-${c.dark}`}>На surface</FieldLabel>
            <Input id={`bm-${c.brand}-${c.dark}`} placeholder="Значение" />
            <FieldDescription>Подсказка к полю.</FieldDescription>
          </Field>
          <div className="rounded-lg border border-border bg-surface-raised p-4 text-on-surface-raised">
            <Field className="w-56" data-invalid="true">
              <FieldLabel htmlFor={`bm-raised-${c.brand}-${c.dark}`}>На surface-raised</FieldLabel>
              <Input id={`bm-raised-${c.brand}-${c.dark}`} aria-invalid defaultValue="ошибка" />
              <FieldError>Текст ошибки.</FieldError>
            </Field>
          </div>
        </div>
      ))}
    </div>
  ),
}
