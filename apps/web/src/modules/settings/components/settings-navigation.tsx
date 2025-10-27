import { Sidebar } from "@components/sidebar";
import {
  ArrowLeft02Icon,
  ConnectIcon,
  Task01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { authClient } from "@lib/auth";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Button } from "@mono/ui";
import { Link } from "@tanstack/react-router";

interface SettingsNavigationProps {
  organization: {
    name: string;
    slug: string;
    id: string;
  };
  user: (typeof authClient.$Infer.Session)["user"];
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  organization,
  user,
}) => {
  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <Button.Root
          className="w-full justify-start px-2"
          render={
            <Link
              params={{ organizationSlug: organization.slug }}
              to="/$organizationSlug"
            />
          }
          variant="tertiary"
        >
          <Button.Icon
            render={<HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />}
          />
          Back
        </Button.Root>
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <Sidebar.Group>
          <Sidebar.Button
            icon={Task01Icon}
            label="Details"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:text-neutral-900"
                params={{ organizationSlug: organization.slug }}
                to="/$organizationSlug/settings/details"
              />
            }
          />
          <Sidebar.Button
            icon={UserMultipleIcon}
            label="Members"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:text-neutral-900"
                params={{ organizationSlug: organization.slug }}
                to="/$organizationSlug/settings/members"
              />
            }
          />
          <Sidebar.Button
            icon={ConnectIcon}
            label="Integrations"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:text-neutral-900"
                params={{ organizationSlug: organization.slug }}
                to="/$organizationSlug/settings/integrations"
              />
            }
          />
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer>
        <UserMenu currentOrganizationSlug={organization.slug} user={user} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
