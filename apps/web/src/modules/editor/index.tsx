import { Confirmer } from "@components/confirmer";
import { Page } from "@components/page";
import { Transition } from "@components/transition";
import { updateQuery } from "@lib/api/queries";
import { useGoBack } from "@modules/dashboard/hooks/use-go-back";
import { usePublishUpdateMutation } from "@modules/dashboard/hooks/use-publish-update-mutation";
import { Editor } from "@mono/editor";
import { Button, IconButton, Skeleton, Text } from "@mono/ui";
import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { ArrowLeftIcon, ClockIcon, SendIcon } from "lucide-react";
import { ConnectedPeers } from "./components/connected-peers";
import { EditorTags } from "./components/editor-tags";
import { useHocuspocusProvider } from "./hooks/use-hocuspocus-provider";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/editor/$id"
)({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const { data: post } = await tryCatch(
      context.queryClient.ensureQueryData(
        updateQuery(context.organization.id, params.id)
      )
    );

    if (!post) {
      throw redirect({
        to: "/$organizationSlug",
        params: { organizationSlug: context.organization.slug },
      });
    }
  },
});

function RouteComponent() {
  const { id, organizationSlug } = useParams({
    from: "/_authorized/_has-organization/$organizationSlug/editor/$id",
  });
  const { organization, user } = Route.useRouteContext();

  const handleGoBack = useGoBack({
    to: "/$organizationSlug",
    params: { organizationSlug },
  });

  const publishPostMutation = usePublishUpdateMutation();

  const handlePublish = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Publish Post",
      description: "Are you sure you want to publish this post?",
      action: {
        label: "Publish",
        icon: SendIcon,
      },
    });

    if (!confirmed) {
      return;
    }

    await publishPostMutation.mutateAsync(
      {
        organizationId: organization.id,
        id,
      },
      {
        onSuccess: handleGoBack,
      }
    );
  };

  const hocuspocus = useHocuspocusProvider(id);

  return (
    <Page.Root>
      <Page.Wrapper>
        <Page.Header className="py-2">
          <div className="flex items-center gap-4">
            <IconButton.Root
              render={
                <Link params={{ organizationSlug }} to="/$organizationSlug" />
              }
              variant="secondary"
            >
              <IconButton.Icon render={<ArrowLeftIcon />} />
            </IconButton.Root>
            <div className="flex flex-col gap-0.5">
              <Transition.Root>
                {hocuspocus.isReady ? (
                  <Transition.Item
                    className="flex items-center gap-4"
                    key="title"
                  >
                    <Text.Root weight="medium">
                      {hocuspocus.title || "Untitled Update"}
                    </Text.Root>
                    <EditorTags provider={hocuspocus.provider} />
                  </Transition.Item>
                ) : (
                  <Transition.Item key="title-loading">
                    <Skeleton.Root className="my-[3px] h-3.5 w-40 rounded-sm" />
                  </Transition.Item>
                )}
              </Transition.Root>
              <Transition.Root>
                {hocuspocus.isReady && hocuspocus.hasUnsyncedChanges && (
                  <Transition.Item key="sync-status">
                    <Text.Root color="muted" size="sm">
                      Syncing...
                    </Text.Root>
                  </Transition.Item>
                )}
                {hocuspocus.isReady && !hocuspocus.hasUnsyncedChanges && (
                  <Transition.Item key="synced">
                    <Text.Root color="muted" size="sm">
                      Synced
                    </Text.Root>
                  </Transition.Item>
                )}
                {!hocuspocus.isReady && (
                  <Transition.Item key="sync-status-loading">
                    <Skeleton.Root className="my-[3px] h-3 w-12 rounded-sm" />
                  </Transition.Item>
                )}
              </Transition.Root>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Transition.Root>
              {hocuspocus.isReady && (
                <Transition.Item key="connected-peers">
                  <ConnectedPeers connectedPeers={hocuspocus.connectedUsers} />
                </Transition.Item>
              )}
            </Transition.Root>
            <div className="flex items-center gap-2">
              <Button.Root isDisabled={!hocuspocus.isReady} variant="secondary">
                <Button.Icon render={<ClockIcon />} />
                Schedule
              </Button.Root>
              <Button.Root
                isDisabled={!hocuspocus.isReady}
                isLoading={publishPostMutation.isPending}
                onClick={handlePublish}
              >
                <Button.Icon render={<SendIcon />} />
                Publish
              </Button.Root>
            </div>
          </div>
        </Page.Header>
        <Page.Content className="mx-auto flex w-full max-w-180 flex-1 flex-col">
          <Transition.Root>
            {hocuspocus.isReady ? (
              <Transition.Item className="flex flex-1" key="editor">
                <Editor.Root provider={hocuspocus.provider} user={{ ...user }}>
                  <Editor.Content />
                  <Editor.BubbleMenu />
                </Editor.Root>
              </Transition.Item>
            ) : (
              <Transition.Item key="editor-loading">
                <Skeleton.Root className="mb-7 h-9.5 w-100" />
                <Skeleton.Root className="mb-5 h-6 w-full" />
                <Skeleton.Root className="mb-5 h-6 w-full" />
                <Skeleton.Root className="mb-5 h-6 w-full" />
                <Skeleton.Root className="mb-5 h-6 w-80" />
              </Transition.Item>
            )}
          </Transition.Root>
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
