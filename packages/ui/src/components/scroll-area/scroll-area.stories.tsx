import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./";

const meta: Meta = {
  title: "Components/ScrollArea",
  component: ScrollArea.Scrollbar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <ScrollArea.Root className="h-72 w-72 rounded-xl border border-neutral-200">
      <ScrollArea.Viewport>
        <div className="h-100 w-100 p-4">
          <div className="h-full w-full bg-accent-400" />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar {...args}>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

export const Both: Story = {
  argTypes: {
    orientation: {
      table: {
        disable: true,
      },
    },
  },
  render: ({ ...args }) => (
    <ScrollArea.Root className="h-72 w-72 rounded-xl border border-neutral-200">
      <ScrollArea.Viewport>
        <div className="h-100 w-100 p-4">
          <div className="h-full w-full bg-accent-400" />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" {...args}>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal" {...args}>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};
