import { LandingSection } from "@components/section";
import { Button, ButtonGroup, Text } from "@mono/ui";
import {
  ArrowLeftIcon,
  CircleIcon,
  DiamondIcon,
  EyeOffIcon,
  GithubIcon,
  GlobeIcon,
  InfinityIcon,
  MessageCircleIcon,
  SquareIcon,
  UserIcon,
  UsersIcon,
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
              <ButtonGroup.Item isActive>
                <span className="text-lg">Monthly</span>
              </ButtonGroup.Item>
              <ButtonGroup.Item>
                <span className="text-lg">Yearly</span>
              </ButtonGroup.Item>
            </ButtonGroup.Root>
            <div className="flex items-center gap-1">
              <ArrowLeftIcon className="size-3.5 stroke-neutral-500" />
              <Text.Root color="muted">Save ~17% with yearly billing</Text.Root>
            </div>
          </div>
        </LandingSection.Header>
        <div className="grid w-full grid-cols-3 gap-4">
          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-accent-50">
                <CircleIcon className="size-6 stroke-accent-500" />
              </div>
              <Text.Root className="text-[1.25rem]" weight="medium">
                Free
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                $0{" "}
                <span className="font-weight-400 text-md text-neutral-500">
                  / month
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-col gap-2 border-neutral-100 border-t p-4">
              <div className="flex items-center gap-2">
                <UserIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  1 member
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <InfinityIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  Unlimited updates
                </Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root
                render={<a href="https://app.rolledout.xyz?plan=free" />}
                size="lg"
                variant="tertiary"
              >
                <span className="w-full text-center text-lg">
                  Start with Free
                </span>
              </Button.Root>
            </div>
          </div>

          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-success-50">
                <SquareIcon className="size-6 stroke-success-500" />
              </div>
              <Text.Root className="text-[1.25rem]" weight="medium">
                Starter
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                $14{" "}
                <span className="font-weight-400 text-md text-neutral-500">
                  / month, billed monthly
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-col gap-2 border-neutral-100 border-t p-4">
              <Text.Root className="leading-6" color="muted">
                Everything from Free, plus:
              </Text.Root>
              <div className="flex items-center gap-2">
                <UsersIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  Up to 3 members
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <GlobeIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  Custom domain
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <GithubIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  GitHub integration
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <EyeOffIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  Removed branding
                </Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root
                render={<a href="https://app.rolledout.xyz?plan=starter" />}
                size="lg"
              >
                <span className="w-full text-center text-lg">
                  Start with Starter
                </span>
              </Button.Root>
            </div>
          </div>

          <div className="flex h-fit flex-col rounded-md border border-neutral-100 bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-warning-50">
                <DiamondIcon className="size-6 stroke-warning-500" />
              </div>
              <Text.Root className="text-[1.25rem]" weight="medium">
                Pro
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                $29{" "}
                <span className="font-weight-400 text-md text-neutral-500">
                  / month, billed monthly
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-col gap-2 border-neutral-100 border-t p-4">
              <Text.Root className="leading-6" color="muted">
                Everything from Starter, plus:
              </Text.Root>
              <div className="flex items-center gap-2">
                <UsersIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  Unlimited members
                </Text.Root>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircleIcon className="size-4" />
                <Text.Root size="lg" weight="medium">
                  Priority support
                </Text.Root>
              </div>
            </div>
            <div className="flex flex-col border-neutral-100 border-t p-4">
              <Button.Root
                render={<a href="https://app.rolledout.xyz?plan=pro" />}
                size="lg"
                variant="tertiary"
              >
                <span className="w-full text-center text-lg">
                  Start with Pro
                </span>
              </Button.Root>
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
