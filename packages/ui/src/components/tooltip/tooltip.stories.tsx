import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Tooltip } from "./";

const meta: Meta = {
  title: "Components/Tooltip",
  component: Tooltip.Content,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    security: {
      options: ["top", "right", "bottom", "left"],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button.Root>Hover me</Button.Root>} />
        <Tooltip.Content {...args}>
          <Tooltip.Title>Tooltip title</Tooltip.Title>
          <Tooltip.Description>
            Tooltip description goes here
          </Tooltip.Description>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const Multiple: Story = {
  render: ({ ...args }) => (
    <div className="flex gap-2">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button.Root>1</Button.Root>} />
          <Tooltip.Content {...args}>
            <Tooltip.Title>Tooltip title 1</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button.Root>2</Button.Root>} />
          <Tooltip.Content {...args}>
            <Tooltip.Title>Tooltip title 2</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root>3</Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content {...args}>
            <Tooltip.Title>Tooltip title 3</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  ),
};
