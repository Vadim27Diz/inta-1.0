import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

const labelVariants = cva(
  "inline-flex items-center gap-1 select-none text-on-surface",
  {
    variants: {
      size: {
        sm: "typo-label-sm",
        md: "typo-label-md",
        lg: "typo-label-lg",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function Label({
  className,
  required = false,
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    /** Звёздочка обязательного поля: декорация, из дерева доступности скрыта */
    required?: boolean
  }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        labelVariants({ size }),
        // disabled приходит от контрола: либо сосед-peer, либо обёртка group с data-disabled.
        // *: красит и звёздочку — у прямого потомка свой цвет, и он перебил бы цвет корня.
        "peer-disabled:cursor-not-allowed peer-disabled:text-on-disabled peer-disabled:*:text-on-disabled",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-on-disabled group-data-[disabled=true]:*:text-on-disabled",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-on-surface-danger">
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  )
}

export { Label, labelVariants }
