import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./typography";

const variants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "lead",
  "large",
  "small",
  "muted",
  "blockquote",
  "inline-code",
  "list",
] as const;

const sample: Record<(typeof variants)[number], React.ReactNode> = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  p: "Обычный абзац текста для основного контента.",
  lead: "Вводный абзац, который подводит читателя к разделу.",
  large: "Крупный акцентный текст",
  small: "Мелкий вспомогательный текст",
  muted: "Приглушённый вторичный текст",
  blockquote: "Хорошо сформулированная мысль достойна цитирования.",
  "inline-code": "npm run build",
  list: (
    <>
      <li>Первый пункт списка</li>
      <li>Второй пункт списка</li>
    </>
  ),
};

const meta = {
  title: "Components/Typography",
  component: Typography,
  args: { variant: "p", children: sample.p },
  argTypes: {
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Typography>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {variants.map((v) => (
        <Typography key={v} variant={v}>
          {sample[v]}
        </Typography>
      ))}
    </div>
  ),
};

// неудобный контент: длинный заголовок без пробелов, длинная цитата, длинный код без пробелов, пустая строка
export const Content: Story = {
  render: () => (
    <div className="flex w-80 flex-col items-start gap-4 rounded-lg border border-border p-4">
      <Typography variant="h3">
        Супер-длинный-заголовок-без-пробелов-который-шире-контейнера
      </Typography>
      <Typography variant="p">
        Длинный абзац текста, который должен переноситься на несколько строк внутри узкого контейнера, не
        ломая раскладку соседних элементов.
      </Typography>
      <Typography variant="blockquote">
        Очень длинная цитата, занимающая несколько строк и проверяющая перенос текста рядом с левой чертой.
      </Typography>
      <Typography variant="inline-code">
        {"const veryLongIdentifierWithoutSpaces = 1234567890;"}
      </Typography>
      <Typography variant="p">{""}</Typography>
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
          {variants.map((v) => (
            <Typography key={v} variant={v}>
              {sample[v]}
            </Typography>
          ))}
        </div>
      ))}
    </div>
  ),
};
