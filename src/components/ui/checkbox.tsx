import * as React from "react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check, Minus } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative flex size-4 shrink-0 items-center justify-center rounded-sm",
        "border border-border-input bg-transparent transition-colors outline-none",
        // область нажатия больше рамки: сам квадрат остаётся 16×16
        "after:absolute after:-inset-x-2 after:-inset-y-2",
        "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
        // enabled: обязателен — иначе выбранное состояние перебивает disabled:
        // у утилит Tailwind одинаковая специфичность, и спор решает порядок в CSS, а не в списке
        "enabled:data-[state=checked]:border-primary enabled:data-[state=checked]:bg-primary enabled:data-[state=checked]:text-on-primary",
        "enabled:data-[state=indeterminate]:border-primary enabled:data-[state=indeterminate]:bg-primary enabled:data-[state=indeterminate]:text-on-primary",
        // ошибка видна только на невыбранном: у выбранного рамка остаётся primary (так же в Figma)
        "data-[state=unchecked]:aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-on-disabled",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <Check className="size-3 group-data-[state=indeterminate]/checkbox:hidden" />
        <Minus className="hidden size-3 group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
