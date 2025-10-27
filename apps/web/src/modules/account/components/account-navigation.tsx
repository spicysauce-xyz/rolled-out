import { Sidebar } from "@components/sidebar";
import {
  ArrowLeft02Icon,
  Building05Icon,
  UserGroupIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { authClient } from "@lib/auth";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Button } from "@mono/ui";
import { Link, useSearch } from "@tanstack/react-router";

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
          <Button.Icon
            render={<HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />}
          />
          Back
        </Button.Root>
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <Sidebar.Group>
          <Sidebar.Button
            icon={UserSquareIcon}
            label="Profile"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:text-neutral-900"
                search={{ organization }}
                to="/account/profile"
              />
            }
          />
          <Sidebar.Button
            icon={UserGroupIcon}
            label="Sessions"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:text-neutral-900"
                search={{ organization }}
                to="/account/sessions"
              />
            }
          />
          <Sidebar.Button
            icon={Building05Icon}
            label="Organizations"
            render={
              <Link
                className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:text-neutral-900"
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
