import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./";

const meta: Meta = {
  title: "Components/Tag",
  component: Tag.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Tag.Root>General</Tag.Root>,
};

export const Interactive: Story = {
  render: () => <Tag.Root isInteractive>Clickable</Tag.Root>,
};

export const Cloud: Story = {
  render: () => (
    <div className="flex max-w-xl flex-wrap gap-2">
      {[
        "Design",
        "Frontend",
        "Backend",
        "Documentation",
        "Research",
        "Meetings",
        "Chores",
        "DevOps",
        "Testing",
        "Security",
        "Analytics",
        "Accessibility",
      ].map((t) => (
        <Tag.Root isInteractive key={t}>
          {t}
        </Tag.Root>
      ))}
    </div>
  ),
};
