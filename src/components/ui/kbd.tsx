import * as React from "react"
import { cn } from "cn"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border-input",
        "bg-surface-muted px-1.5 typo-code text-on-surface-muted",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
