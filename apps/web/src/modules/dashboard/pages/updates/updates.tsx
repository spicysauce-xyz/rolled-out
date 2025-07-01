import { GroupBy } from "@components/group-by";
import * as Page from "@components/layout/page";
import * as Transition from "@components/transition";
import type { SuccessResponse, api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/useCreateUpdateMutation";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { LinkButton, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { PlusIcon } from "lucide-react";
import { P, match } from "ts-pattern";
import { UpdateEntry, UpdatesList } from "../../components/update-list";
import { ArchivedUpdate } from "./components/archived-update";
import { ArchivedUpdatesButton } from "./components/archived-updates-button";
import { DraftUpdate } from "./components/draft-update";
import { GroupDivider } from "./components/group-divider";
import { PublishedUpdate } from "./components/published-update";
import { ScheduledUpdate } from "./components/scheduled-update";
import { UpdatesEmpty } from "./components/updates-empty";
import { useArchivedPosts } from "./hooks/useArchivedPosts";

type Update = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["posts"]["$get"]
  >
>[number];

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_index/",
)({
  component: RouteComponent,
});

const PageSkeleton = () => {
  return (
    <UpdatesList.Root>
      <GroupDivider.Skeleton />
      {new Array(10).fill(null).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
        <div className="flex w-full" key={index}>
          <UpdateEntry.Skeleton />
        </div>
      ))}
    </UpdatesList.Root>
  );
};

interface UpdateByStatusProps {
  data: Update;
}

const UpdateByStatus: React.FC<UpdateByStatusProps> = ({ data }) => {
  const { organization } = Route.useRouteContext();

  return (
    <div className="flex w-full" key={data.id}>
      {data.status === "draft" && (
        <DraftUpdate
          {...data}
          organizationSlug={organization.slug}
          organizationId={organization.id}
        />
      )}
      {data.status === "scheduled" && <ScheduledUpdate {...data} />}
      {data.status === "published" && <PublishedUpdate {...data} />}
      {data.status === "archived" && (
        <ArchivedUpdate
          {...data}
          organizationSlug={organization.slug}
          organizationId={organization.id}
        />
      )}
    </div>
  );
};

interface ListProps {
  data: Update[];
}

const List = ({ data }: ListProps) => {
  const archivedPosts = useArchivedPosts(data);

  return (
    <UpdatesList.Root>
      <GroupBy
        data={data}
        field="status"
        divider={(status) => <GroupDivider status={status} />}
        visible={(status) => {
          if (status === "archived") {
            return archivedPosts.isOpen;
          }

          return true;
        }}
      >
        {(update) => <UpdateByStatus data={update} />}
      </GroupBy>
      {archivedPosts.buttonVisible && (
        <ArchivedUpdatesButton
          count={archivedPosts.count}
          isOpen={archivedPosts.isOpen}
          onClick={archivedPosts.toggle}
        />
      )}
    </UpdatesList.Root>
  );
};

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
          to: "/$organizationSlug/editor/$id",
          params: { id: post.id, organizationSlug: organizationSlug },
        });
      },
    });
  };

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organization={organization} page="Updates" />
        <LinkButton.Root
          isDisabled={createPostMutation.isPending}
          onClick={handleCreatePost}
        >
          <LinkButton.Icon>
            <PlusIcon />
          </LinkButton.Icon>
          New Update
        </LinkButton.Root>
      </Page.Header>
      <Page.Content className="flex-1 gap-0 p-0">
        <Transition.Root>
          {match(postsQuery)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <PageSkeleton />
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
              () => (
                <Transition.Item
                  key="empty"
                  className="flex flex-1 flex-col items-center justify-center pb-13"
                >
                  <UpdatesEmpty
                    onCreatePost={handleCreatePost}
                    isCreatingPost={createPostMutation.isPending}
                  />
                </Transition.Item>
              ),
            )
            .otherwise(({ data }) => (
              <Transition.Item key="list">
                <List data={data} />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Page.Content>
    </Page.Wrapper>
  );
}
