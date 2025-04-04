import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./";

const meta = {
  title: "Components/Text",
  component: Text.Root,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "The quick brown fox jumps over the lazy dog",
  },
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
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
} satisfies Meta<typeof Text.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
