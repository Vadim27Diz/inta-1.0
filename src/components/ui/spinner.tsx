import * as React from "react"
import { cn } from "cn"
import { LoaderCircle } from "lucide-react"

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof LoaderCircle>) {
  return (
    <LoaderCircle
      data-slot="spinner"
      role="status"
      aria-label="Загрузка"
      className={cn("size-4 text-on-surface-muted motion-safe:animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
