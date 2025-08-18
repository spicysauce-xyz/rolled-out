import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { IconButton } from "./";

const meta: Meta = {
  title: "Components/Buttons/Icon",
  component: IconButton.Root,
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
    <IconButton.Root {...args} variant="filled">
      <IconButton.Icon render={<Plus />} />
    </IconButton.Root>
  ),
};

export const Secondary: Story = {
  render: ({ children, ...args }) => (
    <IconButton.Root {...args} variant="secondary">
      <IconButton.Icon render={<Plus />} />
    </IconButton.Root>
  ),
};

export const Tertiary: Story = {
  render: ({ children, ...args }) => (
    <IconButton.Root {...args} variant="tertiary">
      <IconButton.Icon render={<Plus />} />
    </IconButton.Root>
  ),
};
