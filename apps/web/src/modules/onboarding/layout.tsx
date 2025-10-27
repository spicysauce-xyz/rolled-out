import { Page } from "@components/page";
import { Sidebar } from "@components/sidebar";
import {
  Building02Icon,
  CheckmarkCircle02Icon,
  LinkForwardIcon,
  Shield01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authorized/onboarding")({
  component: RouteComponent,
  head: (ctx) => ({
    meta: [
      {
        title: `Welcome | ${ctx.match.context.user.name} x rolledout.xyz`,
      },
    ],
  }),
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
        icon: Building02Icon,
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
                  <HugeiconsIcon
                    className="size-4 text-success-500"
                    icon={CheckmarkCircle02Icon}
                    strokeWidth={2}
                  />
                ) : (
                  <HugeiconsIcon
                    className="size-4 text-neutral-600"
                    icon={item.icon}
                    strokeWidth={2}
                  />
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
              icon={Shield01Icon}
              label="Privacy Policy"
              render={<a href="/" />}
            >
              <HugeiconsIcon
                className="ml-auto"
                icon={LinkForwardIcon}
                strokeWidth={2}
              />
            </Sidebar.Button>
            <Sidebar.Button
              icon={Shield01Icon}
              label="Terms of Service"
              render={<a href="/" />}
            >
              <HugeiconsIcon
                className="ml-auto"
                icon={LinkForwardIcon}
                strokeWidth={2}
              />
            </Sidebar.Button>
          </Sidebar.Group>
        </Sidebar.ScrollArea>
      </Sidebar.Root>
      <Outlet />
    </Page.Root>
  );
}
