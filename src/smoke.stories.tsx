// ВРЕМЕННАЯ история: smoke-тест из references/code.md, шаг 5.
// Удалить после проверки в браузере — компонентом дизайн-системы она не является.
import type { Meta, StoryObj } from "@storybook/react-vite";

function Smoke() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary text-on-primary hover:bg-primary-hover typo-heading-1 rounded-lg p-6">
        bg-primary · typo-heading-1 · rounded-lg
      </div>

      <div className="bg-surface-muted text-on-surface-muted border border-border rounded-lg p-6">
        <p className="typo-body-md">bg-surface-muted + text-on-surface-muted + border-border</p>
        <p className="typo-caption mt-2">typo-caption</p>
      </div>

      <div className="bg-blue-500 border border-border rounded-lg p-6">
        <p className="typo-body-sm">
          Контроль: класс bg-blue-500 не должен давать никакого фона — палитра Tailwind отключена
          через --color-*: initial.
        </p>
      </div>

      <button
        type="button"
        className="bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed focus-visible:ring-2 focus-visible:ring-focus-ring disabled:bg-disabled disabled:text-on-disabled typo-label-md rounded-md px-4 py-2 outline-none"
      >
        Ховер, нажатие и фокус с клавиатуры
      </button>
    </div>
  );
}

const meta = {
  title: "Smoke/Tokens",
  component: Smoke,
} satisfies Meta<typeof Smoke>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
