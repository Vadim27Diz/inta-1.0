import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const inputVariants = cva(
  [
    "w-full min-w-0 rounded-md border border-border-input bg-transparent text-on-surface",
    "transition-colors outline-none",
    // прозрачный фон, а не bg-surface: поле одинаково выглядит на surface и на surface-raised
    "placeholder:text-on-surface-muted selection:bg-primary selection:text-on-primary",
    // кольцо фокуса — outline, как у Button: зазор прозрачный и показывает подложку
    "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
    // ошибка — только обводка; кольцо фокуса остаётся обычным focus-ring
    "aria-invalid:border-danger",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled",
    "disabled:text-on-disabled disabled:placeholder:text-on-disabled",
    "file:inline-flex file:border-0 file:bg-transparent file:text-on-surface file:typo-label-sm",
  ],
  {
    variants: {
      // один typo-* на размер и ни одного в базе: у кастомных утилит одинаковая специфичность
      size: {
        sm: "h-8 px-3 typo-body-sm",
        md: "h-9 px-4 typo-body-sm",
        lg: "h-10 px-4 typo-body-md",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
