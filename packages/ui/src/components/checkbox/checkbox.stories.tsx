import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./";

const meta: Meta = {
  title: "Components/Checkbox",
  component: Checkbox.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="inline-flex items-center gap-2">
        <Checkbox.Root aria-label="Default" />
        <span>Default</span>
      </div>
      <div className="inline-flex items-center gap-2">
        <Checkbox.Root aria-label="Checked" defaultChecked />
        <span>Checked</span>
      </div>
      <div className="inline-flex items-center gap-2">
        <Checkbox.Root aria-label="Disabled" defaultChecked disabled />
        <span>Disabled</span>
      </div>
    </div>
  ),
};
