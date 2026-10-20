import type { ComponentDocs } from "@/docs/types"

export const alertDocs: ComponentDocs = {
  title: "Alert",
  purpose: {
    ru: "Alert — заметное сообщение о статусе или важном контексте, привязанное к конкретному разделу страницы и остающееся на месте, пока не изменится условие, которое его вызвало.",
    en: "Alert is a prominent status or context message tied to a specific section of the page, staying in place until the condition that triggered it changes.",
  },
  whenToUse: [
    {
      ru: "Важная информация о состоянии раздела или результате действия, которая должна оставаться видимой, а не исчезать через пару секунд.",
      en: "Important information about a section's state or an action's result that must stay visible rather than disappear after a few seconds.",
    },
    {
      ru: "Нужно явно передать уровень серьёзности: нейтральная заметка, информация, успех, предупреждение или ошибка.",
      en: "The severity level needs to be explicit: a neutral note, information, success, a warning, or an error.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Ошибка валидации конкретного поля формы — она должна стоять рядом с полем, а не отдельным блоком на странице.",
        en: "A validation error for one specific form field — it belongs next to that field, not as a separate block on the page.",
      },
      insteadOf: {
        name: "Field",
        description: { ru: "сообщение об ошибке внутри поля", en: "an error message scoped to a field" },
      },
    },
    {
      description: {
        ru: "Короткое уведомление, которое должно исчезнуть само через несколько секунд и не привязано к конкретному месту на странице. В наборе сейчас нет отдельного компонента для этого — см. открытый вопрос.",
        en: "A short notification that should disappear on its own after a few seconds and isn't tied to a specific spot on the page. The kit has no dedicated component for this yet — see the open question.",
      },
    },
  ],
  anatomy: [
    { name: "Alert", description: { ru: "контейнер сообщения целиком", en: "the whole message container" } },
    {
      name: "Иконка",
      description: {
        ru: "необязательная, в начале сообщения — автор сам выбирает иконку под смысл (информация, успех, предупреждение, ошибка).",
        en: "optional, at the start of the message — the author picks the icon that matches the meaning (info, success, warning, error).",
      },
    },
    { name: "Заголовок", description: { ru: "короткая суть сообщения, до 3 строк", en: "a short headline for the message, up to 3 lines" } },
    { name: "Описание", description: { ru: "подробности — что произошло и что делать дальше", en: "details — what happened and what to do next" } },
  ],
  variantGuidance: [
    {
      ru: "default — нейтральная заметка без статуса. info — факт, на который стоит обратить внимание, но он не требует действия. success — операция завершилась успешно. warning — что-то может пойти не так, если не вмешаться. danger — уже пошло не так, или действие разрушительно.",
      en: "default is a neutral note with no status. info is a fact worth noticing that doesn't require action. success means an operation completed. warning means something may go wrong without intervention. danger means something already went wrong, or an action is destructive.",
    },
  ],
  variants: [
    { name: "default", description: { ru: "нейтральная заметка без статуса", en: "a neutral note with no status" } },
    { name: "info", description: { ru: "информационное сообщение", en: "an informational message" } },
    { name: "success", description: { ru: "операция выполнена успешно", en: "an operation completed successfully" } },
    { name: "warning", description: { ru: "предупреждение, требует внимания", en: "a warning that needs attention" } },
    { name: "danger", description: { ru: "ошибка или разрушительный результат", en: "an error or a destructive outcome" } },
  ],
  states: [],
  contentRules: [
    {
      ru: "Заголовок — максимум 3 строки, дальше обрезается многоточием, в том числе если это одно длинное слово без пробелов. Пишите заголовок так, чтобы суть была понятна и в первой строке.",
      en: "Title is capped at 3 lines and then clamped with an ellipsis — including a single long unbroken word. Phrase the title so the point lands within the first line.",
    },
    {
      ru: "Описание не ограничено по длине, но держите его по существу: что произошло и что делать дальше — особенно для warning и danger.",
      en: "Description has no length limit, but keep it to the point: what happened and what to do next — especially for warning and danger.",
    },
    {
      ru: "Не используйте Alert для декоративных или маркетинговых сообщений — он должен появляться только тогда, когда пользователю действительно нужно что-то узнать.",
      en: "Don't use Alert for decorative or marketing copy — it should only appear when the user genuinely needs to know something.",
    },
    {
      ru: "Не дублируйте в заголовке и описании одно и то же — заголовок называет суть, описание её раскрывает.",
      en: "Don't repeat the same point in both title and description — the title names the gist, the description expands on it.",
    },
  ],
  accessibility: [
    {
      ru: "Для warning и danger скринридер прерывает текущую речь и сразу озвучивает сообщение — используйте эти варианты только для того, что действительно требует немедленного внимания.",
      en: "For warning and danger, a screen reader interrupts and announces the message immediately — reserve these variants for things that truly need immediate attention.",
    },
    {
      ru: "Для default, info и success сообщение озвучивается без прерывания текущего действия пользователя.",
      en: "For default, info and success, the message is announced without interrupting whatever the user is doing.",
    },
    {
      ru: "Иконка не озвучивается сама по себе отдельным текстом — весь смысл должен быть понятен из заголовка и описания, не только по цвету рамки или иконке.",
      en: "The icon isn't announced as separate text on its own — the full meaning must come through in the title and description, not only from the border color or icon.",
    },
  ],
  related: [
    { name: "Field", description: { ru: "ошибка/описание конкретного поля формы", en: "a specific form field's error/description" } },
    { name: "Empty", description: { ru: "пустое состояние раздела, а не статус-сообщение", en: "an empty state for a section, not a status message" } },
  ],
  forDevelopers: [
    {
      ru: "Иконка — первый ребёнок (любой SVG, не фиксированный набор и не проп). AlertTitle и AlertDescription — отдельные subcomponent'ы.",
      en: "The icon is the first child (any SVG, not a fixed set or a prop). AlertTitle and AlertDescription are separate subcomponents.",
    },
    {
      ru: "Заголовок — line-clamp-3 + break-words: без break-words неразрывное слово не имеет точки переноса внутри строки и обрезается браузером без многоточия. Описание — обычный блочный поток с break-words, не grid/flex (у их item'ов есть скрытый min-width:auto, который перебивает ширину колонки).",
      en: "Title uses line-clamp-3 + break-words: without break-words, a single unbroken word has no wrap point inside the line and gets clipped by the browser with no ellipsis. Description is plain block flow with break-words, not grid/flex (their items have a hidden min-width:auto that overrides the column width).",
    },
    {
      ru: "role зависит от variant: \"status\" (aria-live=\"polite\") для default/info/success, \"alert\" (aria-live=\"assertive\") только для warning/danger. Явный проп role, если передать, переопределяет вычисленный.",
      en: "role depends on variant: \"status\" (aria-live=\"polite\") for default/info/success, \"alert\" (aria-live=\"assertive\") only for warning/danger. An explicit role prop, if passed, overrides the computed one.",
    },
    {
      ru: "Цвет текста для каждого variant проверен скриптом npm run tokens:contrast.",
      en: "Each variant's text color is checked by the npm run tokens:contrast script.",
    },
  ],
  openQuestions: [
    {
      ru: "В наборе нет компонента для коротких самоисчезающих уведомлений (toast/snackbar). Alert для этого не подходит (он статичен и не автозакрывается) — планируется ли отдельный компонент?",
      en: "There's no component for short, self-dismissing notifications (toast/snackbar). Alert doesn't fit that role (it's static and doesn't auto-dismiss) — is a dedicated component planned?",
    },
  ],
}
