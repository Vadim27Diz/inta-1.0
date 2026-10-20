import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderOpen, SearchX, Inbox } from "lucide-react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "./empty";
import { Button } from "./button";

const meta = {
  title: "Components/Empty",
  component: Empty,
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>Нет файлов</EmptyTitle>
        <EmptyDescription>Загрузите файл, чтобы он появился здесь</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Загрузить файл</Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia>
            <Inbox className="size-10 text-on-surface-muted" />
          </EmptyMedia>
          <EmptyTitle>media variant=default</EmptyTitle>
          <EmptyDescription>Без плашки — только иконка в потоке</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>media variant=icon</EmptyTitle>
          <EmptyDescription>С плашкой bg-surface-muted</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>
            Очень длинный заголовок пустого состояния, который должен переноситься на вторую строку
          </EmptyTitle>
          <EmptyDescription>
            Длинное_слово_без_пробелов_которое_не_должно_распирать_контейнер_за_его_границы_и_ломать_раскладку
            — описание переносится благодаря max-w-sm и text-balance.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" variant="outline">
            Повторить поиск
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Без описания и действий</EmptyTitle>
        </EmptyHeader>
      </Empty>
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
          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>Нет файлов</EmptyTitle>
              <EmptyDescription>Загрузите файл, чтобы он появился здесь</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">Загрузить файл</Button>
            </EmptyContent>
          </Empty>
          <Empty className="rounded-lg border border-dashed border-border bg-surface-raised text-on-surface-raised">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>Нет файлов</EmptyTitle>
              <EmptyDescription>Загрузите файл, чтобы он появился здесь</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">Загрузить файл</Button>
            </EmptyContent>
          </Empty>
        </div>
      ))}
    </div>
  ),
};
