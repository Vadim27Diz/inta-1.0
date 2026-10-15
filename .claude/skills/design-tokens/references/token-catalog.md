# Token catalog (generated)

Generated from `tokens.json` by `scripts/build-tokens.mjs`. Primitives are not listed: components must never use them.

## Theme (modes: Light, Dark)

| Figma variable | CSS variable | Tailwind class (typical) | Light → | Dark → | Purpose |
|---|---|---|---|---|---|
| `color/surface` | `--ds-color-surface` | `bg-surface` | `color/white` | `color/zinc/950` | Page background |
| `color/on-surface` | `--ds-color-on-surface` | `text-on-surface` | `color/zinc/950` | `color/zinc/50` | Default text and icons |
| `color/surface-raised` | `--ds-color-surface-raised` | `bg-surface-raised` | `color/white` | `color/zinc/900` | Cards, panels |
| `color/on-surface-raised` | `--ds-color-on-surface-raised` | `text-on-surface-raised` | `color/zinc/950` | `color/zinc/50` |  |
| `color/surface-overlay` | `--ds-color-surface-overlay` | `bg-surface-overlay` | `color/white` | `color/zinc/900` | Popovers, menus, dialogs |
| `color/on-surface-overlay` | `--ds-color-on-surface-overlay` | `text-on-surface-overlay` | `color/zinc/950` | `color/zinc/50` |  |
| `color/surface-muted` | `--ds-color-surface-muted` | `bg-surface-muted` | `color/zinc/100` | `color/zinc/800` | Subtle fills: skeleton, code, tracks |
| `color/on-surface-muted` | `--ds-color-on-surface-muted` | `text-on-surface-muted` | `color/zinc/600` | `color/zinc/400` | Secondary text, placeholders, helper text (on any surface) |
| `color/surface-hover` | `--ds-color-surface-hover` | `bg-surface-hover` | `color/zinc/100` | `color/zinc/800` | Hovered/selected rows, menu items, ghost buttons |
| `color/on-surface-hover` | `--ds-color-on-surface-hover` | `text-on-surface-hover` | `color/zinc/900` | `color/zinc/50` |  |
| `color/scrim` | `--ds-color-scrim` | `bg-scrim` | `color/black-alpha/50` | `color/black-alpha/80` | Backdrop behind dialogs and sheets |
| `color/primary/default` | `--ds-color-primary` | `bg-primary` | `brand/primary/600` | `brand/primary/600` |  |
| `color/primary/hover` | `--ds-color-primary-hover` | `bg-primary-hover` | `brand/primary/700` | `brand/primary/700` |  |
| `color/primary/pressed` | `--ds-color-primary-pressed` | `bg-primary-pressed` | `brand/primary/800` | `brand/primary/800` |  |
| `color/on-primary` | `--ds-color-on-primary` | `text-on-primary` | `brand/primary/on` | `brand/primary/on` |  |
| `color/secondary/default` | `--ds-color-secondary` | `bg-secondary` | `brand/secondary/600` | `brand/secondary/600` |  |
| `color/secondary/hover` | `--ds-color-secondary-hover` | `bg-secondary-hover` | `brand/secondary/700` | `brand/secondary/700` |  |
| `color/secondary/pressed` | `--ds-color-secondary-pressed` | `bg-secondary-pressed` | `brand/secondary/800` | `brand/secondary/800` |  |
| `color/on-secondary` | `--ds-color-on-secondary` | `text-on-secondary` | `brand/secondary/on` | `brand/secondary/on` |  |
| `color/neutral/default` | `--ds-color-neutral` | `bg-neutral` | `color/zinc/100` | `color/zinc/800` |  |
| `color/neutral/hover` | `--ds-color-neutral-hover` | `bg-neutral-hover` | `color/zinc/200` | `color/zinc/700` |  |
| `color/neutral/pressed` | `--ds-color-neutral-pressed` | `bg-neutral-pressed` | `color/zinc/300` | `color/zinc/600` |  |
| `color/on-neutral` | `--ds-color-on-neutral` | `text-on-neutral` | `color/zinc/900` | `color/zinc/50` |  |
| `color/danger/default` | `--ds-color-danger` | `bg-danger` | `color/red/600` | `color/red/600` |  |
| `color/danger/hover` | `--ds-color-danger-hover` | `bg-danger-hover` | `color/red/700` | `color/red/700` |  |
| `color/danger/pressed` | `--ds-color-danger-pressed` | `bg-danger-pressed` | `color/red/800` | `color/red/800` |  |
| `color/on-danger` | `--ds-color-on-danger` | `text-on-danger` | `color/white` | `color/white` |  |
| `color/link/default` | `--ds-color-link` | `text-link` | `brand/primary/700` | `brand/primary/400` |  |
| `color/link/hover` | `--ds-color-link-hover` | `text-link-hover` | `brand/primary/800` | `brand/primary/300` |  |
| `color/disabled` | `--ds-color-disabled` | `bg-disabled` | `color/zinc/100` | `color/zinc/800` | Shared disabled fill for all controls |
| `color/on-disabled` | `--ds-color-on-disabled` | `text-on-disabled` | `color/zinc/400` | `color/zinc/500` |  |
| `color/focus-ring` | `--ds-color-focus-ring` | `ring-focus-ring` | `brand/primary/500` | `brand/primary/400` | Focus ring for every focusable control |
| `color/border/default` | `--ds-color-border` | `border-border` | `color/zinc/200` | `color/zinc/800` |  |
| `color/border/input` | `--ds-color-border-input` | `border-border-input` | `color/zinc/300` | `color/zinc/700` |  |
| `color/success/default` | `--ds-color-success` | `bg-success` | `color/green/700` | `color/green/700` |  |
| `color/on-success` | `--ds-color-on-success` | `text-on-success` | `color/white` | `color/white` |  |
| `color/success/subtle` | `--ds-color-success-subtle` | `bg-success-subtle` | `color/green/50` | `color/green/950` |  |
| `color/on-success-subtle` | `--ds-color-on-success-subtle` | `text-on-success-subtle` | `color/green/800` | `color/green/200` |  |
| `color/warning/default` | `--ds-color-warning` | `bg-warning` | `color/amber/500` | `color/amber/500` |  |
| `color/on-warning` | `--ds-color-on-warning` | `text-on-warning` | `color/zinc/950` | `color/zinc/950` |  |
| `color/warning/subtle` | `--ds-color-warning-subtle` | `bg-warning-subtle` | `color/amber/50` | `color/amber/950` |  |
| `color/on-warning-subtle` | `--ds-color-on-warning-subtle` | `text-on-warning-subtle` | `color/amber/900` | `color/amber/200` |  |
| `color/info/default` | `--ds-color-info` | `bg-info` | `color/sky/700` | `color/sky/700` |  |
| `color/on-info` | `--ds-color-on-info` | `text-on-info` | `color/white` | `color/white` |  |
| `color/info/subtle` | `--ds-color-info-subtle` | `bg-info-subtle` | `color/sky/50` | `color/sky/950` |  |
| `color/on-info-subtle` | `--ds-color-on-info-subtle` | `text-on-info-subtle` | `color/sky/800` | `color/sky/200` |  |
| `color/danger/subtle` | `--ds-color-danger-subtle` | `bg-danger-subtle` | `color/red/50` | `color/red/950` |  |
| `color/on-danger-subtle` | `--ds-color-on-danger-subtle` | `text-on-danger-subtle` | `color/red/800` | `color/red/200` |  |
| `color/dataviz/1` | `--ds-color-dataviz-1` | `bg-dataviz-1` | `brand/primary/500` | `brand/primary/400` |  |
| `color/dataviz/2` | `--ds-color-dataviz-2` | `bg-dataviz-2` | `brand/secondary/500` | `brand/secondary/400` |  |
| `color/dataviz/3` | `--ds-color-dataviz-3` | `bg-dataviz-3` | `color/green/500` | `color/green/400` |  |
| `color/dataviz/4` | `--ds-color-dataviz-4` | `bg-dataviz-4` | `color/amber/500` | `color/amber/400` |  |
| `color/dataviz/5` | `--ds-color-dataviz-5` | `bg-dataviz-5` | `color/sky/500` | `color/sky/400` |  |
| `color/link-danger/default` | `--ds-color-link-danger` | `text-link-danger` | `color/red/700` | `color/red/400` |  |
| `color/link-danger/hover` | `--ds-color-link-danger-hover` | `text-link-danger-hover` | `color/red/800` | `color/red/300` |  |
| `color/inverse/default` | `--ds-color-inverse` | `bg-inverse` | `color/zinc/950` | `color/white` |  |
| `color/inverse/hover` | `--ds-color-inverse-hover` | `bg-inverse-hover` | `color/zinc/800` | `color/zinc/200` |  |
| `color/inverse/pressed` | `--ds-color-inverse-pressed` | `bg-inverse-pressed` | `color/zinc/700` | `color/zinc/300` |  |
| `color/on-inverse` | `--ds-color-on-inverse` | `text-on-inverse` | `color/white` | `color/zinc/950` |  |
| `color/danger/subtle-hover` | `--ds-color-danger-subtle-hover` | `bg-danger-subtle-hover` | `color/red/100` | `color/red/900` |  |
| `color/danger/subtle-pressed` | `--ds-color-danger-subtle-pressed` | `bg-danger-subtle-pressed` | `color/red/200` | `color/red/800` |  |
| `color/primary/subtle` | `--ds-color-primary-subtle` | `bg-primary-subtle` | `brand/primary/100` | `brand/primary/800` |  |
| `color/primary/subtle-hover` | `--ds-color-primary-subtle-hover` | `bg-primary-subtle-hover` | `brand/primary/200` | `brand/primary/900` |  |
| `color/primary/subtle-pressed` | `--ds-color-primary-subtle-pressed` | `bg-primary-subtle-pressed` | `brand/primary/300` | `brand/primary/950` |  |
| `color/on-primary-subtle` | `--ds-color-on-primary-subtle` | `text-on-primary-subtle` | `brand/primary/900` | `brand/primary/100` |  |
| `color/on-surface-danger` | `--ds-color-on-surface-danger` | `text-on-surface-danger` | `color/link-danger/default` | `color/link-danger/default` | Red text and icons on any surface: required marker, field error text |

