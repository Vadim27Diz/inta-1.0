import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md",
    "transition-colors outline-none",
    "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent",
    "data-[state=on]:bg-surface-hover data-[state=on]:text-on-surface-hover",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        outline:
          "border border-border bg-transparent text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
      },
      size: {
        sm: "size-8 typo-label-sm",
        md: "size-9 typo-label-md",
        lg: "size-10 typo-label-lg",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
