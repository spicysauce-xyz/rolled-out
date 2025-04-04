import type { Meta, StoryObj } from "@storybook/react";
import { Trash2Icon } from "lucide-react";
import { Button } from "../button";
import { AlertDialog } from "./";

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialog.Root,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Trigger asChild>
        <Button.Root color="danger">
          <Button.Icon>
            <Trash2Icon />
          </Button.Icon>
          Delete Account
        </Button.Root>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action color="danger">
            <Button.Icon>
              <Trash2Icon />
            </Button.Icon>
            Delete Account
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};
