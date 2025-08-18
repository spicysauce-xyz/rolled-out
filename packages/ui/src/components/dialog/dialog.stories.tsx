import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon } from "lucide-react";
import { Button } from "../button";
import { Text } from "../text";
import { Dialog } from "./";

const meta: Meta = {
  title: "Components/Dialog",
  component: Dialog.Content,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOpen: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger render={<Button.Root>Open dialog</Button.Root>} />
      <Dialog.Content className="max-w-100">
        <Dialog.Header>
          <Dialog.Title>Unlock Premium Features</Dialog.Title>
          <Dialog.Description>
            Get unlimited access to all features and take your productivity to
            the next level.
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-4 items-center justify-center rounded-full bg-accent-100">
                <CheckIcon className="size-3 stroke-accent-600" />
              </div>
              <Text.Root weight="medium">
                Unlimited projects and workspaces
              </Text.Root>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-4 items-center justify-center rounded-full bg-accent-100">
                <CheckIcon className="size-3 stroke-accent-600" />
              </div>
              <Text.Root weight="medium">
                Advanced analytics and reporting
              </Text.Root>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-4 items-center justify-center rounded-full bg-accent-100">
                <CheckIcon className="size-3 stroke-accent-600" />
              </div>
              <Text.Root weight="medium">Priority customer support</Text.Root>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-4 items-center justify-center rounded-full bg-accent-100">
                <CheckIcon className="size-3 stroke-accent-600" />
              </div>
              <Text.Root weight="medium">
                Export data in multiple formats
              </Text.Root>
            </div>
          </div>
          <div className="rounded-lg border border-accent-200 bg-accent-50 p-4">
            <div className="flex items-baseline gap-2">
              <Text.Root size="lg" weight="medium">
                $9
              </Text.Root>
              <Text.Root color="muted" size="sm">
                / month
              </Text.Root>
            </div>
          </div>
        </div>
        <Dialog.Footer>
          <Dialog.Cancel>Maybe later</Dialog.Cancel>
          <Dialog.Action color="accent">Start free trial</Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger render={<Button.Root>Open dialog</Button.Root>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete project</Dialog.Title>
          <Dialog.Description>
            This action will permanently remove the project and all related
            data. You cannot undo this operation.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Cancel>Cancel</Dialog.Cancel>
          <Dialog.Action color="danger">Delete</Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger render={<Button.Root>Open dialog</Button.Root>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Terms and Conditions</Dialog.Title>
          <Dialog.Description>
            Please read and accept the following terms and conditions to
            continue.
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex max-h-96 flex-col gap-3 overflow-auto pr-2">
          {Array.from({ length: 12 }).map((_, idx) => (
            <Text.Root color="muted" key={`para-${idx + 1}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Integer lacinia, nisl et facilisis elementum, nisl velit
              aliquet turpis, nec dictum nunc justo et nulla.
            </Text.Root>
          ))}
        </div>
        <Dialog.Footer>
          <Dialog.Cancel>Dismiss</Dialog.Cancel>
          <Dialog.Action>Accept</Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};
