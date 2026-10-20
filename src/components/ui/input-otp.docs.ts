import type { ComponentDocs } from "@/docs/types"

export const inputOtpDocs: ComponentDocs = {
  title: "Input OTP",
  purpose: {
    ru: "Input OTP — поле для ввода одноразового кода подтверждения, где каждый символ занимает свою отдельную ячейку.",
    en: "Input OTP is a field for entering a one-time confirmation code, with each character in its own cell.",
  },
  whenToUse: [
    {
      ru: "Нужно ввести короткий цифровой или буквенно-цифровой код фиксированной длины — подтверждение по SMS, email, двухфакторная аутентификация.",
      en: "Entering a short, fixed-length numeric or alphanumeric code — SMS or email confirmation, two-factor authentication.",
    },
    {
      ru: "Длина кода известна заранее и не меняется — каждая ячейка соответствует одному символу.",
      en: "The code's length is known in advance and doesn't change — each cell corresponds to exactly one character.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Значение произвольной длины или это не короткий код, а длинная строка другого рода (токен, ключ доступа, номер карты).",
        en: "The value has arbitrary length, or it isn't a short code but a longer string of a different kind (a token, an access key, a card number).",
      },
      insteadOf: {
        name: "Input",
        description: { ru: "однострочное поле ввода", en: "a single-line input field" },
      },
    },
  ],
  anatomy: [
    {
      name: "InputOTP",
      description: {
        ru: "корневой элемент — скрытое текстовое поле, которое держит значение и фокус; видимые ячейки ниже — только отображение.",
        en: "the root element — a hidden text field that holds the value and focus; the visible cells below are display only.",
      },
    },
    {
      name: "InputOTPGroup",
      description: {
        ru: "блок соседних ячеек с общей внешней рамкой — скругление только у первой и последней ячейки блока.",
        en: "a block of adjacent cells sharing one outer border — rounding applies only to the first and last cell in the block.",
      },
    },
    {
      name: "InputOTPSlot",
      description: {
        ru: "одна ячейка — один символ. Индекс (index) задаёт позицию символа, с которой ячейка синхронизирована.",
        en: "one cell — one character. The index prop sets the character position the cell is synced to.",
      },
    },
    {
      name: "InputOTPSeparator",
      description: {
        ru: "визуальный разделитель между группами ячеек (например, между блоком из 3 и 3 при коде из 6 цифр).",
        en: "a visual separator between groups of cells (e.g. between a block of 3 and 3 for a 6-digit code).",
      },
    },
  ],
  variants: [
    { name: "maxLength", description: { ru: "длина кода — число ячеек равно числу символов, разбивка на группы произвольная", en: "code length — the number of cells equals the number of characters; grouping into blocks is up to the caller" } },
  ],
  states: [
    { name: "default", description: { ru: "поле пустое или частично заполнено, ожидает ввод", en: "the field is empty or partially filled, waiting for input" } },
    { name: "active (каретка)", description: { ru: "мигающая каретка показывает ячейку, в которую попадёт следующий введённый символ", en: "a blinking caret shows which cell the next typed character will land in" } },
    { name: "invalid", description: { ru: "рамка цвета ошибки на всех ячейках — код не прошёл проверку (неверный или устаревший)", en: "an error-colored border on every cell — the code failed validation (wrong or expired)" } },
    { name: "disabled", description: { ru: "ввод недоступен, ячейки выглядят приглушёнными — например, во время проверки кода на сервере", en: "input is unavailable, cells look muted — e.g. while the code is being checked on the server" } },
  ],
  contentRules: [
    {
      ru: "Рядом с полем явно укажите длину и формат кода (например, «Введите 6-значный код из SMS»), чтобы пользователь понимал, сколько символов нужно ввести, прежде чем начать.",
      en: "State the code's length and format near the field (e.g. “Enter the 6-digit code from the SMS”) so the user knows how many characters to expect before typing.",
    },
    {
      ru: "Сообщение об ошибке объясняет причину (код неверный / устарел / нужно запросить заново), а не просто помечает поле красным.",
      en: "The error message explains the cause (wrong code / expired / needs a new request), not just marks the field red.",
    },
  ],
  accessibility: [
    {
      ru: "Хотя ячеек несколько, для скринридера это одно текстовое поле — значение озвучивается целиком, а не по символам.",
      en: "Despite the multiple cells, it's one text field for a screen reader — the value is announced as a whole, not character by character.",
    },
    {
      ru: "Поддерживает вставку (Ctrl/Cmd+V) всего кода сразу — вставленное значение распределяется по ячейкам автоматически.",
      en: "Supports pasting (Ctrl/Cmd+V) the whole code at once — the pasted value is distributed across cells automatically.",
    },
    {
      ru: "Клавиатура (стрелки, Backspace) работает как в обычном текстовом поле, с автопереходом между ячейками не нужно управлять вручную.",
      en: "The keyboard (arrow keys, Backspace) behaves like a regular text field — moving between cells is automatic, no manual handling needed.",
    },
  ],
  related: [
    { name: "Input", description: { ru: "однострочное поле ввода произвольной длины", en: "a single-line field for arbitrary-length input" } },
    { name: "Field", description: { ru: "подпись и сообщение об ошибке для поля", en: "a field's label and error message" } },
  ],
  forDevelopers: [
    {
      ru: "Обёртка над input-otp (сторонняя библиотека): реальный <input> визуально скрыт, видимая разметка — InputOTPSlot, синхронизированные через OTPInputContext по index.",
      en: "A wrapper around input-otp (a third-party library): the real <input> is visually hidden, the visible markup is InputOTPSlot, synced via OTPInputContext by index.",
    },
    {
      ru: "Активная ячейка — data-active=\"true\" на InputOTPSlot, не состояние Radix. Мигающая каретка — отдельный div с animate-caret-blink, показан только когда hasFakeCaret истинно для этого слота.",
      en: "The active cell is data-active=\"true\" on InputOTPSlot, not a Radix state. The blinking caret is a separate div with animate-caret-blink, shown only when hasFakeCaret is true for that slot.",
    },
    {
      ru: "invalid передаётся как aria-invalid на InputOTP (не на отдельные слоты) — каждый InputOTPSlot читает его через aria-invalid:border-danger, group-has-disabled/input-otp:* на группе читает disabled с корня через именованную group.",
      en: "invalid is passed as aria-invalid on InputOTP (not on individual slots) — each InputOTPSlot reads it via aria-invalid:border-danger; group-has-disabled/input-otp:* on the group reads disabled from the root through a named group.",
    },
  ],
}
