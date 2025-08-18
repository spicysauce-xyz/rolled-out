import type { Meta, StoryObj } from "@storybook/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonGroup } from "./";

const meta = {
  title: "Components/Buttons/Group",
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
      <ButtonGroup.Item isActive>Weekly</ButtonGroup.Item>
      <ButtonGroup.Item>Monthly</ButtonGroup.Item>
      <ButtonGroup.Item>Yearly</ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};

export const WithIcons: Story = {
  render: ({ ...args }) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Item isDisabled>
        <ButtonGroup.Icon render={<ChevronLeft />} />
        Previous
      </ButtonGroup.Item>
      <ButtonGroup.Item className="min-w-10 justify-center" isActive>
        1
      </ButtonGroup.Item>
      <ButtonGroup.Item className="min-w-10 justify-center">2</ButtonGroup.Item>
      <ButtonGroup.Item className="min-w-10 justify-center">
        ...
      </ButtonGroup.Item>
      <ButtonGroup.Item className="min-w-10 justify-center">
        14
      </ButtonGroup.Item>
      <ButtonGroup.Item className="min-w-10 justify-center">
        15
      </ButtonGroup.Item>
      <ButtonGroup.Item>
        Next
        <ButtonGroup.Icon render={<ChevronRight />} />
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};

export const IconsOnly: Story = {
  render: ({ ...args }) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Item>
        <ButtonGroup.Icon render={<ChevronLeft />} />
      </ButtonGroup.Item>
      <ButtonGroup.Item>
        <ButtonGroup.Icon render={<ChevronRight />} />
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};
