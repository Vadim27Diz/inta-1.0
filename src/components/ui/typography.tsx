import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "typo-heading-1 text-on-surface",
      h2: "typo-heading-2 text-on-surface",
      h3: "typo-heading-3 text-on-surface",
      h4: "typo-heading-4 text-on-surface",
      p: "typo-body-md text-on-surface",
      lead: "typo-body-lg text-on-surface-muted",
      // тот же стиль, что h4 — эмфаза без уровня заголовка, другой html-тег
      large: "typo-heading-4 text-on-surface",
      small: "typo-label-md text-on-surface",
      muted: "typo-body-sm text-on-surface-muted",
      blockquote: "typo-body-md text-on-surface border-l-2 border-border pl-6 italic",
      "inline-code": "typo-code text-on-surface rounded-sm bg-surface-muted px-1.5 py-0.5",
      list: "typo-body-md text-on-surface list-disc pl-6 [&>li]:mt-2",
    },
  },
  defaultVariants: { variant: "p" },
})

const defaultTag = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
  blockquote: "blockquote",
  "inline-code": "code",
  list: "ul",
} as const satisfies Record<NonNullable<VariantProps<typeof typographyVariants>["variant"]>, string>

function Typography({
  className,
  variant = "p",
  asChild = false,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : (defaultTag[variant ?? "p"] as React.ElementType)

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
