import { Confirmer } from "@components/confirmer";
import { Page } from "@components/page";
import { Transition } from "@components/transition";
import { updateQuery } from "@lib/api/queries";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { useGoBack } from "@modules/dashboard/hooks/use-go-back";
import { usePublishUpdateMutation } from "@modules/dashboard/hooks/use-publish-update-mutation";
import { Editor } from "@mono/editor";
import { Button, Skeleton, Text, Toaster } from "@mono/ui";
import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { CheckCheckIcon, CheckIcon, ClockIcon, SendIcon } from "lucide-react";
import { ConnectedPeers } from "./components/connected-peers";
import { useHocuspocusProvider } from "./hooks/use-hocuspocus-provider";
import { useUploadAssetMutation } from "./hooks/use-upload-asset-mutation";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout/updates/$id"
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
    from: "/_authorized/_has-organization/$organizationSlug/_layout/updates/$id",
  });
  const { organization, user } = Route.useRouteContext();

  const handleGoBack = useGoBack({
    to: "/$organizationSlug",
    params: { organizationSlug },
  });

  const { mutateAsync: publishPost } = usePublishUpdateMutation();

  const handlePublish = () => {
    Confirmer.confirm({
      title: "Publish update",
      description:
        "Are you sure you want to publish this update? It’ll go live right away and be visible to everyone. You can unpublish it later if needed.",
      action: {
        label: "Yes, publish",
        color: "success",
        icon: SendIcon,
        run: () =>
          publishPost(
            { organizationId: organization.id, id },
            {
              onSuccess() {
                handleGoBack();
                Toaster.success("Update published", {
                  description: "Your update is now live.",
                });
              },
              onError() {
                Toaster.error("Couldn't publish update", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  const hocuspocus = useHocuspocusProvider(id);
  const uploadAsset = useUploadAssetMutation();

  return (
    <Page.Wrapper>
      <Page.Header className="py-2">
        <div className="flex items-center gap-2">
          <Transition.Root>
            {hocuspocus.isReady ? (
              <Transition.Item className="flex items-center gap-4" key="title">
                <Breadcrumbs
                  page={["Updates", hocuspocus.title || "Untitled Update"]}
                />
                {/* <EditorTags provider={hocuspocus.provider} /> */}
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
                <CheckIcon className="size-4 animate-pulse text-neutral-500" />
              </Transition.Item>
            )}
            {hocuspocus.isReady && !hocuspocus.hasUnsyncedChanges && (
              <Transition.Item key="synced">
                <CheckCheckIcon className="size-4 text-success-500" />
              </Transition.Item>
            )}
            {!hocuspocus.isReady && (
              <Transition.Item key="sync-status-loading">
                <Skeleton.Root className="size-4 rounded-sm" />
              </Transition.Item>
            )}
          </Transition.Root>
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
              onClick={handlePublish}
            >
              <Button.Icon render={<SendIcon />} />
              Publish
            </Button.Root>
          </div>
        </div>
      </Page.Header>
      <Page.Content>
        <Transition.Root>
          {hocuspocus.isReady ? (
            <Transition.Item
              className="mx-auto flex w-full max-w-180 flex-1 flex-col"
              key="editor"
            >
              <Editor.Root
                provider={hocuspocus.provider}
                uploadImage={uploadAsset}
                user={{ ...user }}
              >
                <Editor.Content />
                <Editor.BubbleMenu />
              </Editor.Root>
            </Transition.Item>
          ) : (
            <Transition.Item
              className="mx-auto w-full max-w-180"
              key="editor-loading"
            >
              <Skeleton.Root className="mb-7 h-9.5 w-100" />
              <Skeleton.Root className="mb-5 h-6 w-full" />
              <Skeleton.Root className="mb-5 h-6 w-full" />
              <Skeleton.Root className="mb-5 h-6 w-full" />
              <Skeleton.Root className="mb-5 h-6 w-80" />
            </Transition.Item>
          )}
        </Transition.Root>
      </Page.Content>
      <div className="flex justify-center border-neutral-100 border-t px-6 py-4">
        <Text.Root color="muted">1230 words · 10 min</Text.Root>
      </div>
    </Page.Wrapper>
  );
}
