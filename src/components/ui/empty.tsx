import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm min-w-0 flex-col items-center gap-2 text-center", className)}
      {...props}
    />
  )
}

// variant=icon: bg-surface-muted + text-on-surface (не text-on-surface-muted) — осознанное
// исключение из правила «bg-X + text-on-X», как в исходнике shadcn: на приглушённой плашке
// иконке нужен полный контраст, иначе она теряется. Решение human-approved (см. ревью Empty).
const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-on-surface [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

// typo-heading-4 text-on-surface — тот же выбор, что у Typography variant="large" для
// «эмфазы без уровня заголовка, другой html-тег»; в каталоге нет точного аналога
// text-lg/font-medium/tracking-tight из исходника shadcn, новый токен не заводим.
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("typo-heading-4 text-on-surface", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        // w-full min-w-0 break-words — без них EmptyHeader (items-center) не стягивает
        // описание шириной: при длинном «слове» без пробелов блок считает shrink-to-fit
        // по min-content и вылезает за max-w-sm, не перенося текст. Третье отступление от
        // исходника shadcn, добавлено после проверки истории Content с голым словом.
        "w-full min-w-0 typo-body-sm break-words text-on-surface-muted [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link-hover",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-4 typo-body-sm text-balance", className)}
      {...props}
    />
  )
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia }
