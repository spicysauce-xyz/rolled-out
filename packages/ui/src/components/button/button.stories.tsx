import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { Button } from "./";

const meta = {
  title: "Components/Button",
  component: Button.Root,
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
} satisfies Meta<typeof Button.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    children: "Button",
    variant: "filled",
  },
  render: ({ children, ...args }) => (
    <Button.Root {...args}>
      <Button.Icon>
        <Plus />
      </Button.Icon>
      {children}
    </Button.Root>
  ),
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
  render: ({ children, ...args }) => (
    <Button.Root {...args}>
      <Button.Icon>
        <Plus />
      </Button.Icon>
      {children}
    </Button.Root>
  ),
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Button",
  },
  render: ({ children, ...args }) => (
    <Button.Root {...args}>
      <Button.Icon>
        <Plus />
      </Button.Icon>
      {children}
    </Button.Root>
  ),
};
