import { Sidebar } from "@components/sidebar";
import type { authClient } from "@lib/auth";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Clickable, Text } from "@mono/ui";
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
        <Clickable.Root
          asChild
          className="w-full items-center gap-2 border-0 p-2 hover:bg-neutral-100 focus-visible:bg-neutral-100"
          variant="tertiary"
        >
          <Link
            params={{ organizationSlug: organization ?? "" }}
            to="/$organizationSlug"
          >
            <Clickable.Icon>
              <ArrowLeftIcon />
            </Clickable.Icon>
            <Text.Root size="sm" weight="medium">
              Back
            </Text.Root>
          </Link>
        </Clickable.Root>
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <Sidebar.Group>
          <Sidebar.NavLink
            icon={NotebookTextIcon}
            label="Profile"
            search={{ organization }}
            to="/account/profile"
          />
          <Sidebar.NavLink
            icon={Users2}
            label="Sessions"
            search={{ organization }}
            to="/account/sessions"
          />
          <Sidebar.NavLink
            icon={Building2Icon}
            label="Organizations"
            search={{ organization }}
            to="/account/organizations"
          />
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer>
        <UserMenu currentOrganizationSlug={organization} user={user} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
