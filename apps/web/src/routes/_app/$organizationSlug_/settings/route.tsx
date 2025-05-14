import * as Page from "@components/layout/page";
import { Text } from "@mono/ui";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, HomeIcon } from "lucide-react";
import { SettingsNavigation } from "./-components/settings-navigation";

export const Route = createFileRoute("/_app/$organizationSlug_/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Root>
      <SettingsNavigation />
      <Page.Wrapper>
        <Page.Header>
          <div className="flex items-center gap-2">
            <HomeIcon className="size-4 text-neutral-500" />
            <ChevronRight className="size-4 text-neutral-500" />
            <Text.Root size="sm" weight="medium">
              Settings
            </Text.Root>
          </div>
        </Page.Header>
        <Page.Content className="max-w-180">
          <Outlet />
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
