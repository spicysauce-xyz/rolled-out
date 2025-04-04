import type { Meta, StoryObj } from "@storybook/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonGroup } from "./";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof ButtonGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Item>Previous</ButtonGroup.Item>
      <ButtonGroup.Item>Next</ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};

export const WithIcons: Story = {
  render: ({ ...args }) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Item>
        <ButtonGroup.Icon>
          <ChevronLeft />
        </ButtonGroup.Icon>
        Previous
      </ButtonGroup.Item>
      <ButtonGroup.Item>
        Next
        <ButtonGroup.Icon>
          <ChevronRight />
        </ButtonGroup.Icon>
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};

export const IconsOnly: Story = {
  render: ({ ...args }) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Item>
        <ButtonGroup.Icon>
          <ChevronLeft />
        </ButtonGroup.Icon>
      </ButtonGroup.Item>
      <ButtonGroup.Item>
        <ButtonGroup.Icon>
          <ChevronRight />
        </ButtonGroup.Icon>
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};
