import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-16 w-full rounded-md border border-border-input",
        "bg-transparent px-3 py-2 typo-body-sm text-on-surface transition-colors outline-none",
        "placeholder:text-on-surface-muted selection:bg-primary selection:text-on-primary",
        // кольцо фокуса поля — вплотную, скругление само повторяет radius (см. input.tsx)
        "focus-visible:ring-3 focus-visible:ring-focus-ring",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled",
        "disabled:text-on-disabled disabled:placeholder:text-on-disabled",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
