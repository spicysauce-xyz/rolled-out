import { Page } from "@components/page";
import { Sidebar } from "@components/sidebar";
import { Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import {
  BuildingIcon,
  CheckCircle2,
  ExternalLinkIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authorized/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const match = useRouterState();

  const checklistItems = useMemo(() => {
    return [
      {
        icon: UserIcon,
        label: "Profile",
        href: "/onboarding/profile",
        isCompleted: match.location.pathname === "/onboarding/workspace",
      },
      {
        icon: BuildingIcon,
        label: "Workspace",
        href: "/onboarding/workspace",
      },
    ];
  }, [match.location.pathname]);

  return (
    <Page.Root>
      <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
        <Sidebar.Header>
          <div className="flex h-9 items-center px-2">
            <Text.Root weight="medium">rolledout.xyz</Text.Root>
          </div>
        </Sidebar.Header>
        <Sidebar.ScrollArea>
          <Sidebar.Group>
            {checklistItems.map((item) => (
              <div
                className="flex h-9 items-center gap-2 px-2"
                key={item.label}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="size-4 stroke-success-500" />
                ) : (
                  <item.icon className="size-4 stroke-neutral-600" />
                )}
                <Text.Root
                  className={cn(
                    "!font-[450]",
                    item.isCompleted && "line-through"
                  )}
                  color={item.isCompleted ? "muted" : "neutral"}
                >
                  {item.label}
                </Text.Root>
              </div>
            ))}
          </Sidebar.Group>
          <Sidebar.Fill />
          <Sidebar.Group>
            <Sidebar.Button
              icon={ShieldIcon}
              label="Privacy Policy"
              render={<a href="/" />}
            >
              <ExternalLinkIcon className="ml-auto" />
            </Sidebar.Button>
            <Sidebar.Button
              icon={ShieldIcon}
              label="Terms of Service"
              render={<a href="/" />}
            >
              <ExternalLinkIcon className="ml-auto" />
            </Sidebar.Button>
          </Sidebar.Group>
        </Sidebar.ScrollArea>
      </Sidebar.Root>
      <Outlet />
    </Page.Root>
  );
}
