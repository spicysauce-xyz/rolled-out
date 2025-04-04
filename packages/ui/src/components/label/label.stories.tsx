import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./";

const meta = {
  title: "Components/Label",
  component: Label.Root,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Label.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const WithAsterisk: Story = {
  render: () => (
    <Label.Root>
      Required field
      <Label.Asterisk />
    </Label.Root>
  ),
};

export const WithSubtext: Story = {
  render: () => (
    <Label.Root>
      Username
      <Label.Sub>(optional)</Label.Sub>
    </Label.Root>
  ),
};

export const Complex: Story = {
  render: () => (
    <Label.Root>
      Profile details
      <Label.Asterisk />
      <Label.Sub>(public)</Label.Sub>
    </Label.Root>
  ),
};
