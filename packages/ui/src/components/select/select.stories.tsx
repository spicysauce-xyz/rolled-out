import type { Meta, StoryObj } from "@storybook/react";
import { MailIcon } from "lucide-react";
import { Button } from "../button";
import { Select } from "./";

const meta: Meta = {
  title: "Components/Select",
  component: Select.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const values = [
  {
    label: "Option 0",
    value: null,
  },
  {
    label: "Option 1",
    value: "1",
  },
  {
    label: "Option 2",
    value: "2",
  },
  {
    label: "Option 3",
    value: "3",
  },
  {
    label: "Option 4",
    value: "4",
  },
  {
    label: "Option 5",
    value: "5",
  },
  {
    label: "Option 6",
    value: "6",
  },
];

export const Default: Story = {
  render: () => (
    <Select.Root items={values}>
      <Select.Trigger
        render={
          <Button.Root variant="secondary">
            <Select.Value />
            <Button.Icon render={<Select.Icon />} />
          </Button.Root>
        }
      />
      <Select.Content>
        {values.map((value) => (
          <Select.Item key={value.value} value={value.value}>
            <Select.ItemIcon render={<MailIcon />} />
            <Select.ItemText>{value.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  ),
};
