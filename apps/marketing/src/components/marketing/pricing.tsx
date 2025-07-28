import { Button, Text } from "@mono/ui";
import { CheckIcon, CircleIcon, DiamondIcon, SquareIcon } from "lucide-react";
import { LandingSection } from "../shared/section";

export const PricingSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <LandingSection.Title>Pricing</LandingSection.Title>
          <LandingSection.Subtitle>
            A board is a branded page that shows only the updates you tag for
            it. Group releases into boards so every audience sees only what
            matters.
          </LandingSection.Subtitle>
        </LandingSection.Header>
        <div className="grid w-full grid-cols-3 gap-4">
          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-accent-50">
                <CircleIcon className="size-6 stroke-accent-500" />
              </div>
              <Text.Root size="xs" variant="display" weight="medium">
                Free
              </Text.Root>
              <Text.Root size="lg" weight="medium">
                $0 <span className="text-neutral-500">/ month</span>
              </Text.Root>
            </div>
            <div className="flex flex-col border-neutral-100 border-t border-b p-4">
              <Text.Root color="muted" size="sm">
                For individuals and small teams ready to ship real products.
              </Text.Root>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root variant="tertiary">Start with Free</Button.Root>
            </div>
          </div>

          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-success-50">
                <SquareIcon className="size-6 stroke-success-500" />
              </div>
              <Text.Root size="xs" variant="display" weight="medium">
                Starter
              </Text.Root>
              <Text.Root size="lg" weight="medium">
                $14 <span className="text-neutral-500">/ month</span>
              </Text.Root>
            </div>
            <div className="flex flex-col border-neutral-100 border-t border-b p-4">
              <Text.Root color="muted" size="sm">
                For individuals and small teams ready to ship real products.
              </Text.Root>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <Text.Root color="muted" size="xs">
                Everything from Free, plus:
              </Text.Root>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root>Start with Starter</Button.Root>
            </div>
          </div>

          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-warning-50">
                <DiamondIcon className="size-6 stroke-warning-500" />
              </div>
              <Text.Root size="xs" variant="display" weight="medium">
                Pro
              </Text.Root>
              <Text.Root size="lg" weight="medium">
                $29 <span className="text-neutral-500">/ month</span>
              </Text.Root>
            </div>
            <div className="flex flex-col border-neutral-100 border-t border-b p-4">
              <Text.Root color="muted" size="sm">
                For individuals and small teams ready to ship real products.
              </Text.Root>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <Text.Root color="muted" size="xs">
                Everything from Starter, plus:
              </Text.Root>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-3.5" />
                <Text.Root size="sm" weight="medium">
                  Up to 3 boards
                </Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root variant="tertiary">Start with Pro</Button.Root>
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
