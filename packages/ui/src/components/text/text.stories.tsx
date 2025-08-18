import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./";

const meta: Meta = {
  title: "Components/Text",
  component: Text.Root,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "The quick brown fox jumps over the lazy dog",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "display"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold"],
    },
    color: {
      control: "select",
      options: ["neutral", "accent", "danger", "warning", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
