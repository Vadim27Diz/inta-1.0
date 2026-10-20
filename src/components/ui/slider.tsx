import * as React from "react"
import { cn } from "cn"
import { Slider as SliderPrimitive } from "radix-ui"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabel,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Доступное имя бегунка(ов) — одна строка для одного значения, массив для диапазона (по порядку min → max). Компонент сам его не задаёт. */
  thumbLabel?: string | string[]
}) {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-[orientation=vertical]:h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-border-input",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          "data-disabled:bg-disabled"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "data-disabled:bg-disabled"
          )}
        />
      </SliderPrimitive.Track>
      {values.map((_, i) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={i}
          aria-label={Array.isArray(thumbLabel) ? thumbLabel[i] : thumbLabel}
          className={cn(
            "block size-4 shrink-0 rounded-full border border-primary bg-surface shadow-xs outline-none transition-colors",
            "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
            "data-disabled:pointer-events-none data-disabled:border-transparent data-disabled:bg-disabled"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
