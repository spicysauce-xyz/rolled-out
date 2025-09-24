import { Sidebar } from "@components/sidebar";
import type { authClient } from "@lib/auth";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Button } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  BlocksIcon,
  NotebookTextIcon,
  Users2,
} from "lucide-react";

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
          <Button.Icon render={<ArrowLeftIcon />} />
          Back
        </Button.Root>
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <Sidebar.Group>
          <Sidebar.Button
            icon={NotebookTextIcon}
            label="Details"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
                params={{ organizationSlug: organization.slug }}
                to="/$organizationSlug/settings/details"
              />
            }
          />
          <Sidebar.Button
            icon={Users2}
            label="Members"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
                params={{ organizationSlug: organization.slug }}
                to="/$organizationSlug/settings/members"
              />
            }
          />
          <Sidebar.Button
            icon={BlocksIcon}
            label="Integrations"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
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
