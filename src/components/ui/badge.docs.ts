import type { ComponentDocs } from "@/docs/types"

export const badgeDocs: ComponentDocs = {
  title: "Badge",
  purpose: {
    ru: "Badge — маленькая цветная метка для статуса, категории или счётчика рядом с другим контентом.",
    en: "Badge is a small colored label for a status, a category, or a counter next to other content.",
  },
  whenToUse: [
    {
      ru: "Нужно показать статус объекта («Активен», «В архиве», «Ошибка») коротким словом рядом с его названием.",
      en: "An object's status (“Active”, “Archived”, “Error”) needs a short word next to its name.",
    },
    {
      ru: "Нужен счётчик — число непрочитанных, количество элементов в списке.",
      en: "A counter is needed — unread count, number of items in a list.",
    },
    {
      ru: "Нужно визуально выделить категорию или тег в списке, карточке или таблице.",
      en: "A category or tag needs to stand out in a list, a card, or a table.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Клик по элементу должен запускать действие — Badge не предназначен для интерактивности.",
        en: "Clicking the element should trigger an action — Badge isn't meant to be interactive.",
      },
      insteadOf: {
        name: "Button",
        description: { ru: "кнопка нужного размера, например variant=\"outline\" size=\"sm\"", en: "a button of the right size, e.g. variant=\"outline\" size=\"sm\"" },
      },
    },
    {
      description: {
        ru: "Сообщение достаточно важное, чтобы занимать собственный заметный блок, а не маленькую метку рядом с текстом.",
        en: "The message is important enough to need its own prominent block, not a small label next to text.",
      },
      insteadOf: {
        name: "Alert",
        description: { ru: "заметное сообщение о статусе", en: "a prominent status message" },
      },
    },
  ],
  anatomy: [
    {
      name: "Badge",
      description: {
        ru: "единственный элемент — текст, иконка или и то и другое (gap-1 между ними, иконка фиксированного размера).",
        en: "the single element — text, an icon, or both (gap-1 between them, the icon at a fixed size).",
      },
    },
  ],
  variantGuidance: [
    {
      ru: "primary/secondary — акцентные статусы без конкретной эмоциональной окраски. neutral — метка без оценки (например, категория). outline — минимальный вес, для плотных таблиц и списков. success/warning/info/danger-subtle — статус с понятной окраской, но без тревоги. danger — то, что требует внимания прямо сейчас.",
      en: "primary/secondary are accent statuses with no particular emotional charge. neutral is a label with no judgment (e.g. a category). outline is the lightest weight, for dense tables and lists. success/warning/info/danger-subtle carry a clear color meaning without raising alarm. danger needs attention right now.",
    },
  ],
  variants: [
    { name: "primary", description: { ru: "акцентный статус", en: "an accent status" } },
    { name: "secondary", description: { ru: "менее яркий акцентный статус", en: "a quieter accent status" } },
    { name: "neutral", description: { ru: "метка без оценки, например категория", en: "a label with no judgment, e.g. a category" } },
    { name: "outline", description: { ru: "минимальный вес — для плотных таблиц и списков", en: "the lightest weight — for dense tables and lists" } },
    { name: "danger", description: { ru: "требует внимания прямо сейчас", en: "needs attention right now" } },
    { name: "danger-subtle", description: { ru: "проблема, но без тревоги", en: "a problem, but not an alarming one" } },
    { name: "success", description: { ru: "успешный статус", en: "a successful status" } },
    { name: "warning", description: { ru: "статус, требующий внимания", en: "a status that needs attention" } },
    { name: "info", description: { ru: "информационный статус", en: "an informational status" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "Текст — одно-два слова или число, не предложение.",
      en: "Text is one or two words, or a number — not a sentence.",
    },
    {
      ru: "Счётчик с переполнением — показывайте предел со знаком «+» («99+»), не бесконечно растущее число.",
      en: "A counter that overflows shows a cap with a “+” (“99+”), not an endlessly growing number.",
    },
    {
      ru: "Не дублируйте в бейдже то, что уже сказано рядом текстом — не «Статус: Активен», просто «Активен».",
      en: "Don't repeat in the badge what's already said nearby — not “Status: Active”, just “Active”.",
    },
  ],
  accessibility: [
    {
      ru: "Badge рендерится как обычный <span> (или как переданный элемент при asChild) без ARIA-роли — текст читается скринридером как часть обычного потока рядом с тем, к чему он относится, без отдельного объявления.",
      en: "Badge renders as a plain <span> (or whatever element asChild passes) with no ARIA role — its text is read by a screen reader as part of the normal flow next to whatever it's attached to, with no separate announcement.",
    },
    {
      ru: "Если смысл передаётся только цветом варианта (например, danger против success), сам текст должен называть статус словами — цвет один не считывается скринридером и недоступен людям с нарушением цветового восприятия.",
      en: "If the meaning is carried only by the variant's color (e.g. danger vs success), the text itself must name the status in words — color alone isn't picked up by a screen reader and isn't accessible to people with color vision deficiencies.",
    },
    {
      ru: "У Badge нет собственного кольца фокуса — он задуман неинтерактивным. Если делаете его кликабельным через asChild (например, фильтр-чип), добавляйте focus-visible кольцо и обработку клавиатуры сами.",
      en: "Badge has no focus ring of its own — it's meant to be non-interactive. If you make it clickable via asChild (e.g. a filter chip), add a focus-visible ring and keyboard handling yourself.",
    },
  ],
  related: [
    { name: "Avatar", description: { ru: "AvatarBadge — похожая по смыслу, но отдельная точка-индикатор в углу аватара", en: "AvatarBadge is a similarly named but separate status dot on an avatar's corner" } },
    { name: "Button", description: { ru: "интерактивное действие того же визуального веса", en: "an interactive action of similar visual weight" } },
    { name: "Alert", description: { ru: "заметное сообщение о статусе, а не инлайновая метка", en: "a prominent status message, not an inline label" } },
  ],
  forDevelopers: [
    {
      ru: "asChild — Radix Slot (Slot.Root), тот же паттерн, что у Button: вместо <span> рендерится переданный элемент с теми же классами.",
      en: "asChild is Radix Slot (Slot.Root), the same pattern as Button — the passed element renders instead of <span>, with the same classes.",
    },
    {
      ru: "В badgeVariants нет focus-visible классов (в отличие от buttonVariants) — при интерактивном использовании добавляйте кольцо фокуса сами.",
      en: "badgeVariants has no focus-visible classes (unlike buttonVariants) — add a focus ring yourself for interactive use.",
    },
    {
      ru: "Иконка — обычный SVG-ребёнок, размер фиксирован классом ([&_svg]:size-3), pointer-events-none — тот же приём, что у Button.",
      en: "The icon is a plain SVG child, its size fixed via a class ([&_svg]:size-3), pointer-events-none — the same approach as Button.",
    },
  ],
}
