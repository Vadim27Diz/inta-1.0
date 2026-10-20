import type { ComponentDocs } from "@/docs/types"

export const aspectRatioDocs: ComponentDocs = {
  title: "Aspect Ratio",
  purpose: {
    ru: "Aspect Ratio удерживает заданное соотношение сторон блока (например, 16:9) независимо от ширины родителя — для картинок, видео и превью.",
    en: "Aspect Ratio keeps a block at a fixed width-to-height ratio (e.g. 16:9) regardless of the parent's width — for images, video, and previews.",
  },
  whenToUse: [
    {
      ru: "Картинка или видео должны сохранять пропорции при любой ширине колонки — например, превью в сетке карточек.",
      en: "An image or video needs to keep its proportions at any column width — e.g. a preview in a card grid.",
    },
    {
      ru: "Нужно зарезервировать место под медиа до того, как оно загрузится, чтобы раскладка не прыгала.",
      en: "Space needs to be reserved for media before it loads, so the layout doesn't jump.",
    },
  ],
  whenNotToUse: [
    {
      description: {
        ru: "У изображения уже есть собственная естественная высота, и пропорции не должны подстраиваться под ширину контейнера.",
        en: "The image already has its own natural height, and its proportions shouldn't adapt to the container's width.",
      },
    },
  ],
  anatomy: [
    {
      name: "AspectRatio",
      description: {
        ru: "единственный элемент-обёртка — ratio задаёт пропорцию, содержимое (обычно <img> или <video> с object-cover) заполняет её целиком.",
        en: "a single wrapper element — ratio sets the proportion, the content (usually an <img> or <video> with object-cover) fills it completely.",
      },
    },
  ],
  variants: [],
  states: [],
  contentRules: [
    {
      ru: "Внутри — одно медиа (картинка или видео) с object-cover/object-contain, а не произвольный блочный контент с собственной высотой.",
      en: "Inside goes a single piece of media (an image or video) with object-cover/object-contain, not arbitrary block content with its own height.",
    },
  ],
  accessibility: [
    {
      ru: "AspectRatio — два вложенных <div> без ARIA-атрибутов: это чисто геометрическая обёртка, не объявляется скринридером отдельно от содержимого.",
      en: "AspectRatio is two nested <div>s with no ARIA attributes — it's a purely geometric wrapper, not announced by a screen reader separately from its content.",
    },
    {
      ru: "Доступность самого медиа внутри (alt у <img>, подпись у <video>) — обязанность того, кто его туда помещает, AspectRatio её не меняет.",
      en: "The accessibility of the media itself inside (an <img>'s alt, a <video>'s caption) is up to whoever places it there — AspectRatio doesn't change it.",
    },
  ],
  related: [
    { name: "Card", description: { ru: "картинка AspectRatio часто стоит внутри CardMedia сверху карточки", en: "an AspectRatio image often sits inside CardMedia at the top of a card" } },
  ],
  forDevelopers: [
    {
      ru: "Пропорция держится классическим приёмом padding-bottom в процентах на внешнем <div>, внутренний — position:absolute на все стороны; оба слоя — реализация Radix, не наши классы.",
      en: "The ratio is held with the classic percentage padding-bottom trick on the outer <div>; the inner one is position:absolute on every side. Both layers are Radix's own implementation, not our classes.",
    },
    {
      ru: "ratio — число (например, 16/9), не enum — отдельного набора предустановленных пропорций в компоненте нет.",
      en: "ratio is a number (e.g. 16/9), not an enum — there's no built-in set of preset ratios.",
    },
  ],
}
