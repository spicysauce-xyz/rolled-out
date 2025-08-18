import { Sidebar } from "@components/sidebar";
import type { authClient } from "@lib/auth";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Button } from "@mono/ui";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  Building2Icon,
  NotebookTextIcon,
  Users2,
} from "lucide-react";

interface AccountNavigationProps {
  user: (typeof authClient.$Infer.Session)["user"];
}

export const AccountNavigation: React.FC<AccountNavigationProps> = ({
  user,
}) => {
  const { organization } = useSearch({ from: "/_authorized/account" });

  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <Button.Root
          className="w-full justify-start px-2"
          render={
            <Link
              params={{ organizationSlug: organization ?? "" }}
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
            label="Profile"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
                search={{ organization }}
                to="/account/profile"
              />
            }
          />
          <Sidebar.Button
            icon={Users2}
            label="Sessions"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
                search={{ organization }}
                to="/account/sessions"
              />
            }
          />
          <Sidebar.Button
            icon={Building2Icon}
            label="Organizations"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
                search={{ organization }}
                to="/account/organizations"
              />
            }
          />
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer>
        <UserMenu currentOrganizationSlug={organization} user={user} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
