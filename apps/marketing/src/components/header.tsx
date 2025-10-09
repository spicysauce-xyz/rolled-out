import { LandingSection } from "@components/section";
import { Button, Text } from "@mono/ui";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem = ({ children, href }: NavItemProps) => {
  return (
    <Button.Root render={<a href={href} />} size="sm" variant="tertiary">
      <span className="text-lg">{children}</span>
    </Button.Root>
  );
};

export const MarketingHeader = () => {
  return (
    <LandingSection.Root className="sticky top-0 z-50 border-neutral-100 border-b bg-white">
      <LandingSection.Content className="flex-row py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex-1">
            <Text.Root className="flex-1" size="lg" weight="medium">
              rolledout.xyz
            </Text.Root>
          </div>
          {/* <div className="flex gap-2">
            <NavItem>Pricing</NavItem>
            <NavItem>FAQ</NavItem>
            <NavItem>Docs</NavItem>
            <NavItem>GitHub</NavItem>
          </div> */}
          <div className="flex flex-1 justify-end gap-2">
            <NavItem href="https://app.rolledout.xyz">Sign In</NavItem>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
