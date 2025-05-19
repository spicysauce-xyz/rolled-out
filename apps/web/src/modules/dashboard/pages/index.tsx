import * as Page from "@components/layout/page";
import { Text } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, HomeIcon } from "lucide-react";

export const Route = createFileRoute("/_authorized/$organizationSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <div className="flex items-center gap-2">
          <HomeIcon className="size-4 text-neutral-500" />
          <ChevronRight className="size-4 text-neutral-500" />
          <Text.Root size="sm" weight="medium">
            Analytics
          </Text.Root>
        </div>
      </Page.Header>
      <Page.Content>Analytics</Page.Content>
    </Page.Wrapper>
  );
}
