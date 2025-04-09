import { Text } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, HomeIcon } from "lucide-react";
import { Navigation } from "../../components/layout/navigation";
import * as Page from "../../components/layout/page";
export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Root className="grid-cols-3">
      <Navigation />
      <Page.Wrapper>
        <Page.Header className="flex-col items-start md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <HomeIcon className="size-4 text-neutral-500" />
            <ChevronRight className="size-4 text-neutral-500" />
            <Text.Root size="sm" weight="medium">
              Dashboard
            </Text.Root>
          </div>
        </Page.Header>
        <Page.Content>Dashboard</Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
