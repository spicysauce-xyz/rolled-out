import type { Meta, StoryObj } from "@storybook/react";
import { Trash2Icon } from "lucide-react";
import { Button } from "../button";
import { AlertDialog } from "./";

const meta: Meta = {
  title: "Components/AlertDialog",
  component: AlertDialog.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Trigger render={<Button.Root color="danger" />}>
        <Button.Icon render={<Trash2Icon />} />
        Delete Account
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
          <AlertDialog.Cancel>No</AlertDialog.Cancel>
          <AlertDialog.Action color="danger">
            <Button.Icon render={<Trash2Icon />} />
            Yes, delete my account
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};
