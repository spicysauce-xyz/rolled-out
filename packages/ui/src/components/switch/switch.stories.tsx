import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./";

const meta: Meta = {
  title: "Components/Switch",
  component: Switch.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};
