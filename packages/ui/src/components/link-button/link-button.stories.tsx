import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRight } from "lucide-react";
import { LinkButton } from "./";

const meta = {
  title: "Components/LinkButton",
  component: LinkButton.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
    color: {
      options: ["neutral", "accent", "muted", "danger", "warning", "success"],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
    isDisabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof LinkButton.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <LinkButton.Root {...args}>Link Button</LinkButton.Root>
  ),
};

export const WithIcon: Story = {
  render: ({ ...args }) => (
    <LinkButton.Root {...args}>
      Link Button
      <LinkButton.Icon>
        <ChevronRight />
      </LinkButton.Icon>
    </LinkButton.Root>
  ),
};
