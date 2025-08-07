import { LandingSection } from "@components/section";
import { Text } from "@mono/ui";

export const MarketingFooter = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content className="flex-row">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <Text.Root weight="medium">rolledout.xyz</Text.Root>
            <div className="flex gap-4">
              <Text.Root color="muted" weight="medium">
                Get Started
              </Text.Root>
              <Text.Root color="muted" weight="medium">
                Pricing
              </Text.Root>
              <Text.Root color="muted" weight="medium">
                Changelog
              </Text.Root>
              <Text.Root color="muted" weight="medium">
                Contacts
              </Text.Root>
              <Text.Root color="muted" weight="medium">
                Docs
              </Text.Root>
              <Text.Root color="muted" weight="medium">
                Status
              </Text.Root>
            </div>
          </div>
          <div className="h-px w-full bg-neutral-100" />
          <div className="flex w-full items-center justify-between">
            <Text.Root color="muted">
              © 2025 Rolled Out. All rights reserved.
            </Text.Root>
            <div className="flex gap-4">
              <Text.Root color="muted" weight="medium">
                Privacy
              </Text.Root>
              <Text.Root color="muted" weight="medium">
                Terms
              </Text.Root>
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
