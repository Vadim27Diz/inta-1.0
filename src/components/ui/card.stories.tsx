import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings } from "lucide-react";
import {
  Card,
  CardMedia,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "./button";

// демо-«фото» для CardMedia — инлайн SVG, не сетевой запрос (как DEMO_IMAGE в item.stories.tsx)
const DEMO_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='288' height='144'>" +
      "<rect width='288' height='144' fill='#7c9cbf'/>" +
      "<circle cx='60' cy='48' r='20' fill='#fff'/>" +
      "<rect x='20' y='84' width='248' height='40' rx='6' fill='#fff' fill-opacity='.6'/>" +
      "</svg>"
  );

const meta = {
  title: "Components/Card",
  component: Card,
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Заголовок карточки</CardTitle>
        <CardDescription>Короткое описание под заголовком</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="Настройки">
            <Settings />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="typo-body-sm text-on-surface-raised">
          Основной контент карточки — любой блок, который нужен конкретному экрану.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Сохранить</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Без Footer и Action</CardTitle>
          <CardDescription>Только заголовок, описание и контент</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm text-on-surface-raised">Минимальный набор слотов</p>
        </CardContent>
      </Card>
      <Card className="w-72">
        <CardHeader>
          <CardTitle>С Action</CardTitle>
          <CardDescription>Иконка действия справа от заголовка</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" aria-label="Настройки">
              <Settings />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm text-on-surface-raised">CardAction занимает вторую колонку grid</p>
        </CardContent>
      </Card>
      <Card className="w-72">
        <CardHeader>
          <CardTitle>С Footer</CardTitle>
          <CardDescription>Кнопки действий снизу</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm text-on-surface-raised">Контент перед футером</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" size="sm">
            Отмена
          </Button>
          <Button size="sm">Сохранить</Button>
        </CardFooter>
      </Card>
      <Card className="w-72">
        <CardMedia>
          <img src={DEMO_IMAGE} alt="" className="aspect-video w-full object-cover" />
        </CardMedia>
        <CardHeader>
          <CardTitle>С Media</CardTitle>
          <CardDescription>Картинка сверху, впритык к краю карточки</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm text-on-surface-raised">-mt-6 компенсирует py-6 карточки</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <Card className="w-72">
        <CardHeader>
          <CardTitle>
            Очень длинный заголовок карточки, который должен переноситься на несколько строк
          </CardTitle>
          <CardDescription>
            Длинное_слово_без_пробелов_которое_не_должно_распирать_карточку_за_её_границы_и_ломать_раскладку
            — описание переносится как обычный текст.
          </CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" aria-label="Настройки">
              <Settings />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm text-on-surface-raised">
            Длинный абзац контента: проверяем, что высота карточки растёт вместе с текстом, а
            ширина остаётся неизменной независимо от того, сколько строк занимает содержимое.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" size="sm">
            Отмена
          </Button>
          <Button size="sm">Сохранить</Button>
        </CardFooter>
      </Card>
      <Card className="w-72">
        <CardContent>
          <p className="typo-body-sm text-on-surface-raised">Только CardContent, без Header/Footer</p>
        </CardContent>
      </Card>
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
            "flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <Card className="w-72">
            <CardHeader>
              <CardTitle>Заголовок карточки</CardTitle>
              <CardDescription>Короткое описание под заголовком</CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon" aria-label="Настройки">
                  <Settings />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="typo-body-sm text-on-surface-raised">Основной контент карточки</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Сохранить</Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  ),
};
