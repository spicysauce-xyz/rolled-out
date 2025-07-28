import { Text } from "@mono/ui";
import { LandingSection } from "../shared/section";

export const MarketingFooter = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content className="flex-row">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <Text.Root size="sm" weight="medium">
              rolledout.xyz
            </Text.Root>
            <div className="flex gap-2">
              <Text.Root color="muted" size="sm">
                Get Started
              </Text.Root>
              <Text.Root color="muted" size="sm">
                Pricing
              </Text.Root>
              <Text.Root color="muted" size="sm">
                Changelog
              </Text.Root>
              <Text.Root color="muted" size="sm">
                Contacts
              </Text.Root>
              <Text.Root color="muted" size="sm">
                Docs
              </Text.Root>
              <Text.Root color="muted" size="sm">
                Status
              </Text.Root>
            </div>
          </div>
          <div className="h-px w-full bg-neutral-100" />
          <div className="flex w-full items-center justify-between">
            <Text.Root color="muted" size="sm">
              © 2025 Rolled Out. All rights reserved.
            </Text.Root>
            <div className="flex gap-2">
              <Text.Root color="muted" size="sm">
                Privacy
              </Text.Root>
              <Text.Root color="muted" size="sm">
                Terms
              </Text.Root>
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
