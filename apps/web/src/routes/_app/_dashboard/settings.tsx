import { Text } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, HomeIcon } from "lucide-react";
import * as Page from "../../../components/layout/page";

export const Route = createFileRoute("/_app/_dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
      <Page.Content className="max-w-180">Settings</Page.Content>
    </Page.Wrapper>
  );
}
