import * as Page from "@components/layout/page";
import * as Transition from "@components/transition";
import { api } from "@lib/api";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { LinkButton, Text, Toaster } from "@mono/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { P, match } from "ts-pattern";
import { UpdatesList } from "./components/updates-list";

export const Route = createFileRoute(
  "/_authorized/$organizationSlug/_Dashboard.layout/updates",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { organizationSlug } = Route.useParams();
  const { organization } = Route.useRouteContext();

  const postsQuery = useQuery({
    queryKey: ["posts", organization.id],
    queryFn: async ({ queryKey }) => {
      const response = await api.organization[":organizationId"].posts.$get({
        param: {
          organizationId: queryKey[1],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

  const createPost = useMutation({
    mutationFn: api.organization[":organizationId"].posts.$post,
  });

  const handleCreateNewUpdate = async () => {
    const id = Toaster.loading("Creating new draft...");

    try {
      const response = await createPost.mutateAsync({
        json: {},
        param: {
          organizationId: organization.id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create new draft");
      }

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      const post = json.data;
      navigate({
        to: "/$organizationSlug/editor/$id",
        params: { id: post.id, organizationSlug: organizationSlug },
      });

      Toaster.success("Successfully created new draft", { id });
    } catch {
      Toaster.error("Failed to create new draft", { id });
    }
  };

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organizationId={organization.id} page="Updates" />
        <LinkButton.Root
          isDisabled={createPost.isPending}
          onClick={handleCreateNewUpdate}
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
                <UpdatesList data={data || []} />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Page.Content>
    </Page.Wrapper>
  );
}
