import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

const nativeSelectVariants = cva(
  [
    "w-full min-w-0 appearance-none rounded-md border border-border-input bg-transparent text-on-surface",
    "transition-colors outline-none",
    // кольцо фокуса поля — вплотную, скругление само повторяет radius (см. input.tsx)
    "focus-visible:ring-3 focus-visible:ring-focus-ring",
    "aria-invalid:border-danger",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-on-disabled",
  ],
  {
    variants: {
      size: {
        sm: "h-8 pl-3 pr-8 typo-body-sm",
        md: "h-9 pl-4 pr-9 typo-body-sm",
        lg: "h-10 pl-4 pr-9 typo-body-md",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function NativeSelect({
  className,
  size,
  disabled,
  ...props
}: Omit<React.ComponentProps<"select">, "size"> &
  VariantProps<typeof nativeSelectVariants>) {
  // className (ширина — w-48 и т.п.) идёт на обёртку, а не на <select>: иначе <select>
  // сужается, а обёртка остаётся w-full родителя — шеврон (он позиционируется от обёртки)
  // повисает у края родителя, оторванный от реального правого края поля.
  return (
    <div className={cn("relative inline-block w-full", className)}>
      <select
        data-slot="native-select"
        disabled={disabled}
        className={cn(nativeSelectVariants({ size }), "w-full")}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-on-surface-muted",
          disabled && "text-on-disabled"
        )}
      />
    </div>
  )
}

export { NativeSelect, nativeSelectVariants }