## Component

| Figma variable | CSS variable | Tailwind class (typical) | Value → | Purpose |
|---|---|---|---|---|
| `sidebar/surface` | `--ds-sidebar-surface` | `bg-sidebar-surface` | `color/surface-muted` |  |
| `sidebar/on-surface` | `--ds-sidebar-on-surface` | `text-sidebar-on-surface` | `color/on-surface` |  |
| `sidebar/primary` | `--ds-sidebar-primary` | `bg-sidebar-primary` | `color/primary/default` |  |
| `sidebar/on-primary` | `--ds-sidebar-on-primary` | `text-sidebar-on-primary` | `color/on-primary` |  |
| `sidebar/hover` | `--ds-sidebar-hover` | `bg-sidebar-hover` | `color/surface-hover` |  |
| `sidebar/on-hover` | `--ds-sidebar-on-hover` | `text-sidebar-on-hover` | `color/on-surface-hover` |  |
| `sidebar/border` | `--ds-sidebar-border` | `border-sidebar-border` | `color/border/default` |  |
| `sidebar/focus-ring` | `--ds-sidebar-focus-ring` | `ring-sidebar-focus-ring` | `color/focus-ring` |  |

## Brand (modes: Main, Demo)

| Figma variable | CSS variable | Main | Demo |
|---|---|---|---|
| `brand/primary/50` | `--ds-brand-primary-50` | `color/blue/50` | `color/teal/100` |
| `brand/primary/100` | `--ds-brand-primary-100` | `color/blue/100` | `color/teal/200` |
| `brand/primary/200` | `--ds-brand-primary-200` | `color/blue/200` | `color/teal/300` |
| `brand/primary/300` | `--ds-brand-primary-300` | `color/blue/300` | `color/teal/400` |
| `brand/primary/400` | `--ds-brand-primary-400` | `color/blue/400` | `color/teal/500` |
| `brand/primary/500` | `--ds-brand-primary-500` | `color/blue/500` | `color/teal/600` |
| `brand/primary/600` | `--ds-brand-primary-600` | `color/blue/600` | `color/teal/700` |
| `brand/primary/700` | `--ds-brand-primary-700` | `color/blue/700` | `color/teal/800` |
| `brand/primary/800` | `--ds-brand-primary-800` | `color/blue/800` | `color/teal/900` |
| `brand/primary/900` | `--ds-brand-primary-900` | `color/blue/900` | `color/teal/950` |
| `brand/primary/950` | `--ds-brand-primary-950` | `color/blue/950` | `color/teal/950` |
| `brand/secondary/50` | `--ds-brand-secondary-50` | `color/violet/50` | `color/orange/100` |
| `brand/secondary/100` | `--ds-brand-secondary-100` | `color/violet/100` | `color/orange/200` |
| `brand/secondary/200` | `--ds-brand-secondary-200` | `color/violet/200` | `color/orange/300` |
| `brand/secondary/300` | `--ds-brand-secondary-300` | `color/violet/300` | `color/orange/400` |
| `brand/secondary/400` | `--ds-brand-secondary-400` | `color/violet/400` | `color/orange/500` |
| `brand/secondary/500` | `--ds-brand-secondary-500` | `color/violet/500` | `color/orange/600` |
| `brand/secondary/600` | `--ds-brand-secondary-600` | `color/violet/600` | `color/orange/700` |
| `brand/secondary/700` | `--ds-brand-secondary-700` | `color/violet/700` | `color/orange/800` |
| `brand/secondary/800` | `--ds-brand-secondary-800` | `color/violet/800` | `color/orange/900` |
| `brand/secondary/900` | `--ds-brand-secondary-900` | `color/violet/900` | `color/orange/950` |
| `brand/secondary/950` | `--ds-brand-secondary-950` | `color/violet/950` | `color/orange/950` |
| `brand/primary/on` | `--ds-brand-primary-on` | `color/white` | `color/white` |
| `brand/secondary/on` | `--ds-brand-secondary-on` | `color/white` | `color/white` |
| `font/sans` | `--ds-font-sans` | `Inter` | `IBM Plex Sans` |
| `font/heading` | `--ds-font-heading` | `Inter` | `IBM Plex Serif` |
| `radius/sm` | `--ds-radius-sm` | `4` | `2` |
| `radius/md` | `--ds-radius-md` | `6` | `3` |
| `radius/lg` | `--ds-radius-lg` | `8` | `4` |
| `radius/xl` | `--ds-radius-xl` | `12` | `6` |

