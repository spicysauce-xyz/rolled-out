import { LandingSection } from "@components/section";
import { Button, ButtonGroup, Text } from "@mono/ui";
import {
  ArrowLeftIcon,
  CheckIcon,
  CircleIcon,
  DiamondIcon,
  SquareIcon,
} from "lucide-react";

export const PricingSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <LandingSection.Title>Pricing</LandingSection.Title>
            <LandingSection.Subtitle>
              Start free, then pay monthly or annually only when you need more.
            </LandingSection.Subtitle>
          </div>
          <div className="relative flex gap-2">
            <ButtonGroup.Root size="lg">
              <ButtonGroup.Item isActive>Monthly</ButtonGroup.Item>
              <ButtonGroup.Item>Yearly</ButtonGroup.Item>
            </ButtonGroup.Root>
            <div className="flex items-center gap-1">
              <ArrowLeftIcon className="size-3.5 stroke-neutral-500" />
              <Text.Root color="muted" size="sm">
                Save ~17% with yearly billing
              </Text.Root>
            </div>
          </div>
        </LandingSection.Header>
        <div className="grid w-full grid-cols-3 gap-4">
          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-accent-50">
                <CircleIcon className="size-6 stroke-accent-500" />
              </div>
              <Text.Root size="lg" weight="medium">
                Free
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                $0{" "}
                <span className="font-weight-400 text-neutral-500 text-sm">
                  / month
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-col gap-2 border-neutral-100 border-t p-4">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root size="lg" variant="tertiary">
                Start with Free
              </Button.Root>
            </div>
          </div>

          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-success-50">
                <SquareIcon className="size-6 stroke-success-500" />
              </div>
              <Text.Root size="lg" weight="medium">
                Starter
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                $14{" "}
                <span className="font-weight-400 text-neutral-500 text-sm">
                  / month, billed monthly
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-col gap-2 border-neutral-100 border-t p-4">
              <Text.Root className="leading-6" color="muted" size="sm">
                Everything from Free, plus:
              </Text.Root>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root size="lg">Start with Starter</Button.Root>
            </div>
          </div>

          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-warning-50">
                <DiamondIcon className="size-6 stroke-warning-500" />
              </div>
              <Text.Root size="lg" weight="medium">
                Pro
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                $29{" "}
                <span className="font-weight-400 text-neutral-500 text-sm">
                  / month, billed monthly
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-col gap-2 border-neutral-100 border-t p-4">
              <Text.Root className="leading-6" color="muted" size="sm">
                Everything from Starter, plus:
              </Text.Root>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <Text.Root weight="medium">Up to 3 boards</Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root size="lg" variant="tertiary">
                Start with Pro
              </Button.Root>
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
