import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./aspect-ratio";

const DEMO_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'>" +
      "<rect width='320' height='180' fill='#7c9cbf'/>" +
      "<circle cx='60' cy='48' r='20' fill='#fff'/>" +
      "</svg>"
  );

const meta = {
  title: "Components/Aspect Ratio",
  component: AspectRatio,
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args} ratio={16 / 9}>
        <img src={DEMO_IMAGE} alt="" className="size-full rounded-lg object-cover" />
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
