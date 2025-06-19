import * as Confirmer from "@components/feedback/confirmer";
import * as Page from "@components/layout/page";
import * as Transition from "@components/transition";
import { api } from "@lib/api";
import { Editor } from "@mono/editor";
import { Button, IconButton, Skeleton, Text, Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { ArrowLeftIcon, ClockIcon, SendIcon } from "lucide-react";
import { useCallback } from "react";
import { ConnectedPeers } from "./components/ConnectedPeers";
import { EditorTags } from "./components/EditorTags";
import { useHocuspocusProvider } from "./hooks/useHocuspocusProvider";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/editor/$id",
)({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const { data: post } = await tryCatch(
      context.queryClient.ensureQueryData({
        queryKey: ["posts", params.id],
        queryFn: async ({ queryKey: [, id] }) => {
          const response = await api.organizations[":organizationId"].posts[
            ":id"
          ].$get({ param: { id, organizationId: context.organization.id } });
          const json = await response.json();

          if (!json.success) {
            throw json.error;
          }

          return json.data;
        },
      }),
    );

    if (!post) {
      throw redirect({
        to: "/$organizationSlug/updates",
        params: { organizationSlug: context.organization.slug },
      });
    }
  },
});

function RouteComponent() {
  const { id, organizationSlug } = useParams({
    from: "/_authorized/_has-organization/$organizationSlug/editor/$id",
  });
  const router = useRouter();
  const { organization, user } = Route.useRouteContext();

  const handleGoBack = useCallback(() => {
    if (router.history.canGoBack()) {
      router.history.back();
      return;
    }

    router.navigate({
      to: "/$organizationSlug/updates",
      params: { organizationSlug },
    });
  }, [router, organizationSlug]);

  const publishPostMutation = useMutation({
    mutationFn: () => {
      return api.organizations[":organizationId"].posts[":id"].publish.$post({
        param: { id, organizationId: organization.id },
      });
    },
  });

  const handlePublish = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Publish Post",
      description: "Are you sure you want to publish this post?",
      action: {
        label: "Publish",
        icon: SendIcon,
      },
    });

    if (!confirmed) return;

    const toastId = Toaster.loading("Publishing...");

    try {
      await publishPostMutation.mutateAsync();
      Toaster.success("Post published", { id: toastId });
      handleGoBack();
    } catch {
      Toaster.error("Failed to publish post", { id: toastId });
    }
  };

  const hocuspocus = useHocuspocusProvider(id);

  return (
    <Page.Root>
      <Page.Wrapper>
        <Page.Header>
          <div className="flex items-center gap-4">
            <IconButton.Root variant="secondary" onClick={handleGoBack}>
              <IconButton.Icon>
                <ArrowLeftIcon />
              </IconButton.Icon>
            </IconButton.Root>
            <div className="flex flex-col gap-0.5">
              <Transition.Root>
                {hocuspocus.isReady ? (
                  <Transition.Item
                    key="title"
                    className="flex items-center gap-4"
                  >
                    <Text.Root size="sm" weight="medium">
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
                    <Text.Root size="xs" color="muted">
                      Syncing...
                    </Text.Root>
                  </Transition.Item>
                )}
                {hocuspocus.isReady && !hocuspocus.hasUnsyncedChanges && (
                  <Transition.Item key="synced">
                    <Text.Root size="xs" color="muted">
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
              <Button.Root variant="secondary" isDisabled={!hocuspocus.isReady}>
                <Button.Icon>
                  <ClockIcon />
                </Button.Icon>
                Schedule
              </Button.Root>
              <Button.Root
                isLoading={publishPostMutation.isPending}
                isDisabled={!hocuspocus.isReady}
                onClick={handlePublish}
              >
                <Button.Icon>
                  <SendIcon />
                </Button.Icon>
                Publish
              </Button.Root>
            </div>
          </div>
        </Page.Header>
        <Page.Content className="mx-auto flex w-full max-w-180 flex-1 flex-col">
          <Transition.Root>
            {hocuspocus.isReady ? (
              <Transition.Item key="editor" className="flex flex-1">
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
