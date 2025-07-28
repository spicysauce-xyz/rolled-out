import { Button, Text } from "@mono/ui";
import {
  BookIcon,
  DollarSignIcon,
  HelpCircleIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { LandingSection } from "../shared/section";

interface NavItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ icon, children }: NavItemProps) => {
  return (
    <Button.Root
      className="text-neutral-900 hover:text-neutral-950 focus-visible:text-neutral-950"
      size="sm"
      variant="tertiary"
    >
      {icon && <Button.Icon>{icon}</Button.Icon>}
      {children}
    </Button.Root>
  );
};

export const MarketingHeader = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content className="flex-row">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex-1">
            <Text.Root className="flex-1" size="sm" weight="medium">
              rolledout.xyz
            </Text.Root>
          </div>
          <div className="flex gap-2">
            <NavItem icon={<SparklesIcon />}>Product</NavItem>
            <NavItem icon={<DollarSignIcon />}>Pricing</NavItem>
            <NavItem icon={<HelpCircleIcon />}>FAQ</NavItem>
            <NavItem icon={<BookIcon />}>Docs</NavItem>
            <NavItem
              icon={
                <StarIcon className="fill-warning-400 stroke-warning-400" />
              }
            >
              GitHub
            </NavItem>
          </div>
          <div className="flex flex-1 justify-end gap-2">
            <NavItem>Sign In</NavItem>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
