import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // дорожка 36×20, бегунок 16 с отступом 2: ход = 36 − 4 − 16 = 16 = translate-x-4
        "peer group/switch relative inline-flex h-5 w-9 shrink-0 items-center rounded-full px-0.5",
        "transition-colors outline-none",
        "after:absolute after:-inset-x-2 after:-inset-y-2",
        "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
        // enabled: иначе цвет дорожки перебивает disabled:bg-disabled
        "enabled:data-[state=unchecked]:bg-border-input enabled:data-[state=checked]:bg-primary",
        "disabled:cursor-not-allowed disabled:bg-disabled",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-switch-thumb transition-transform",
          "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4",
          "group-disabled/switch:bg-on-disabled"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
