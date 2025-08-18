import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { LinkButton } from "../link-button";
import { Toaster } from "./";

const meta: Meta = {
  title: "Components/Toast",
  component: Toaster.Root,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button.Root
        color="accent"
        onClick={() =>
          Toaster.info("Check out this cool feature!", {
            description: "We just launched something amazing that you'll love",
          })
        }
      >
        Show Info Toast
      </Button.Root>

      <Button.Root
        color="success"
        onClick={() =>
          Toaster.success("Your changes have been saved!", {
            description:
              "All modifications were successfully applied to the system",
          })
        }
      >
        Show Success Toast
      </Button.Root>

      <Button.Root
        color="danger"
        onClick={() =>
          Toaster.error("Save failed", {
            description:
              "We encountered an error while trying to save your recent changes to the system. Please try saving again, and if you continue experiencing issues, reach out to our support team for assistance",
            action: <LinkButton.Root color="danger">Try Again</LinkButton.Root>,
          })
        }
      >
        Show Error Toast
      </Button.Root>
      <Button.Root
        color="warning"
        onClick={() => Toaster.warning("Warning message")}
      >
        Show Warning Toast
      </Button.Root>

      <Button.Root
        color="neutral"
        onClick={() => {
          const id = Toaster.loading("Loading...");
          setTimeout(
            () =>
              Toaster.success("Loaded", {
                description: "Loading finished",
                id,
              }),
            2000
          );
        }}
      >
        Show Loading Toast
      </Button.Root>

      <Toaster.Root />
    </div>
  ),
};
