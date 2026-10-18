import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-surface-raised text-on-surface-raised border-border",
        info: "bg-info-subtle text-on-info-subtle border-border",
        success: "bg-success-subtle text-on-success-subtle border-border",
        warning: "bg-warning-subtle text-on-warning-subtle border-border",
        danger: "bg-danger-subtle text-on-danger-subtle border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

// typo-label-md, без цвета — наследует text-on-* варианта (как в оригинале,
// где AlertTitle не задаёт свой цвет). 14px/500 у label-md совпадает с тем,
// что AlertTitle реально получает по каскаду от Alert (text-sm + font-medium),
// а не typo-heading-4 — тот прецедент для заголовков покрупнее (Card/Empty).
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 typo-label-md tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 typo-body-sm text-on-surface-muted [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
