import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5",
    "typo-label-sm",
    "[&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary",
        secondary: "bg-primary-subtle text-on-primary-subtle",
        neutral: "bg-neutral text-on-neutral",
        outline: "border border-border text-on-surface",
        danger: "bg-danger text-on-danger",
        "danger-subtle": "bg-danger-subtle text-on-danger-subtle",
        success: "bg-success-subtle text-on-success-subtle",
        warning: "bg-warning-subtle text-on-warning-subtle",
        info: "bg-info-subtle text-on-info-subtle",
      },
    },
    defaultVariants: { variant: "primary" },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
