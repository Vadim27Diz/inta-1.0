"use client"

import * as React from "react"
import { cn } from "cn"
import { Select as SelectPrimitive } from "radix-ui"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

// SelectTrigger и SelectContent — соседи под Select, не родитель/ребёнок (Content рендерится
// в портал). Радиус панели должен совпадать с радиусом триггера (sm → rounded-md, md → rounded-lg),
// поэтому Trigger сообщает свой размер наверх через контекст, а Content его читает.
const SelectSizeContext = React.createContext<{
  size: "sm" | "md"
  setSize: (size: "sm" | "md") => void
}>({ size: "md", setSize: () => {} })

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [size, setSize] = React.useState<"sm" | "md">("md")
  return (
    <SelectSizeContext.Provider value={{ size, setSize }}>
      <SelectPrimitive.Root data-slot="select" {...props} />
    </SelectSizeContext.Provider>
  )
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "md"
}) {
  const { setSize } = React.useContext(SelectSizeContext)
  React.useEffect(() => {
    setSize(size)
  }, [size, setSize])

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-border-input bg-transparent py-2 pr-2 pl-2.5 typo-body-sm whitespace-nowrap transition-colors outline-none select-none",
        "hover:bg-surface-hover",
        // кольцо фокуса поля — вплотную, скругление само повторяет radius (см. input.tsx)
        "focus-visible:ring-3 focus-visible:ring-focus-ring",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-on-disabled",
        "aria-invalid:border-danger",
        "data-placeholder:text-on-surface-muted",
        "data-[size=md]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-md",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-on-surface-muted" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align,
  container,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  container?: React.ComponentProps<typeof SelectPrimitive.Portal>["container"]
}) {
  const { size } = React.useContext(SelectSizeContext)
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-size={size}
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg data-[size=sm]:rounded-md border border-border bg-surface-overlay text-on-surface-overlay shadow-md duration-100",
          "data-[align-trigger=true]:animate-none",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 typo-caption text-on-surface-muted", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  indicatorSide = "right",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  // по умолчанию "right" — так уже было во всех местах использования до появления пропа,
  // менять дефолт на "left" означало бы молча перекрасить весь существующий Select в проекте.
  // Критерий (черновой): "right" — всегда, если нет особой причины для другого; "left" — когда
  // в списке уже занят правый слот осмысленным содержимым (шорткат, счётчик, вторичный текст) и
  // чек-марку там тесно. Ориентир для Combobox и будущих списков с чек-марком (группа 5).
  indicatorSide?: "left" | "right"
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 typo-body-sm outline-hidden select-none",
        indicatorSide === "right" ? "pr-8 pl-1.5" : "pl-8 pr-1.5",
        "focus:bg-surface-hover focus:text-on-surface-hover",
        "data-disabled:pointer-events-none data-disabled:text-on-disabled",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute flex size-4 items-center justify-center",
          indicatorSide === "right" ? "right-2" : "left-2"
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-surface-overlay py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-surface-overlay py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
