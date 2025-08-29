import { Page } from "@components/page";
import { Transition } from "@components/transition";
import { updatesQuery } from "@lib/api/queries";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/use-create-update-mutation";
import { Button, Text, Toaster } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

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

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreateUpdateMutation();

  const handleCreatePost = () => {
    createPost(organization.id, {
      onSuccess: (post) => {
        Toaster.success("Draft created", {
          description: "A new draft has been created and saved.",
        });
        navigate({
          to: "/$organizationSlug/updates/$id",
          params: { id: post.id, organizationSlug },
        });
      },
      onError: () => {
        Toaster.error("Couldn't create draft", {
          description:
            "Something went wrong while creating your draft. Please try again.",
        });
      },
    });
  };

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between py-2">
        <Breadcrumbs page="Updates" />
        <Button.Root isLoading={isCreatingPost} onClick={handleCreatePost}>
          New Draft
        </Button.Root>
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
                    isCreatingPost={isCreatingPost}
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
