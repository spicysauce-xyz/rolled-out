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
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const Fallback: Story = {
  render: ({ ...args }) => (
    <Avatar.Root {...args}>
      <Avatar.Image src="broken-link" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  ),
};
