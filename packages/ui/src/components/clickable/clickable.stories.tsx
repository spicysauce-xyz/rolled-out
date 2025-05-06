import type { Meta, StoryObj } from "@storybook/react";
import { EllipsisVerticalIcon, Plus, User2 } from "lucide-react";
import { Clickable } from ".";

const meta = {
  title: "Components/Clickable",
  component: Clickable.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
    color: {
      options: ["neutral", "accent", "danger", "success", "warning"],
      control: { type: "select" },
    },
    variant: {
      options: ["filled", "secondary", "tertiary"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Clickable.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMenu: Story = {
  args: {
    variant: "tertiary",
    children: "Button",
  },
  render: ({ children, ...args }) => (
    <Clickable.Root
      {...args}
      className="flex h-9 w-48 items-center justify-between px-2.5"
    >
      <div className="flex items-center gap-2">
        <User2 className="size-4" />
        John Doe
      </div>
      <Clickable.Icon>
        <EllipsisVerticalIcon />
      </Clickable.Icon>
    </Clickable.Root>
  ),
};
