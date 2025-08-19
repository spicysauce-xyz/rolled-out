import { Page } from "@components/page";
import { Transition } from "@components/transition";
import { updatesQuery } from "@lib/api/queries";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/use-create-update-mutation";
import { Button, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListFilterIcon } from "lucide-react";
import { match, P } from "ts-pattern";
import { Empty } from "./empty";
import { List } from "./list";
import { Skeleton } from "./skeleton";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout/updates/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { organizationSlug } = Route.useParams();
  const { organization } = Route.useRouteContext();

  const postsQuery = useQuery(updatesQuery(organization.id));

  const createPostMutation = useCreateUpdateMutation();

  const handleCreatePost = () => {
    createPostMutation.mutate(organization.id, {
      onSuccess: (post) => {
        navigate({
          to: "/$organizationSlug/updates/$id",
          params: { id: post.id, organizationSlug },
        });
      },
    });
  };

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between py-2">
        <Breadcrumbs page="Updates" />
        <div className="flex items-center gap-2">
          <Button.Root
            isLoading={createPostMutation.isPending}
            onClick={handleCreatePost}
            variant="secondary"
          >
            <Button.Icon render={<ListFilterIcon />} />
            Filters
          </Button.Root>
          <Button.Root
            isLoading={createPostMutation.isPending}
            onClick={handleCreatePost}
          >
            New Draft
          </Button.Root>
        </div>
      </Page.Header>
      <Page.Content className="flex-1 gap-0 p-0">
        <Transition.Root>
          {match(postsQuery)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <Skeleton />
              </Transition.Item>
            ))
            .with({ isError: true }, ({ error }) => (
              <Transition.Item key="error">
                <Text.Root weight="medium">
                  Failed to load updates: {error.message}
                </Text.Root>
              </Transition.Item>
            ))
            .with(
              { isSuccess: true, data: P.when((posts) => posts.length === 0) },
              () => (
                <Transition.Item
                  className="flex flex-1 flex-col items-center justify-center pb-13"
                  key="empty"
                >
                  <Empty
                    isCreatingPost={createPostMutation.isPending}
                    onCreatePost={handleCreatePost}
                  />
                </Transition.Item>
              )
            )
            .otherwise(({ data }) => (
              <Transition.Item key="list">
                <List data={data} organization={organization} />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Page.Content>
    </Page.Wrapper>
  );
}
