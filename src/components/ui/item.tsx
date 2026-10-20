import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import { Separator } from "./separator"

// role="listitem" на Item имеет смысл только рядом с role="list" на ItemGroup — Item вне группы
// его не получает (невалидный ARIA: listitem без списка-родителя). Сам Item об этом не знает,
// кроме как через контекст от ItemGroup.
const ItemGroupContext = React.createContext(false)

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ItemGroupContext.Provider value={true}>
      <div
        role="list"
        data-slot="item-group"
        className={cn("group/item-group flex flex-col", className)}
        {...props}
      />
    </ItemGroupContext.Provider>
  )
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  [
    "group/item flex flex-wrap items-center rounded-md border border-transparent typo-body-sm text-on-surface",
    "outline-none transition-colors duration-100",
    // фокус — только на реально фокусируемом теге (asChild рендерит <a>/<button>), outline
    // безопасен без условия: focus-visible не сработает на обычном div без tabindex
    "focus-visible:outline-solid focus-visible:outline-2 outline-offset-2 outline-focus-ring",
    // hover — только когда корень реально рендерится как ссылка (asChild + <a>), не на статичном div
    "[a]:transition-colors [a]:hover:bg-surface-hover",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-surface-muted",
      },
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Item({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const inGroup = React.useContext(ItemGroupContext)
  const Comp = asChild ? Slot.Root : "div"
  const item = (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      // не-asChild корень — обычный div, role="listitem" ставим прямо на него;
      // asChild — роль уходит на обёртку ниже, чтобы не перекрыть роль <a>/<button>
      role={inGroup && !asChild ? "listitem" : undefined}
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
  if (inGroup && asChild) {
    // display:contents — обёртка не создаёт свой layout-бокс, Comp остаётся
    // реальным flex-ребёнком ItemGroup, а role="listitem" достаётся обёртке,
    // не самому <a>/<button> (иначе их implicit-роль была бы перекрыта)
    return <div role="listitem" className="contents">{item}</div>
  }
  return item
}

const itemMediaVariants = cva(
  [
    "flex shrink-0 items-center justify-center gap-2 [&_svg]:pointer-events-none",
    "group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 rounded-sm border border-border bg-surface-muted [&_svg:not([class*='size-'])]:size-4",
        image: "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function ItemMedia({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("flex w-fit items-center gap-2 typo-label-md text-on-surface", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 typo-body-sm text-balance text-on-surface-muted",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link-hover",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="item-actions" className={cn("flex items-center gap-2", className)} {...props} />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
