import * as React from "react"
import { cn } from "cn"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer group/radio relative flex aspect-square size-4 shrink-0 items-center justify-center",
        "rounded-full border border-border-input bg-transparent transition-colors outline-none",
        "after:absolute after:-inset-x-2 after:-inset-y-2",
        "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
        "enabled:data-[state=checked]:border-primary",
        "data-[state=unchecked]:aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span className="block size-2 rounded-full bg-primary group-disabled/radio:bg-on-disabled" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
