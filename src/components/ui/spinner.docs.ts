import type { ComponentDocs } from "@/docs/types"

export const spinnerDocs: ComponentDocs = {
  title: "Spinner",
  purpose: {
    ru: "Spinner — вращающийся индикатор того, что процесс идёт, без привязки к доле выполнения и форме будущего контента.",
    en: "Spinner is a rotating indicator that a process is running, with no tie to how much of it is done or the future content's shape.",
  },
  whenToUse: [
    {
      ru: "Процесс короткий или его длительность непредсказуема, и доля выполнения неизвестна — отправка формы, запрос к серверу.",
      en: "The process is short or its duration is unpredictable, and the completed share is unknown — a form submission, a server request.",
    },
    {
      ru: "Нужно показать «идёт загрузка» прямо внутри кнопки или рядом с короткой строкой статуса, не выделяя под это отдельный блок страницы.",
      en: "A “loading” state needs to show right inside a button or next to a short status line, with no separate page block reserved for it.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Доля выполнения известна и выражается числом от 0 до 100.",
        en: "The completed share is known and expressible as a number from 0 to 100.",
      },
      insteadOf: {
        name: "Progress",
        description: { ru: "индикатор с конкретным значением", en: "an indicator with a specific value" },
      },
    },
    {
      description: {
        ru: "Заранее известна форма результата (строка текста, картинка, карточка), и заглушка должна повторять её, а не быть одной абстрактной иконкой.",
        en: "The result's shape is already known (a line of text, an image, a card), and the placeholder should mirror it rather than be one abstract icon.",
      },
      insteadOf: {
        name: "Skeleton",
        description: { ru: "заглушка по форме контента", en: "a placeholder shaped like the content" },
      },
    },
  ],
  anatomy: [
    {
      name: "Spinner",
      description: {
        ru: "единственный элемент — иконка LoaderCircle с анимацией вращения, размер задаётся className.",
        en: "the single element — a LoaderCircle icon with a spin animation, sized via className.",
      },
    },
  ],
  variants: [
    {
      name: "size",
      description: {
        ru: "задаётся произвольным классом размера (size-3…size-8 показаны в story Variants), а не отдельным пропом — по умолчанию size-4.",
        en: "set via a size className (size-3…size-8 are shown in the Variants story), not a separate prop — the default is size-4.",
      },
    },
  ],
  states: [],
  contentRules: [
    {
      ru: "Spinner сам не несёт видимого текста — рядом всегда должна быть подпись (видимая или только для скринридера), объясняющая, что именно загружается.",
      en: "Spinner carries no visible text of its own — a label (visible, or screen-reader-only) explaining what's loading must always sit nearby.",
    },
    {
      ru: "Если видимый текст рядом уже говорит то же самое, что собственный aria-label Spinner («Загрузка…» рядом со спиннером внутри кнопки) — не оставляйте оба: скринридер озвучит фразу дважды, см. «Доступность».",
      en: "If visible text next to it already says the same thing as Spinner's own aria-label (“Loading…” next to the spinner inside a button) — don't leave both: a screen reader will announce the phrase twice, see “Accessibility”.",
    },
  ],
  accessibility: [
    {
      ru: "role=\"status\" + aria-label=\"Загрузка\" на самой иконке — скринридер объявляет текст автоматически, без лишней настройки, в момент, когда Spinner реально появляется в DOM (например, когда вы монтируете его условно при начале загрузки) — не обязательно сразу при первой загрузке страницы, если он уже присутствует в разметке.",
      en: "role=\"status\" + aria-label=\"Загрузка\" on the icon itself — a screen reader announces the text automatically, with no extra setup, at the moment Spinner actually appears in the DOM (e.g. when you mount it conditionally as loading starts) — not necessarily right on the page's first load if it's already present in the markup.",
    },
    {
      ru: "aria-label захардкожен на русском и ничем не управляется через отдельный проп — передайте свой aria-label, если нужен другой язык или более точная формулировка: он перезапишет значение по умолчанию, так как ...props в компоненте идёт после захардкоженных атрибутов.",
      en: "aria-label is hardcoded in Russian and isn't exposed as a separate prop — pass your own aria-label if you need a different language or a more specific phrase: it overrides the default, since ...props in the component comes after the hardcoded attributes.",
    },
    {
      ru: "Внутри Button c видимым текстом рядом (как в story Content) собственный aria-label Spinner добавляется к вычисляемому accessible name кнопки вместе с этим текстом — то есть кнопка озвучивается как «Загрузка Загрузка…», с повтором. Передайте Spinner aria-hidden=\"true\", если рядом уже есть видимый текст с тем же смыслом — это не убирает role=\"status\", но исключает иконку из вычисления имени и из объявления.",
      en: "Inside a Button with visible text next to it (as in the Content story), Spinner's own aria-label gets folded into the button's computed accessible name together with that text — so the button is announced as “Загрузка Загрузка…”, duplicated. Pass Spinner aria-hidden=\"true\" when visible text with the same meaning already sits next to it — this doesn't remove role=\"status\", but it excludes the icon from the name computation and the announcement.",
    },
    {
      ru: "Spinner не интерактивен и не получает фокус с клавиатуры — ожидаемое поведение индикатора, не поля ввода.",
      en: "Spinner isn't interactive and doesn't receive keyboard focus — expected for a display indicator, not an input field.",
    },
    {
      ru: "Анимация вращения — motion-safe:animate-spin: применяется только если пользователь не включил «уменьшить анимацию» (prefers-reduced-motion: reduce), автоматически, та же механика, что у Skeleton.",
      en: "The spin animation is motion-safe:animate-spin — it applies only when the user hasn't requested reduced motion (prefers-reduced-motion: reduce), automatically, the same mechanism as Skeleton's.",
    },
  ],
  related: [
    { name: "Progress", description: { ru: "индикатор с известным значением и шкалой", en: "an indicator with a known value and scale" } },
    { name: "Skeleton", description: { ru: "заглушка по форме будущего контента", en: "a placeholder shaped like the future content" } },
    { name: "Button", description: { ru: "частый хост для Spinner во время отправки формы", en: "a frequent host for Spinner while a form submits" } },
  ],
  forDevelopers: [
    {
      ru: "role=\"status\" и aria-label задаются прямо в JSX перед {...props} — поэтому их можно переопределить снаружи, но не частично: передав свой role, вы замените оба базовых значения разом только если явно повторите оба атрибута.",
      en: "role=\"status\" and aria-label are set directly in JSX before {...props} — so they can be overridden from outside, but not partially: passing your own role doesn't also change aria-label unless you set both explicitly.",
    },
    {
      ru: "lucide-react сам добавляет aria-hidden=\"true\" к SVG, если не видит ни одного ARIA/role/title-пропа (hasA11yProp) — наши role/aria-label этот автоматический aria-hidden отключают, конфликта между ними нет.",
      en: "lucide-react itself adds aria-hidden=\"true\" to the SVG if it sees no ARIA/role/title prop at all (hasA11yProp) — our role/aria-label turn off that automatic aria-hidden, so there's no conflict between them.",
    },
    {
      ru: "Размер и цвет — только className (text-on-surface-muted по умолчанию, text-current — частый выбор внутри кнопки, чтобы наследовать её текущий цвет текста, включая disabled); отдельного prop size/variant и cva() у компонента нет.",
      en: "Size and color are className-only (text-on-surface-muted by default, text-current is a common choice inside a button, to inherit its current text color including disabled); there's no separate size/variant prop or cva() on the component.",
    },
  ],
}
