import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./";

const meta = {
  title: "Components/Textarea",
  component: Textarea.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Textarea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Textarea.Root {...args}>
      <Textarea.Wrapper>
        <Textarea.Field placeholder="Enter text..." />
      </Textarea.Wrapper>
    </Textarea.Root>
  ),
  args: {
    size: "md",
    isInvalid: false,
    isDisabled: false,
  },
};
