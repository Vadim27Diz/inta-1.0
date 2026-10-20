import type { Meta, StoryObj } from "@storybook/react-vite";
import { Circle, Info, CircleCheck, TriangleAlert, CircleAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

// Иконки — те же глифы, что уже есть в наборе Icon / Glyphs (Figma): li:circle, li:info,
// li:circle-check, li:triangle-alert, li:circle-alert. Код не привязывает иконку к варианту
// (consumer передаёт любую через children), это конкретный выбор для примеров/BrandMatrix,
// чтобы figma-code-diff сверял один и тот же глиф по обе стороны.
const meta = {
  title: "Components/Alert",
  component: Alert,
  render: (args) => (
    <Alert {...args} className="w-96">
      <Circle />
      <AlertTitle>Заголовок алерта</AlertTitle>
      <AlertDescription>Короткое описание того, что произошло.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Alert variant="default">
        <Circle />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Нейтральное сообщение без статуса.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Информационное сообщение.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Операция выполнена успешно.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Проверьте введённые данные перед продолжением.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <CircleAlert />
        <AlertTitle>Danger</AlertTitle>
        <AlertDescription>Не удалось сохранить изменения.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>
          Очень длинный заголовок алерта из обычных слов с пробелами, который не помещается в три
          строки и поэтому должен обрезаться многоточием line-clamp-3 ровно на третьей строке
        </AlertTitle>
        <AlertDescription>
          Длинное_слово_без_пробелов_которое_не_должно_распирать_алерт_за_его_границы_и_ломать_раскладку —
          описание переносится внутри своей ширины (break-words), не вылезая за правый край блока.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info />
        <AlertTitle>
          Заголовок_с_одним_очень_длинным_словом_без_пробелов_которое_должно_переноситься_break_words_внутри_строк_и_всё_равно_обрезаться_многоточием_на_третьей_строке_line_clamp_3
        </AlertTitle>
        <AlertDescription>
          Заголовок выше — одно неразрывное слово: должен переноситься (не вылезать) и обрезаться
          многоточием на 3-й строке, а не обрываться без него.
        </AlertDescription>
      </Alert>
      <Alert variant="danger">
        <CircleAlert />
        <AlertDescription>Алерт без заголовка — только описание.</AlertDescription>
      </Alert>
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
          <Alert variant="info" className="w-80">
            <Info />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Проверка контраста на surface.</AlertDescription>
          </Alert>
          <Alert variant="success" className="w-80">
            <CircleCheck />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Проверка контраста на surface.</AlertDescription>
          </Alert>
          <Alert variant="warning" className="w-80">
            <TriangleAlert />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Проверка контраста на surface.</AlertDescription>
          </Alert>
          <Alert variant="danger" className="w-80">
            <CircleAlert />
            <AlertTitle>Danger</AlertTitle>
            <AlertDescription>Проверка контраста на surface.</AlertDescription>
          </Alert>
        </div>
      ))}
    </div>
  ),
};
