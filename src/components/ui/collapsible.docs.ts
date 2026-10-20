import type { ComponentDocs } from "@/docs/types"

export const collapsibleDocs: ComponentDocs = {
  title: "Collapsible",
  purpose: {
    ru: "Collapsible скрывает и показывает один блок содержимого по клику на триггер — прячет второстепенные подробности, не убирая их со страницы совсем.",
    en: "Collapsible hides and reveals a single block of content on a trigger click — tucking away secondary detail without removing it from the page entirely.",
  },
  whenToUse: [
    {
      ru: "Контент важен не всем пользователям сразу — подробности, расширенные настройки, техническое описание — и по умолчанию его можно скрыть.",
      en: "Not every user needs the content right away — details, advanced settings, a technical description — so it can stay hidden by default.",
    },
    {
      ru: "Нужно сократить длину страницы или панели, оставив доступ к скрытому блоку в один клик.",
      en: "The page or panel needs to read shorter, while the hidden block stays one click away.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Контент должен быть виден сразу всем — Collapsible по умолчанию скрывает содержимое и требует лишнего клика.",
        en: "The content must be visible to everyone right away — Collapsible hides it by default and adds an extra click.",
      },
    },
    {
      description: {
        ru: "Нужно несколько независимых блоков, где открытие одного не обязано закрывать другие, и при этом должна быть видна рамка/заголовок каждого как отдельной секции — отдельного компонента для такого списка секций в наборе пока нет, Collapsible сам по себе не добавляет ни рамки, ни заголовка.",
        en: "Several independent blocks are needed, where opening one doesn't have to close the others, each with its own visible border/heading as a distinct section — there's no dedicated component for that list of sections in the kit yet, and Collapsible itself adds neither a border nor a heading.",
      },
    },
  ],
  anatomy: [
    { name: "Collapsible", description: { ru: "корень — хранит состояние open/closed (controlled через open/onOpenChange или uncontrolled через defaultOpen).", en: "the root — holds the open/closed state (controlled via open/onOpenChange, or uncontrolled via defaultOpen)." } },
    { name: "CollapsibleTrigger", description: { ru: "переключает состояние по клику — обычно оборачивает Button через asChild.", en: "toggles the state on click — usually wraps a Button via asChild." } },
    { name: "CollapsibleContent", description: { ru: "скрываемый блок — присутствует в DOM только пока открыт или идёт анимация закрытия.", en: "the hideable block — present in the DOM only while open or mid-close animation." } },
  ],
  variants: [],
  states: [],
  contentRules: [
    {
      ru: "Текст триггера называет содержимое, не действие с интерфейсом: «Технические детали», не «Развернуть блок».",
      en: "The trigger's label names the content, not the UI action: “Technical details”, not “Expand this block”.",
    },
    {
      ru: "Внутри CollapsibleContent — цельный блок по смыслу (абзац, список, набор полей), не обрывок текста без контекста.",
      en: "CollapsibleContent holds one coherent block (a paragraph, a list, a set of fields) — not a fragment of text with no context.",
    },
  ],
  accessibility: [
    {
      ru: "CollapsibleTrigger — нативный <button> (или наследует семантику обёрнутого Button через asChild): Tab переводит на него фокус, Enter и Space переключают состояние — автоматически, без лишней настройки.",
      en: "CollapsibleTrigger is a native <button> (or inherits the semantics of the wrapped Button via asChild) — Tab focuses it, Enter and Space toggle the state — automatically, with no extra setup.",
    },
    {
      ru: "Триггер несёт aria-expanded, отражающий текущее состояние, и aria-controls, указывающий на CollapsibleContent, когда блок открыт — скринридер объявляет «развёрнуто»/«свёрнуто» сам, без ручной разметки.",
      en: "The trigger carries aria-expanded reflecting the current state, and aria-controls pointing at CollapsibleContent while it's open — a screen reader announces “expanded”/“collapsed” on its own, with no manual markup.",
    },
    {
      ru: "Закрытый CollapsibleContent получает нативный атрибут hidden — скринридер и Tab пропускают его содержимое целиком, а не просто визуально прячут.",
      en: "A closed CollapsibleContent gets the native hidden attribute — a screen reader and Tab skip its content entirely, not just hide it visually.",
    },
  ],
  related: [],
  forDevelopers: [
    {
      ru: "Прямой проброс Radix Collapsible.Root/Trigger/Content без собственной логики-обёртки — для проверки поведения ARIA смотрите исходник @radix-ui/react-collapsible в node_modules, а не документацию Radix по памяти.",
      en: "A direct pass-through of Radix Collapsible.Root/Trigger/Content with no wrapper logic of its own — to verify ARIA behavior, read @radix-ui/react-collapsible's source in node_modules rather than Radix's docs from memory.",
    },
    {
      ru: "aria-controls у триггера проставляется только когда блок открыт (context.open ? contentId : undefined) — при закрытом состоянии атрибута нет вовсе, это поведение самого Radix, не нашей обёртки.",
      en: "aria-controls on the trigger is set only while the block is open (context.open ? contentId : undefined) — when closed, the attribute is absent entirely; that's Radix's own behavior, not our wrapper's.",
    },
    {
      ru: "CollapsibleContent анимируется через CSS-переменные --radix-collapsible-content-height/width, которые Radix сам считает и выставляет инлайн-стилем — у наших классов открытия/закрытия (data-state) нет.",
      en: "CollapsibleContent animates via the --radix-collapsible-content-height/width CSS variables, which Radix measures and sets as an inline style itself — our own open/close classes keyed on data-state don't exist here.",
    },
  ],
  openQuestions: [
    {
      ru: "У компонента пока только story Default (defaultOpen: true) — нет States, поэтому раздел «Состояния» пуст, а не придуман. Нужна ли story States, показывающая closed/open рядом и фокус на триггере?",
      en: "The component currently has only a Default story (defaultOpen: true) — no States, hence the empty “States” section rather than an invented one. Is a States story needed, showing closed/open side by side plus focus on the trigger?",
    },
  ],
}
