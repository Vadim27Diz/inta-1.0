import * as React from "react"
import { cn } from "cn"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-border bg-surface-raised py-6 text-on-surface-raised shadow-sm",
        className
      )}
      {...props}
    />
  )
}

// Не часть исходника shadcn — добавлен по запросу, т.к. у Card нет своего слота под
// картинку/медиа сверху (у Empty это делает EmptyMedia). -mt-6 компенсирует py-6
// родителя, чтобы картинка легла впритык к верхнему краю карточки, rounded-t-xl
// срезает её под тот же радиус, что и сама карточка. Стилизацию <img> (aspect-ratio,
// object-fit) оставляем потребителю — CardMedia только обрезает и красит радиус.
function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-media" className={cn("-mt-6 overflow-hidden rounded-t-xl", className)} {...props} />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

// typo-heading-4 text-on-surface — тот же выбор, что у Typography variant="large"
// и EmptyTitle, для той же роли: эмфаза без уровня заголовка. Оригинал не задаёт
// размер шрифта вообще (только leading-none font-semibold, наследует окружающий) —
// каталог так не умеет, новый токен не заводим, см. прецедент в Empty.
//
// min-w-0 на Title/Description — третье отступление (как у EmptyDescription): с
// CardAction рядом CardHeader становится grid-cols-[1fr_auto], и без явного
// min-width:0 грид-ячейка 1fr считает implicit minimum по max-content заголовка/
// описания и вылезает за карточку вместо переноса — тот же баг, что у Empty,
// только в grid, а не в flex. break-words на Description — тот же приём, что у
// EmptyDescription: без него внутри уже верно сжатой ячейки длинное «слово» без
// пробелов всё равно вылезает за свой край. Проверено историей Content (длинный
// заголовок + CardAction, и отдельно — голое длинное слово в описании).
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("min-w-0 typo-heading-4 text-on-surface", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("min-w-0 break-words typo-body-sm text-on-surface-muted", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />
  )
}

export { Card, CardMedia, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
