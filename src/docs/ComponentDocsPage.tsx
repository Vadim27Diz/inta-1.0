import type { ReactNode } from "react"
import type { ComponentDocs } from "./types"
import { useLocale } from "./locale"
import { labels } from "./labels"

// Общий шаблон docs-страницы компонента: один React-компонент на секцию
// (а не один монолитный блок), чтобы каждую секцию можно было перемежать
// с <Canvas of={...} /> в MDX-файле компонента — текст дополняет живые
// примеры, не заменяет их. Структура секций одинакова для всех компонентов.

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-8 first:mt-6 first:border-t-0 first:pt-0">
      <h2 className="typo-heading-3 text-on-surface">{title}</h2>
      <div className="mt-3 typo-body-md text-on-surface [&_a]:text-link [&_a:hover]:text-link-hover">
        {children}
      </div>
    </section>
  )
}

function List({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function DocsPurpose({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  return (
    <p className="typo-body-lg text-on-surface" data-testid="docs-purpose">
      {docs.purpose[locale]}
    </p>
  )
}

export function DocsWhenToUse({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.whenToUse.length === 0) return null
  return (
    <Section title={labels.whenToUse[locale]}>
      <List items={docs.whenToUse.map((t) => t[locale])} />
    </Section>
  )
}

export function DocsWhenNotToUse({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.whenNotToUse.length === 0) return null
  return (
    <Section title={labels.whenNotToUse[locale]}>
      <ul className="list-disc space-y-2 pl-5">
        {docs.whenNotToUse.map((entry, i) => (
          <li key={i}>
            {entry.description[locale]}
            {entry.insteadOf && (
              <>
                {" "}
                {labels.insteadOf[locale]}{" "}
                <strong className="font-medium text-on-surface">{entry.insteadOf.name}</strong> —{" "}
                {entry.insteadOf.description[locale]}
              </>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function DocsAnatomy({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.anatomy.length === 0) return null
  return (
    <Section title={labels.anatomy[locale]}>
      <dl className="space-y-3">
        {docs.anatomy.map((part) => (
          <div key={part.name} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt>
              <code className="typo-code rounded bg-surface-muted px-1.5 py-0.5 text-on-surface-muted">
                {part.name}
              </code>
            </dt>
            <dd className="min-w-0">{part.description[locale]}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function VariantList({ items, locale }: { items: ComponentDocs["variants"]; locale: "ru" | "en" }) {
  if (items.length === 0) return null
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((v) => (
        <li key={v.name}>
          <code className="typo-code rounded bg-surface-muted px-1.5 py-0.5 text-on-surface-muted">
            {v.name}
          </code>
          {v.description && <> — {v.description[locale]}</>}
        </li>
      ))}
    </ul>
  )
}

export function DocsVariants({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.variants.length === 0 && !docs.variantGuidance?.length) return null
  return (
    <Section title={labels.variants[locale]}>
      {!!docs.variantGuidance?.length && (
        <div className="mb-4">
          <List items={docs.variantGuidance.map((t) => t[locale])} />
        </div>
      )}
      <VariantList items={docs.variants} locale={locale} />
    </Section>
  )
}

export function DocsStates({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.states.length === 0) return null
  return (
    <Section title={labels.states[locale]}>
      <VariantList items={docs.states} locale={locale} />
    </Section>
  )
}

export function DocsContentRules({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.contentRules.length === 0) return null
  return (
    <Section title={labels.contentRules[locale]}>
      <List items={docs.contentRules.map((t) => t[locale])} />
    </Section>
  )
}

export function DocsAccessibility({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.accessibility.length === 0) return null
  return (
    <Section title={labels.accessibility[locale]}>
      <List items={docs.accessibility.map((t) => t[locale])} />
    </Section>
  )
}

// Отдельный, визуально приглушённый блок в конце страницы — реализация
// (Tailwind-классы, токены, data-slot, Radix, npm-скрипты, поведение
// браузера), которая не нужна дизайнеру/продакту для решения о том,
// когда и как использовать компонент.
export function DocsForDevelopers({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (!docs.forDevelopers?.length) return null
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="typo-label-lg text-on-surface-muted">{labels.forDevelopers[locale]}</h2>
      <div className="mt-3 typo-body-sm text-on-surface-muted">
        <List items={docs.forDevelopers.map((t) => t[locale])} />
      </div>
    </section>
  )
}

export function DocsRelated({ docs }: { docs: ComponentDocs }) {
  const locale = useLocale()
  if (docs.related.length === 0) return null
  return (
    <Section title={labels.related[locale]}>
      <div className="flex flex-wrap gap-2" role="list">
        {docs.related.map((r) => (
          <span
            key={r.name}
            role="listitem"
            className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-on-surface-raised"
            title={r.description[locale]}
          >
            {r.name}
          </span>
        ))}
      </div>
    </Section>
  )
}
