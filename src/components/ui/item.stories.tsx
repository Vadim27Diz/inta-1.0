import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Bell, Star } from "lucide-react";
import {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
} from "./item";
import { Button } from "./button";
import { Badge } from "./badge";

// демо-«фото» для ItemMedia variant=image — инлайн SVG, не сетевой запрос
const DEMO_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>" +
      "<rect width='40' height='40' fill='#7c9cbf'/>" +
      "<circle cx='20' cy='15' r='7' fill='#fff'/>" +
      "<rect x='7' y='26' width='26' height='16' rx='13' fill='#fff'/>" +
      "</svg>"
  );

const variants = ["default", "outline", "muted"] as const;

const meta = {
  title: "Components/Item",
  component: Item,
  args: { variant: "default", size: "default" },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  render: (args) => (
    <Item {...args} className="w-96">
      <ItemMedia variant="icon">
        <Mail />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Новое сообщение</ItemTitle>
        <ItemDescription>От Анны Петровой — по поводу встречи завтра</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Открыть
        </Button>
      </ItemActions>
    </Item>
  ),
} satisfies Meta<typeof Item>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      {variants.map((v) => (
        <Item key={v} variant={v}>
          <ItemMedia variant="icon">
            <Bell />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Вариант «{v}»</ItemTitle>
            <ItemDescription>Короткое описание строки</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

// hover/фокус проявляются только когда корень реально рендерится интерактивным тегом (asChild)
export const States: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Item asChild id="item-hover">
        <a href="#interactive">
          <ItemMedia variant="icon">
            <Star />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Кликабельная строка (asChild, hover)</ItemTitle>
            <ItemDescription>Рендерится как ссылка — hover и фокус работают</ItemDescription>
          </ItemContent>
        </a>
      </Item>
      <Item asChild id="item-focus">
        <a href="#interactive">
          <ItemMedia variant="icon">
            <Star />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Кликабельная строка (фокус)</ItemTitle>
            <ItemDescription>Кольцо фокуса — модель control</ItemDescription>
          </ItemContent>
        </a>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <Star />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Статичная строка (div)</ItemTitle>
          <ItemDescription>Не реагирует на hover/фокус — не интерактивна</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
  parameters: {
    pseudo: { hover: ["#item-hover"], focusVisible: ["#item-focus"] },
  },
};

// неудобный контент: длинный заголовок/описание (line-clamp), ItemGroup+Separator, Header/Footer, media=image
export const Content: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="image">
          <img src={DEMO_IMAGE} alt="" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            Очень длинный заголовок строки, который должен переноситься на вторую строку
          </ItemTitle>
          <ItemDescription>
            Очень длинное описание, которое не помещается в две строки и должно обрезаться
            многоточием благодаря line-clamp-2, не ломая высоту строки целиком.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <Badge variant="neutral">Новое</Badge>
          <span className="typo-caption text-on-surface-muted">2 мин назад</span>
        </ItemHeader>
        <ItemMedia variant="icon">
          <Mail />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Строка с Header/Footer</ItemTitle>
          <ItemDescription>Composition-слоты для метаданных сверху и снизу</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <Button size="sm" variant="ghost">
            Отклонить
          </Button>
          <Button size="sm">Принять</Button>
        </ItemFooter>
      </Item>
      <ItemGroup className="rounded-md border border-border" id="item-group-content">
        <Item>
          <ItemContent>
            <ItemTitle>Первая строка группы</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemContent>
            <ItemTitle>Вторая строка группы</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        {/* строка-ссылка внутри группы: роль "listitem" уходит на обёртку, сам <a> остаётся ссылкой */}
        <Item asChild id="item-group-link">
          <a href="#interactive">
            <ItemContent>
              <ItemTitle>Третья строка группы — кликабельная (asChild)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
      </ItemGroup>
    </div>
  ),
};

const combos = [
  { brand: "main", dark: false },
  { brand: "main", dark: true },
  { brand: "demo", dark: false },
  { brand: "demo", dark: true },
];

export const BrandMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {combos.map((c) => (
        <div
          key={c.brand + String(c.dark)}
          data-brand={c.brand}
          className={
            (c.dark ? "dark " : "") +
            "flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          {variants.map((v) => (
            <Item key={v} variant={v}>
              <ItemMedia variant="icon">
                <Bell />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Вариант «{v}»</ItemTitle>
                <ItemDescription>Короткое описание строки</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      ))}
    </div>
  ),
};
