import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Text } from "../text";
import { Popover } from "./";

const meta: Meta = {
  title: "Components/Popover",
  component: Popover.Content,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    side: {
      options: ["top", "right", "bottom", "left"],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    side: "bottom",
  },
  render: ({ ...args }) => (
    <Popover.Root>
      <Popover.Trigger render={<Button.Root>Open popover</Button.Root>} />
      <Popover.Content {...args}>
        <div className="flex w-56 flex-col gap-2">
          <Text.Root>This is a popover content.</Text.Root>
          <div className="flex gap-2">
            <Button.Root variant="secondary">Cancel</Button.Root>
            <Button.Root>Confirm</Button.Root>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const Sides: Story = {
  args: {
    side: "bottom",
  },
  render: ({ side, ...args }) => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(["top", "right", "bottom", "left"] as const).map((s) => (
        <Popover.Root key={s}>
          <Popover.Trigger render={<Button.Root>{s}</Button.Root>} />
          <Popover.Content {...args} side={s}>
            <Text.Root className="capitalize">Side: {s}</Text.Root>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  ),
};
