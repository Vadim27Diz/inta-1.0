import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md typo-label-md",
    "transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover active:bg-secondary-pressed",
        neutral: "bg-neutral text-on-neutral hover:bg-neutral-hover active:bg-neutral-pressed",
        outline: "border border-border bg-surface text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        ghost: "text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        danger: "bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-pressed",
        link: "text-link hover:text-link-hover underline-offset-4 hover:underline disabled:bg-transparent",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
