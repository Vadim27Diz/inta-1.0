import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

function Label({
  className,
  required = false,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  /** Звёздочка обязательного поля: декорация, из дерева доступности скрыта */
  required?: boolean
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-flex items-center gap-1 select-none typo-label-md text-on-surface",
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

export { Label }
