import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "./avatar";

// деминстрационное «фото» — инлайн SVG, не сетевой запрос: снимки/проверки остаются детерминированными офлайн
const DEMO_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>" +
      "<rect width='64' height='64' fill='#7c9cbf'/>" +
      "<circle cx='32' cy='24' r='12' fill='#fff'/>" +
      "<rect x='10' y='42' width='44' height='26' rx='20' fill='#fff'/>" +
      "</svg>"
  );

const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {sizes.map((s) => (
        <Avatar key={s} size={s}>
          <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

// фолбэк на инициалы, пока фото не загрузилось (нет src) или не загрузилось вовсе (битый src)
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <p className="typo-caption text-on-surface-muted">фото загружено</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src="https://broken.invalid/avatar.png" alt="Пользователь" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <p className="typo-caption text-on-surface-muted">фото не загрузилось</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
        <p className="typo-caption text-on-surface-muted">без фото</p>
      </div>
    </div>
  ),
};

// неудобный контент: один символ, длинные инициалы, эмодзи, пустой фолбэк
export const Content: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>ABC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>🙂</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>{""}</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// AvatarBadge — обобщённая точка в углу, дефолт bg-primary, без встроенного «статуса».
// online/busy/offline — паттерн использования через className на инстансе, не проп компонента.
export const Badge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        {sizes.map((s) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <Avatar size={s}>
              <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
              <AvatarFallback>AB</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <p className="typo-caption text-on-surface-muted">{s}: круг, не клипуется аватаром</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
          <AvatarFallback>AB</AvatarFallback>
          <AvatarBadge className="bg-success" />
        </Avatar>
        <p className="typo-caption text-on-surface-muted">online (bg-success)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
          <AvatarFallback>AB</AvatarFallback>
          <AvatarBadge className="bg-danger" />
        </Avatar>
        <p className="typo-caption text-on-surface-muted">busy (bg-danger)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
          <AvatarFallback>AB</AvatarFallback>
          <AvatarBadge className="border-2 border-on-surface-muted bg-surface-muted" />
        </Avatar>
        <p className="typo-caption text-on-surface-muted">
          offline (bg-surface-muted, border-on-surface-muted — контраст 7:1+ к фону и к заливке)
        </p>
      </div>
    </div>
  ),
};

// AvatarGroup/AvatarGroupCount — стопка с перекрытием -space-x-2 (8px, из исходника shadcn)
export const Group: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {sizes.map((s) => (
        <AvatarGroup key={s}>
          <Avatar size={s}>
            <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size={s}>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar size={s}>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      ))}
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
            "flex flex-col items-start gap-4 rounded-lg border border-border bg-surface p-6 text-on-surface"
          }
        >
          <p className="typo-caption text-on-surface-muted">
            {c.brand} / {c.dark ? "dark" : "light"}
          </p>
          <div className="flex items-center gap-4">
            {sizes.map((s) => (
              <Avatar key={s} size={s}>
                <AvatarImage src={DEMO_IMAGE} alt="Пользователь" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            ))}
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      ))}
    </div>
  ),
};
