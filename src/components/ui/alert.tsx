import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_minmax(0,1fr)] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_minmax(0,1fr)] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
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

// role зависит от variant, не хардкод: role="alert" — это ARIA live-region
// aria-live="assertive", скринридер прерывает текущую речь и объявляет
// содержимое немедленно. Уместно для warning/danger (реальная проблема,
// нужна немедленная реакция), но не для default/info/success — на них
// role="alert" прерывал бы скринридер по любому нейтральному сообщению.
// role="status" — aria-live="polite", объявляется, когда пользователь
// закончит текущее действие, не перебивая. Проп role можно передать явно —
// {...props} идёт после, так что явное значение всегда выигрывает.
const assertiveVariants = new Set(["warning", "danger"])

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const resolvedVariant = variant ?? "default"
  const role = assertiveVariants.has(resolvedVariant) ? "alert" : "status"
  return <div data-slot="alert" role={role} className={cn(alertVariants({ variant }), className)} {...props} />
}

// typo-label-md, без цвета — наследует text-on-* варианта (как в оригинале,
// где AlertTitle не задаёт свой цвет). 14px/500 у label-md совпадает с тем,
// что AlertTitle реально получает по каскаду от Alert (text-sm + font-medium),
// а не typo-heading-4 — тот прецедент для заголовков покрупнее (Card/Empty).
// break-words обязателен вместе с line-clamp: без него одно длинное слово без
// пробелов не может перенестись внутри строки, упирается в край колонки и
// обрезается браузером «вслепую», без добавления многоточия — line-clamp
// добавляет «…» только когда у него есть реальная точка переноса на границе.
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-3 min-h-4 break-words typo-label-md tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        // block, не grid/flex: у grid- и flex-item'ов есть свой min-width:auto
        // (считается по max-content контента), который перебивает ширину трека/
        // контейнера — неразрывное слово всё равно распирает ячейку изнутри, даже
        // когда сам трек уже minmax(0,1fr). У обычного блочного потока такого
        // скрытого пола нет — текст переносится по ширине родителя как есть.
        "col-start-2 block space-y-1 break-words typo-body-sm text-on-surface-muted [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
