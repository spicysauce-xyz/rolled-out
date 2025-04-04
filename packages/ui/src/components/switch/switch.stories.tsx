import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./";

const meta = {
  title: "Components/Switch",
  component: Switch.Root,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};
