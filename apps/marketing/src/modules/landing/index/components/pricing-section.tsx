import { LandingSection } from "@components/section";
import { Button, ButtonGroup, Text, Transition } from "@mono/ui";
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
import { useState } from "react";

type BillingPeriod = "monthly" | "yearly";

export const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <LandingSection.Title>Pricing</LandingSection.Title>
            <LandingSection.Subtitle>
              We’re still polishing things. Enjoy full access and help us shape
              Rolled Out before launch. Early adopters get lifetime discounts
              and exclusive recognition when paid plans roll out.
            </LandingSection.Subtitle>
          </div>
          <div className="relative flex gap-2">
            <ButtonGroup.Root size="lg">
              <ButtonGroup.Item
                isActive={billingPeriod === "monthly"}
                onClick={() => setBillingPeriod("monthly")}
              >
                <span className="text-lg">Monthly</span>
              </ButtonGroup.Item>
              <ButtonGroup.Item
                isActive={billingPeriod === "yearly"}
                onClick={() => setBillingPeriod("yearly")}
              >
                <span className="text-lg">Yearly</span>
              </ButtonGroup.Item>
            </ButtonGroup.Root>
            <Transition.Root>
              {billingPeriod === "monthly" && (
                <Transition.Item
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-1 items-center gap-1"
                  exit={{ opacity: 0, x: 8 }}
                  initial={{ opacity: 0, x: 8 }}
                  key="yearly-billing-promo"
                >
                  <ArrowLeftIcon className="size-3.5 stroke-neutral-500" />
                  <Text.Root color="muted">
                    Save ~17% with yearly billing
                  </Text.Root>
                </Transition.Item>
              )}
            </Transition.Root>
          </div>
        </LandingSection.Header>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex h-full flex-col rounded-md border border-neutral-100 bg-white lg:h-fit">
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

            <div className="flex flex-1 flex-col gap-2 border-neutral-100 border-t p-4">
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

          <div className="flex h-full flex-col rounded-md border border-neutral-100 bg-white lg:h-fit">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-success-50">
                <SquareIcon className="size-6 stroke-success-500" />
              </div>
              <Text.Root className="text-[1.25rem]" weight="medium">
                Starter
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                <span className="text-neutral-500">$</span>
                <Transition.Root>
                  {billingPeriod === "yearly" && (
                    <Transition.Item
                      className="inline-block text-neutral-500 line-through"
                      key="yearly-price"
                    >
                      11
                    </Transition.Item>
                  )}
                  {billingPeriod === "monthly" && (
                    <Transition.Item
                      className="inline-block text-neutral-500 line-through"
                      key="monthly-price"
                    >
                      14
                    </Transition.Item>
                  )}
                </Transition.Root>{" "}
                <span>$0</span>{" "}
                <span className="font-weight-400 text-md text-neutral-500">
                  / month, billed{" "}
                  <Transition.Root>
                    {billingPeriod === "monthly" && (
                      <Transition.Item
                        className="inline-block"
                        key="monthly-billing-period"
                      >
                        monthly
                      </Transition.Item>
                    )}
                    {billingPeriod === "yearly" && (
                      <Transition.Item
                        className="inline-block"
                        key="yearly-billing-period"
                      >
                        yearly
                      </Transition.Item>
                    )}
                  </Transition.Root>
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-1 flex-col gap-2 border-neutral-100 border-t p-4">
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

          <div className="flex h-full flex-col rounded-md border border-neutral-100 bg-white lg:h-fit">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex size-8 items-center justify-center rounded-sm bg-warning-50">
                <DiamondIcon className="size-6 stroke-warning-500" />
              </div>
              <Text.Root className="text-[1.25rem]" weight="medium">
                Pro
              </Text.Root>
              <Text.Root size="xs" variant="display" weight="medium">
                <span className="text-neutral-500">$</span>
                <Transition.Root>
                  {billingPeriod === "yearly" && (
                    <Transition.Item
                      className="inline-block text-neutral-500 line-through"
                      key="yearly-price"
                    >
                      24
                    </Transition.Item>
                  )}
                  {billingPeriod === "monthly" && (
                    <Transition.Item
                      className="inline-block text-neutral-500 line-through"
                      key="monthly-price"
                    >
                      29
                    </Transition.Item>
                  )}
                </Transition.Root>{" "}
                <span>$0</span>{" "}
                <span className="font-weight-400 text-md text-neutral-500">
                  / month, billed{" "}
                  <Transition.Root>
                    {billingPeriod === "monthly" && (
                      <Transition.Item
                        className="inline-block"
                        key="monthly-billing-period"
                      >
                        monthly
                      </Transition.Item>
                    )}
                    {billingPeriod === "yearly" && (
                      <Transition.Item
                        className="inline-block"
                        key="yearly-billing-period"
                      >
                        yearly
                      </Transition.Item>
                    )}
                  </Transition.Root>
                </span>
              </Text.Root>
            </div>

            <div className="flex flex-1 flex-col gap-2 border-neutral-100 border-t p-4">
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
