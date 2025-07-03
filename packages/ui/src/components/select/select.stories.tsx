import type { Meta, StoryObj } from "@storybook/react";
import { Mail } from "lucide-react";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Text } from "../text";
import { Select } from "./";

const meta = {
  title: "Components/Select",
  component: Select.Root,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger asChild>
        <Button.Root variant="secondary">
          <Select.Value placeholder="Select an option" />
          <Button.Icon>
            <Select.Icon />
          </Button.Icon>
        </Button.Root>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="1">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 1
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="2">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 2
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="3">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 3
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="4">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 4
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="5">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 5
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="6">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 6
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="7">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 7
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="8">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 8
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="9">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 9
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="10">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 10
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="11">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 11
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="12">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 12
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="13">
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 13
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger asChild>
        <Button.Root variant="secondary">
          <Select.Value placeholder="Select an option" />
          <Button.Icon>
            <Select.Icon />
          </Button.Icon>
        </Button.Root>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="1">
          <Select.ItemIcon>
            <Mail />
          </Select.ItemIcon>
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 1
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="2">
          <Select.ItemIcon>
            <Mail />
          </Select.ItemIcon>
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 2
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="3">
          <Select.ItemIcon>
            <Mail />
          </Select.ItemIcon>
          <Select.ItemText>
            <Text.Root size="sm" weight="medium">
              Option 3
            </Text.Root>
          </Select.ItemText>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  ),
};

export const WithIconsInPreview: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger asChild>
        <Button.Root variant="secondary">
          <Select.Value placeholder="Select an option" />
          <Button.Icon>
            <Select.Icon />
          </Button.Icon>
        </Button.Root>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="1">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              <Select.ItemIcon>
                <Mail />
              </Select.ItemIcon>
              <Text.Root size="sm" weight="medium">
                Option 1
              </Text.Root>
            </div>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="2">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              <Select.ItemIcon>
                <Mail />
              </Select.ItemIcon>
              <Text.Root size="sm" weight="medium">
                Option 2
              </Text.Root>
            </div>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="3">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              <Select.ItemIcon>
                <Mail />
              </Select.ItemIcon>
              <Text.Root size="sm" weight="medium">
                Option 3
              </Text.Root>
            </div>
          </Select.ItemText>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  ),
};

export const WithAvatars: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger asChild>
        <Button.Root variant="secondary">
          <Select.Value placeholder="Select an option" />
          <Button.Icon>
            <Select.Icon />
          </Button.Icon>
        </Button.Root>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="1">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              <Avatar.Root className="size-6 rounded-full">
                <Avatar.Image src="https://github.com/shadcn.png" />
                <Avatar.Fallback>SH</Avatar.Fallback>
              </Avatar.Root>
              <div className="flex items-baseline gap-1">
                <Text.Root size="sm" weight="medium">
                  Shadcn
                </Text.Root>
                <Text.Root color="muted" size="xs">
                  @shadcn
                </Text.Root>
              </div>
            </div>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="2">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              <Avatar.Root className="size-6 rounded-full">
                <Avatar.Image src="https://github.com/johndoe.png" />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.Root>
              <div className="flex items-baseline gap-1">
                <Text.Root size="sm" weight="medium">
                  John Doe
                </Text.Root>
                <Text.Root color="muted" size="xs">
                  @johndoe
                </Text.Root>
              </div>
            </div>
          </Select.ItemText>
        </Select.Item>
        <Select.Item value="3">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              <Avatar.Root className="size-6 rounded-full">
                <Avatar.Image src="https://github.com/janedoe.png" />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.Root>
              <div className="flex items-baseline gap-1">
                <Text.Root size="sm" weight="medium">
                  Jane Doe
                </Text.Root>
                <Text.Root color="muted" size="xs">
                  @janedoe
                </Text.Root>
              </div>
            </div>
          </Select.ItemText>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  ),
};
