import type { Meta, StoryObj } from "@storybook/react";
import { PhoneIcon } from "lucide-react";
import { Input } from "./";

const meta = {
  title: "Components/Input",
  component: Input.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Input.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {},
  render: ({ children, ...args }) => (
    <div className="w-64">
      <Input.Root {...args}>
        <Input.Wrapper>
          <Input.Field type="tel" placeholder="Simple Input" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {},
  render: ({ children, ...args }) => (
    <div className="w-64">
      <Input.Root {...args}>
        <Input.Wrapper>
          <Input.Icon>
            <PhoneIcon />
          </Input.Icon>
          <Input.Field type="tel" placeholder="+1 (555) 123-4567" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {},
  render: ({ children, ...args }) => (
    <div className="w-64">
      <Input.Root {...args}>
        <Input.Wrapper>
          <Input.Text>+1</Input.Text>
          <Input.Field type="tel" placeholder="(555) 123-4567" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  ),
};
