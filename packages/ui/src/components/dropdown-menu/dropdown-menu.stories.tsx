import type { Meta, StoryObj } from "@storybook/react";
import {
  AppleIcon,
  BananaIcon,
  BarChart2,
  LineChart,
  LogOut,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { Button } from "../button";
import { DropdownMenu } from "./";

const meta: Meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu.Content,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    side: {
      options: ["top", "right", "bottom", "left"],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger render={<Button.Root />}>
        Open Menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args}>
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon render={<RefreshCw />} />
            Updates
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <DropdownMenu.ItemIcon render={<Smartphone />} />
              More Tools
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Content alignOffset={-8} side="right" sideOffset={12}>
              <DropdownMenu.Group>
                <DropdownMenu.Item>
                  <DropdownMenu.ItemIcon render={<BarChart2 />} />
                  Analytics
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <DropdownMenu.ItemIcon render={<LineChart />} />
                  Reports
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup>
          <DropdownMenu.RadioItem value="apple">
            <DropdownMenu.ItemIcon render={<AppleIcon />} />
            Apple
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="banana">
            <DropdownMenu.ItemIcon render={<BananaIcon />} />
            Banana
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.CheckboxItem>
            <DropdownMenu.ItemIcon render={<AppleIcon />} />
            Apple
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem>
            <DropdownMenu.ItemIcon render={<BananaIcon />} />
            Banana
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon render={<LogOut />} />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};
