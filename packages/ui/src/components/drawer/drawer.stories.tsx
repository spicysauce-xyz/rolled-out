import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Text } from "../text";
import { Drawer } from "./";

const meta = {
  title: "Components/Drawer",
  component: Drawer.Root,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button.Root>Open Drawer</Button.Root>
      </Drawer.Trigger>
      <Drawer.Body className="w-140">
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
          <Drawer.Description>
            This is a description of the drawer content.
          </Drawer.Description>
          <Drawer.CloseX />
        </Drawer.Header>
        <Drawer.Content>
          <div className="flex flex-col gap-4">
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
            <Text.Root size="sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text.Root>
          </div>
        </Drawer.Content>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button.Root className="sm:flex-1" variant="secondary">
              Cancel
            </Button.Root>
          </Drawer.Close>
          <Button.Root className="sm:flex-1" color="success">
            Save Changes
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Body>
    </Drawer.Root>
  ),
};
