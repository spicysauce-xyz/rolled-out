import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./";

const meta: Meta = {
  title: "Components/Skeleton",
  component: Skeleton.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Lines: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Skeleton.Root className="h-5 w-full" />
      <Skeleton.Root className="h-5 w-11/12" />
      <Skeleton.Root className="h-5 w-10/12" />
      <Skeleton.Root className="h-5 w-9/12" />
    </div>
  ),
};

export const AvatarWithText: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton.Root className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton.Root className="h-4 w-7/12" />
          <Skeleton.Root className="h-4 w-5/12" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton.Root className="h-3 w-full" />
        <Skeleton.Root className="h-3 w-11/12" />
        <Skeleton.Root className="h-3 w-10/12" />
      </div>
    </div>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid w-[28rem] grid-cols-3 gap-4">
      {["a", "b", "c", "d", "e", "f"].map((id) => (
        <div className="space-y-3" key={`card-${id}`}>
          <Skeleton.Root className="h-24 w-full rounded-lg" />
          <Skeleton.Root className="h-4 w-9/12" />
          <Skeleton.Root className="h-3 w-6/12" />
        </div>
      ))}
    </div>
  ),
};