## Text styles

| Figma text style | Class | Family | Size / line-height | Weight |
|---|---|---|---|---|
| `heading/1` | `typo-heading-1` | `font/heading` | 36/40px | 600 |
| `heading/2` | `typo-heading-2` | `font/heading` | 30/36px | 600 |
| `heading/3` | `typo-heading-3` | `font/heading` | 24/32px | 600 |
| `heading/4` | `typo-heading-4` | `font/heading` | 20/28px | 600 |
| `body/lg` | `typo-body-lg` | `font/sans` | 18/28px | 400 |
| `body/md` | `typo-body-md` | `font/sans` | 16/24px | 400 |
| `body/sm` | `typo-body-sm` | `font/sans` | 14/20px | 400 |
| `label/md` | `typo-label-md` | `font/sans` | 14/20px | 500 |
| `label/sm` | `typo-label-sm` | `font/sans` | 12/16px | 500 |
| `caption` | `typo-caption` | `font/sans` | 12/16px | 400 |
| `code` | `typo-code` | `font/mono` | 14/20px | 400 |
| `body/xs` | `typo-body-xs` | `font/sans` | 12/16px | 400 |
| `caption-2xs` | `typo-caption-2xs` | `font/sans` | 10/14px | 400 |
| `numeric/md` | `typo-numeric-md` | `font/mono` | 16/24px | 400 |
| `numeric/sm` | `typo-numeric-sm` | `font/mono` | 14/20px | 400 |
| `numeric/xs` | `typo-numeric-xs` | `font/mono` | 12/16px | 400 |
| `numeric/2xs` | `typo-numeric-2xs` | `font/mono` | 10/14px | 400 |
| `label/lg` | `typo-label-lg` | `font/sans` | 16/24px | 500 |
