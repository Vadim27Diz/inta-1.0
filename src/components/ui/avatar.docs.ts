import type { ComponentDocs } from "@/docs/types"

export const avatarDocs: ComponentDocs = {
  title: "Avatar",
  purpose: {
    ru: "Avatar показывает фото или инициалы человека или организации одним кружком фиксированного размера, с автоматическим запасным вариантом, если фото не загрузилось.",
    en: "Avatar shows a photo or initials for a person or organization inside a fixed-size circle, with an automatic fallback if the photo doesn't load.",
  },
  whenToUse: [
    {
      ru: "Нужно показать, кто автор комментария, участник списка или владелец записи — фото или инициалы.",
      en: "Showing who authored a comment, who's in a list, or who owns a record — a photo or initials.",
    },
    {
      ru: "Несколько участников нужно показать стопкой с перекрытием и счётчиком оставшихся (AvatarGroup + AvatarGroupCount).",
      en: "Several participants need to show as an overlapping stack with a remaining-count badge (AvatarGroup + AvatarGroupCount).",
    },
    {
      ru: "Нужна маленькая точка-индикатор в углу аватара — например, онлайн-статус или значок уведомления (AvatarBadge).",
      en: "A small indicator dot belongs in the avatar's corner — e.g. an online status or a notification mark (AvatarBadge).",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "Иконка не представляет конкретного человека или организацию — это обычный графический элемент.",
        en: "The icon doesn't represent a specific person or organization — it's just a generic graphic.",
      },
      insteadOf: {
        name: "иконка",
        description: { ru: "обычная иконка lucide без обёртки Avatar", en: "a plain lucide icon with no Avatar wrapper" },
      },
    },
    {
      description: {
        ru: "Нужна кнопка-аватар с действием по клику (например, открыть меню профиля) — сам Avatar не становится интерактивным.",
        en: "An avatar-as-button that does something on click (e.g. opens a profile menu) — Avatar itself doesn't become interactive.",
      },
      insteadOf: {
        name: "Button",
        description: { ru: "variant=\"ghost\" size=\"icon\" снаружи, с Avatar внутри", en: "variant=\"ghost\" size=\"icon\" on the outside, with Avatar inside" },
      },
    },
  ],
  anatomy: [
    { name: "Avatar", description: { ru: "корневой контейнер — круг фиксированного размера.", en: "the root container — a fixed-size circle." } },
    { name: "AvatarImage", description: { ru: "фото — рендерится только после успешной загрузки.", en: "the photo — renders only once it has loaded successfully." } },
    { name: "AvatarFallback", description: { ru: "инициалы или другой запасной контент — показывается, пока фото не загружено или если оно не загрузилось.", en: "initials or other fallback content — shown while the photo hasn't loaded, or if it failed to." } },
    { name: "AvatarBadge", description: { ru: "точка-индикатор в правом нижнем углу — без встроенного смысла (не «статус», а обобщённая точка).", en: "an indicator dot in the bottom-right corner — with no built-in meaning (a generic dot, not a “status”)." } },
    { name: "AvatarGroup", description: { ru: "стопка нескольких Avatar с перекрытием.", en: "a stack of several Avatars, overlapping." } },
    { name: "AvatarGroupCount", description: { ru: "кружок с числом оставшихся участников в конце группы.", en: "a circle with the count of remaining participants at the end of the group." } },
  ],
  variants: [
    { name: "size: sm", description: { ru: "компактный размер, например в плотных списках", en: "a compact size, e.g. in dense lists" } },
    { name: "size: md", description: { ru: "размер по умолчанию", en: "the default size" } },
    { name: "size: lg", description: { ru: "крупный размер — профиль, заголовок страницы", en: "a large size — a profile, a page header" } },
  ],
  states: [
    { name: "фото загружено", description: { ru: "показывается AvatarImage", en: "AvatarImage is shown" } },
    { name: "фото не загрузилось", description: { ru: "битый src — автоматически показывается AvatarFallback", en: "a broken src — AvatarFallback shows automatically" } },
    { name: "без фото", description: { ru: "AvatarImage не передан вовсе — AvatarFallback показывается сразу", en: "no AvatarImage at all — AvatarFallback shows immediately" } },
  ],
  contentRules: [
    {
      ru: "AvatarFallback — инициалы, 1-2 буквы (класс uppercase сам приводит их к верхнему регистру), не произвольный текст.",
      en: "AvatarFallback holds initials, 1-2 letters (the uppercase class already capitalizes them) — not arbitrary text.",
    },
    {
      ru: "AvatarImage alt — имя человека или организации, не «аватар» или «фото».",
      en: "AvatarImage's alt is the person's or organization's name, not “avatar” or “photo”.",
    },
    {
      ru: "AvatarGroupCount — число с «+» для превышения («+3»), не слово «ещё».",
      en: "AvatarGroupCount is a number with a “+” for the overflow (“+3”), not the word “more”.",
    },
  ],
  accessibility: [
    {
      ru: "Avatar — Radix Avatar.Root, рендерится как <span> без собственной ARIA-роли; смысл несёт либо alt у AvatarImage, либо текст AvatarFallback, а не сам контейнер.",
      en: "Avatar is Radix Avatar.Root, rendered as a <span> with no ARIA role of its own — the meaning comes from AvatarImage's alt or AvatarFallback's text, not the container itself.",
    },
    {
      ru: "Переключение на AvatarFallback при ошибке загрузки происходит автоматически (Radix следит за загрузкой картинки сам), без лишней настройки — но текст инициалов внутри AvatarFallback всё равно задаёте вы, компонент не берёт его из alt.",
      en: "Switching to AvatarFallback on a load error happens automatically (Radix tracks the image's loading state itself), with no extra setup — but the initials inside AvatarFallback are still yours to provide; the component doesn't derive them from alt.",
    },
    {
      ru: "AvatarBadge — точка без текста по умолчанию, скринридер не озвучивает «онлайн»/«занят» сам. Если статус важен, добавляйте визуально скрытый текст или aria-label рядом с Avatar — AvatarBadge его не создаёт.",
      en: "AvatarBadge is a dot with no text by default — a screen reader doesn't announce “online”/“busy” on its own. If the status matters, add visually-hidden text or an aria-label near the Avatar — AvatarBadge doesn't create one.",
    },
    {
      ru: "Статусы AvatarBadge (online/busy/offline из истории Badge) различаются только цветом точки — для людей с нарушением цветовосприятия это неразличимо. Если статус важен, продублируйте его текстом: тот же визуально скрытый текст/aria-label, что для скринридера, или видимая подпись рядом — не только цвет.",
      en: "AvatarBadge's statuses (online/busy/offline from the Badge story) differ only by the dot's color — indistinguishable for people with color vision deficiencies. If the status matters, duplicate it with text: the same visually-hidden text/aria-label used for screen readers, or a visible label nearby — not color alone.",
    },
    {
      ru: "AvatarGroup — визуальная стопка без role=\"list\". Если группа должна озвучиваться как набор из N участников, добавляйте эту структуру сами.",
      en: "AvatarGroup is a visual stack with no role=\"list\". If the group should announce as a set of N participants, add that structure yourself.",
    },
  ],
  related: [
    { name: "Badge", description: { ru: "отдельная статусная метка — не путать с AvatarBadge", en: "a standalone status label — not to be confused with AvatarBadge" } },
    { name: "Card", description: { ru: "частый контейнер для Avatar — например, в заголовке карточки участника", en: "a frequent host for Avatar — e.g. in a participant card's header" } },
  ],
  forDevelopers: [
    {
      ru: "overflow-hidden стоит на AvatarImage/AvatarFallback, не на корне: AvatarBadge — абсолютно спозиционированный ребёнок в углу, и circular-маска на корне обрезала бы его под разный угол в зависимости от размера аватара.",
      en: "overflow-hidden lives on AvatarImage/AvatarFallback, not the root: AvatarBadge is an absolutely positioned child in the corner, and a circular mask on the root would clip it at a different angle depending on the avatar's size.",
    },
    {
      ru: "data-size на корне дублирует size — по нему AvatarBadge/AvatarGroupCount читают размер родителя через group-data атрибут, так как у них своего пропа size нет.",
      en: "data-size on the root duplicates size — AvatarBadge/AvatarGroupCount read the parent's size through a group-data attribute, since neither has its own size prop.",
    },
    {
      ru: "AvatarGroup: перекрытие -space-x-2 (8px) — значение из исходника shadcn, не придумано. AvatarGroupCount читает размер по количеству Avatar внутри группы (group-has-data), а не по собственному пропу.",
      en: "AvatarGroup: the -space-x-2 (8px) overlap comes from shadcn's original, not invented here. AvatarGroupCount reads its size from the Avatars inside the group (group-has-data), not from a prop of its own.",
    },
  ],
}
