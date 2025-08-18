import { LandingSection } from "@components/section";
import { Text } from "@mono/ui";

export const MarketingFooter = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content className="flex-row">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <Text.Root size="lg" weight="medium">
              rolledout.xyz
            </Text.Root>
            <div className="flex gap-4">
              <Text.Root color="muted" size="lg">
                Get Started
              </Text.Root>
              <Text.Root color="muted" size="lg">
                Pricing
              </Text.Root>
              <Text.Root color="muted" size="lg">
                Changelog
              </Text.Root>
              <Text.Root color="muted" size="lg">
                Contacts
              </Text.Root>
              <Text.Root color="muted" size="lg">
                Docs
              </Text.Root>
              <Text.Root color="muted" size="lg">
                Status
              </Text.Root>
            </div>
          </div>
          <div className="h-px w-full bg-neutral-100" />
          <div className="flex w-full items-center justify-between">
            <Text.Root color="muted" size="lg">
              © 2025 Rolled Out. All rights reserved.
            </Text.Root>
            <div className="flex gap-4">
              <Text.Root color="muted" size="lg">
                Privacy
              </Text.Root>
              <Text.Root color="muted" size="lg">
                Terms
              </Text.Root>
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
