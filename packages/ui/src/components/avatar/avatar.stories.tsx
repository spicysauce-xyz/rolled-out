import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./";

const meta = {
  title: "Components/Avatar",
  component: Avatar.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <Avatar.Root {...args}>
      <Avatar.Image alt="@shadcn" src="https://github.com/shadcn.png" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const Fallback: Story = {
  render: ({ ...args }) => (
    <Avatar.Root {...args}>
      <Avatar.Image alt="@shadcn" src="broken-link" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  ),
};
