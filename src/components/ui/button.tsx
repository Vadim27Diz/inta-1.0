import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "transition-colors outline-none",
    // Кольцо фокуса — outline, а не ring: зазор прозрачный и показывает подложку,
    // поэтому кнопка одинаково выглядит на surface и на surface-raised.
    "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "bg-primary-subtle text-on-primary-subtle hover:bg-primary-subtle-hover active:bg-primary-subtle-pressed",
        neutral: "bg-neutral text-on-neutral hover:bg-neutral-hover active:bg-neutral-pressed",
        outline: "border border-border text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        ghost: "text-on-surface hover:bg-surface-hover hover:text-on-surface-hover",
        danger: "bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-pressed",
        "danger-subtle":
          "bg-danger-subtle text-on-danger-subtle hover:bg-danger-subtle-hover active:bg-danger-subtle-pressed",
        inverse: "bg-inverse text-on-inverse hover:bg-inverse-hover active:bg-inverse-pressed",
        link: "text-link hover:text-link-hover disabled:bg-transparent",
        "link-danger": "text-link-danger hover:text-link-danger-hover disabled:bg-transparent",
      },
      // one typo-* per size, never on the base: custom utilities have equal specificity,
      // so two of them on one element would be decided by CSS order, not by class order
      size: {
        sm: "h-8 px-3 typo-label-sm [&_svg]:size-4",
        md: "h-9 px-4 py-2 typo-label-md [&_svg]:size-4",
        lg: "h-10 px-6 typo-label-lg [&_svg]:size-5",
        icon: "size-9 typo-label-md [&_svg]:size-4",
        "icon-sm": "size-8 typo-label-md [&_svg]:size-4",
        "icon-lg": "size-10 typo-label-md [&_svg]:size-5",
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
