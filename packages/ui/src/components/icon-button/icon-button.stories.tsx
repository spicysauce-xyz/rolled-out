import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { IconButton } from "./";

const meta = {
  title: "Components/IconButton",
  component: IconButton.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
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
} satisfies Meta<typeof IconButton.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    variant: "filled",
  },
  render: ({ ...args }) => (
    <IconButton.Root {...args}>
      <IconButton.Icon>
        <Plus />
      </IconButton.Icon>
    </IconButton.Root>
  ),
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
  render: ({ ...args }) => (
    <IconButton.Root {...args}>
      <IconButton.Icon>
        <Plus />
      </IconButton.Icon>
    </IconButton.Root>
  ),
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Button",
  },
  render: ({ ...args }) => (
    <IconButton.Root {...args}>
      <IconButton.Icon>
        <Plus />
      </IconButton.Icon>
    </IconButton.Root>
  ),
};
