import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { Button } from "./";

const meta: Meta = {
  title: "Components/Buttons/Button",
  component: Button.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
    color: {
      options: ["neutral", "accent", "danger", "success", "warning"],
      control: { type: "select" },
    },
    isLoading: {
      control: { type: "boolean" },
    },
    isDisabled: {
      control: { type: "boolean" },
    },
    variant: {
      options: ["filled", "secondary", "tertiary"],
      control: { type: "select" },
      table: {
        readonly: true,
      },
    },
  },
  args: {
    isLoading: false,
    isDisabled: false,
    size: "md",
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  render: ({ children, ...args }) => (
    <Button.Root {...args} variant="filled">
      <Button.Icon render={<Plus />} />
      {children}
    </Button.Root>
  ),
};

export const Secondary: Story = {
  render: ({ children, ...args }) => (
    <Button.Root {...args} variant="secondary">
      <Button.Icon render={<Plus />} />
      {children}
    </Button.Root>
  ),
};

export const Tertiary: Story = {
  render: ({ children, ...args }) => (
    <Button.Root {...args} variant="tertiary">
      <Button.Icon render={<Plus />} />
      {children}
    </Button.Root>
  ),
};
