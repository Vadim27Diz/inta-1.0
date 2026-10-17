import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Avatar as AvatarPrimitive } from "radix-ui"

const avatarVariants = cva("group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
    },
  },
  defaultVariants: { size: "md" },
})

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  // data-size дублирует size — по нему AvatarBadge/AvatarGroupCount читают размер родителя
  // через group-data-[size=…] (своего пропа size у них нет, как и в исходнике shadcn)
  const resolved = size ?? "md"
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={resolved}
      className={cn(avatarVariants({ size: resolved }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-neutral typo-label-sm text-on-neutral uppercase",
        className
      )}
      {...props}
    />
  )
}

// Обобщённая точка в углу (не «статус»-компонент): дефолт bg-primary, как в исходнике shadcn —
// там же bg-green-600 из примера доки только на конкретном инстансе демо, не в самом компоненте.
// Паттерны online/busy/offline — через className на инстансе (bg-success/bg-danger/bg-surface-muted
// в историях), сюда проп не добавляем.
// Размер — size-2.5/3/3.5 под наши size-8/10/12 (пропорция и icon size-2 — те же числа, что у
// shadcn для их default/lg; нашего младшего sm=32 у shadcn соответствует их default=32).
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full",
        "bg-primary text-on-primary ring-2 ring-surface select-none",
        "group-data-[size=sm]/avatar:size-2.5 group-data-[size=sm]/avatar:[&>svg]:size-2",
        "group-data-[size=md]/avatar:size-3 group-data-[size=md]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

// Перекрытие -space-x-2 (8px) — значение из исходника shadcn, не придумано.
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-surface",
        className
      )}
      {...props}
    />
  )
}

// Размер следует размеру аватаров внутри группы (group-has-data-[size=…]), как и сами Avatar —
// 1:1 на наши три размера, а не на уникальные числа.
function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        "bg-surface-muted typo-label-sm text-on-surface-muted ring-2 ring-surface select-none",
        "group-has-data-[size=sm]/avatar-group:size-8 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        "group-has-data-[size=md]/avatar-group:size-10 group-has-data-[size=md]/avatar-group:[&>svg]:size-4",
        "group-has-data-[size=lg]/avatar-group:size-12 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  avatarVariants,
}
