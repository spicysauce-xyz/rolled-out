import * as Page from "@components/layout/page";
import * as Transition from "@components/transition";
import { updatesQuery } from "@lib/api/queries";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/useCreateUpdateMutation";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { LinkButton, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { P, match } from "ts-pattern";
import { UpdatesList } from "./components/updates-list";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_index/updates",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { organizationSlug } = Route.useParams();
  const { organization } = Route.useRouteContext();

  const postsQuery = useQuery(updatesQuery(organization.id));

  const createPost = useCreateUpdateMutation({
    onSuccess: (post) => {
      navigate({
        to: "/$organizationSlug/editor/$id",
        params: { id: post.id, organizationSlug: organizationSlug },
      });
    },
  });

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organization={organization} page="Updates" />
        <LinkButton.Root
          isDisabled={createPost.isPending}
          onClick={() => createPost.mutateAsync(organization.id)}
        >
          <LinkButton.Icon>
            <PlusIcon />
          </LinkButton.Icon>
          New Update
        </LinkButton.Root>
      </Page.Header>
      <Page.Content className="gap-0 p-0">
        <Transition.Root>
          {match(postsQuery)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <UpdatesList.Skeleton />
              </Transition.Item>
            ))
            .with({ isError: true }, ({ error }) => (
              <Transition.Item key="error">
                <Text.Root size="sm" weight="medium">
                  Failed to load updates: {error.message}
                </Text.Root>
              </Transition.Item>
            ))
            .with(
              { isSuccess: true, data: P.when((posts) => posts.length === 0) },
              () => <Transition.Item key="empty">empty</Transition.Item>,
            )
            .otherwise(({ data }) => (
              <Transition.Item key="list">
                <UpdatesList
                  data={data || []}
                  organizationSlug={organizationSlug}
                  organizationId={organization.id}
                />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Page.Content>
    </Page.Wrapper>
  );
}
