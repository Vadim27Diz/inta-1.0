import type { ComponentDocs } from "@/docs/types"

export const alertDocs: ComponentDocs = {
  title: "Alert",
  purpose: {
    ru: "Alert — заметное сообщение о статусе или важном контексте, привязанное к конкретному разделу страницы и остающееся на месте, пока условие не изменится или пользователь его не закроет сам.",
    en: "Alert is a prominent status or context message tied to a specific section of the page, staying in place until the condition changes or the user dismisses it.",
  },
  whenToUse: [
    {
      ru: "Важная информация о состоянии раздела или результате действия, которая должна оставаться видимой, а не исчезать через пару секунд.",
      en: "Important information about a section's state or an action's result that must stay visible rather than disappear after a few seconds.",
    },
    {
      ru: "Нужно явно передать уровень серьёзности через variant: info/success/warning/danger — или нейтральную заметку через default.",
      en: "The severity level needs to be explicit via variant: info/success/warning/danger — or a neutral note via default.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Ошибка валидации конкретного поля формы — она должна стоять рядом с полем, а не отдельным блоком на странице.",
        en: "A validation error for one specific form field — it belongs next to that field, not as a separate block on the page.",
      },
      insteadOf: {
        name: "Field (FieldError)",
        description: { ru: "сообщение об ошибке внутри поля", en: "an error message scoped to a field" },
      },
    },
    {
      description: {
        ru: "Короткое уведомление, которое должно исчезнуть само через несколько секунд и не привязано к конкретному месту на странице (toast). В наборе сейчас нет отдельного компонента для этого — см. открытый вопрос.",
        en: "A short notification that should disappear on its own after a few seconds and isn't tied to a specific spot on the page (a toast). The kit has no dedicated component for this yet — see the open question.",
      },
    },
  ],
  anatomy: [
    { name: "Alert", description: { ru: "корневой контейнер, role=\"alert\"", en: "root container, role=\"alert\"" } },
    {
      name: "icon (children)",
      description: {
        ru: "первый ребёнок — любая SVG-иконка (не фиксированный набор, не проп): автор сам выбирает глиф под variant.",
        en: "the first child — any SVG icon (not a fixed prop or icon set): the author picks the glyph that fits the variant.",
      },
    },
    { name: "AlertTitle", description: { ru: "заголовок, до 3 строк с обрезкой многоточием", en: "title, clamped to 3 lines with an ellipsis" } },
    { name: "AlertDescription", description: { ru: "основной текст, переносится без ограничения по высоте", en: "body text, wraps with no height limit" } },
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
      ru: "Заголовок — максимум 3 строки, дальше обрезается многоточием (line-clamp-3). Это касается и одного длинного слова без пробелов: оно переносится внутри строки (break-words) и всё равно обрезается на 3-й — а не вылезает за край и не обрывается без «…».",
      en: "Title is capped at 3 lines, then clamped with an ellipsis (line-clamp-3). This holds even for one long unbroken word: it wraps inside the line (break-words) and still clamps correctly on line 3 — it won't overflow the edge or get cut off without the ellipsis.",
    },
    {
      ru: "Описание переносится по ширине блока без ограничения по числу строк; длинные слова без пробелов тоже переносятся (break-words), а не вылезают за правый край.",
      en: "Description wraps to the block's width with no line limit; long unbroken words wrap too (break-words) instead of overflowing the right edge.",
    },
    {
      ru: "Текст — по существу и конкретно: что произошло и что делать дальше, особенно для warning/danger. Не используйте Alert для декоративных или маркетинговых сообщений.",
      en: "Keep the copy specific and actionable: what happened and what to do next, especially for warning/danger. Don't use Alert for decorative or marketing copy.",
    },
  ],
  accessibility: [
    {
      ru: "role=\"alert\" — это ARIA live-region с неявным aria-live=\"assertive\": screen reader прерывает текущую речь и сразу озвучивает контент при появлении Alert в DOM. Используйте только для сообщений, действительно требующих немедленного внимания — не для статичного контента, который уже есть на странице при её загрузке.",
      en: "role=\"alert\" is an ARIA live region with an implicit aria-live=\"assertive\": the screen reader interrupts and announces the content immediately when the Alert is inserted into the DOM. Reserve it for messages that truly need immediate attention — not for static content already present when the page loads.",
    },
    {
      ru: "Иконка не помечена aria-hidden автоматически — компонент принимает любой SVG как есть. Если иконка декоративна (обычно так и есть), помечайте её aria-hidden сами на стороне использования.",
      en: "The icon isn't automatically marked aria-hidden — the component accepts any SVG as-is. If the icon is decorative (usually the case), mark it aria-hidden yourself at the call site.",
    },
    {
      ru: "Цвет текста для каждого variant проверен на контраст (npm run tokens:contrast) — не полагайтесь на один цвет/иконку как единственный способ передать статус для пользователей с нарушением цветовосприятия: подписывайте заголовок словами (Warning, Error), а не только цветом рамки.",
      en: "Each variant's text color passes contrast checks (npm run tokens:contrast) — don't rely on color/icon alone to convey status for users with color vision deficiencies: label the severity in words (Warning, Error), not only via border color.",
    },
  ],
  related: [
    { name: "Field", description: { ru: "ошибка/описание конкретного поля формы", en: "a specific form field's error/description" } },
    { name: "Empty", description: { ru: "пустое состояние раздела, а не статус-сообщение", en: "an empty state for a section, not a status message" } },
  ],
  openQuestions: [
    {
      ru: "В наборе нет компонента для коротких самоисчезающих уведомлений (toast/snackbar). Alert для этого не подходит (он статичен и не автозакрывается) — планируется ли отдельный компонент?",
      en: "There's no component for short, self-dismissing notifications (toast/snackbar). Alert doesn't fit that role (it's static and doesn't auto-dismiss) — is a dedicated component planned?",
    },
  ],
}
