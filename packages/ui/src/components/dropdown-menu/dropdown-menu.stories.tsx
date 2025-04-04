import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart2,
  LineChart,
  LogOut,
  PenLine,
  RefreshCw,
  Settings,
  Smartphone,
} from "lucide-react";
import { Button } from "../button";
import { DropdownMenu } from "./";

const meta = {
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
} satisfies Meta<typeof DropdownMenu.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button.Root>Open Menu</Button.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args}>
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon>
              <PenLine />
            </DropdownMenu.ItemIcon>
            Profile
            <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon>
              <Settings />
            </DropdownMenu.ItemIcon>
            Settings
            <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon>
              <RefreshCw />
            </DropdownMenu.ItemIcon>
            Updates
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <DropdownMenu.ItemIcon>
                <Smartphone />
              </DropdownMenu.ItemIcon>
              More Tools
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>
                <DropdownMenu.ItemIcon>
                  <BarChart2 />
                </DropdownMenu.ItemIcon>
                Analytics
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <DropdownMenu.ItemIcon>
                  <LineChart />
                </DropdownMenu.ItemIcon>
                Reports
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <DropdownMenu.ItemIcon>
            <LogOut />
          </DropdownMenu.ItemIcon>
          Log out
          <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};
