import * as Editor from "@components/editor/editor";
import { TimeSince } from "@components/editor/time-since";
import * as Confirmer from "@components/feedback/confirmer";
import * as Page from "@components/layout/page";
import { api } from "@lib/api";
import { Button, IconButton, Text, Toaster } from "@mono/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import _ from "lodash";
import { ArrowLeftIcon, ClockIcon, SendIcon } from "lucide-react";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/editor/$id",
)({
  component: RouteComponent,
});

const getTitleFromContent = (content: JSONContent | undefined) => {
  const text = content?.content?.[0]?.content?.[0]?.text?.trim();

  return text ?? "Untitled Update";
};

function RouteComponent() {
  const queryClient = useQueryClient();
  const { id, organizationSlug } = useParams({
    from: "/_authorized/_has-organization/$organizationSlug/editor/$id",
  });
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await api.organization[":organizationId"].posts[
        ":id"
      ].$get({ param: { id, organizationId: organizationSlug } });
      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

  const content = useMemo(() => {
    return data?.content as JSONContent | undefined;
  }, [data]);

  const updatePost = useMutation({
    mutationFn: (content: JSONContent) => {
      return api.organization[":organizationId"].posts[":id"].$patch({
        param: { id, organizationId: organizationSlug },
        json: { title: getTitleFromContent(content), content },
      });
    },
    onSuccess: async (data) => {
      const json = await data.json();

      if (json.success) {
        queryClient.setQueryData(["posts", id], (old: typeof data) => {
          if (!old) return old;

          return {
            ...old,
            updatedAt: json.data.updatedAt,
          };
        });
      }
    },
  });

  const debouncedUpdatePost = useCallback(
    _.debounce(updatePost.mutateAsync, 1000),
    [],
  );

  const handleUpdate = useCallback(
    async (json: JSONContent) => {
      queryClient.setQueryData(["posts", id], (old: typeof data) => {
        if (!old) return old;

        return {
          ...old,
          title: getTitleFromContent(json),
          content: json,
        };
      });

      debouncedUpdatePost(json);
    },
    [id, queryClient, debouncedUpdatePost],
  );

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
      return api.organization[":organizationId"].posts[":id"].publish.$post({
        param: { id, organizationId: organizationSlug },
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

  if (!data) return null;

  return (
    <Page.Root>
      <Page.Wrapper>
        <Page.Header>
          <div className="flex items-center gap-4">
            <IconButton.Root variant="tertiary" onClick={handleGoBack}>
              <IconButton.Icon>
                <ArrowLeftIcon />
              </IconButton.Icon>
            </IconButton.Root>
            <div className="flex flex-col gap-0.5">
              <Text.Root size="sm" weight="medium">
                {data.title}
              </Text.Root>
              {updatePost.isPending ? (
                <Text.Root size="xs" color="muted">
                  Saving...
                </Text.Root>
              ) : (
                <TimeSince date={data?.updatedAt ?? ""}>
                  {(distance) => (
                    <Text.Root size="xs" color="muted">
                      Saved {distance}
                    </Text.Root>
                  )}
                </TimeSince>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button.Root variant="secondary">
              <Button.Icon>
                <ClockIcon />
              </Button.Icon>
              Schedule
            </Button.Root>
            <Button.Root
              isLoading={publishPostMutation.isPending}
              onClick={handlePublish}
            >
              <Button.Icon>
                <SendIcon />
              </Button.Icon>
              Publish
            </Button.Root>
          </div>
        </Page.Header>
        <Page.Content className="mx-auto flex w-full max-w-180 flex-1 flex-col">
          {content && (
            <Editor.Root content={content} onUpdate={handleUpdate}>
              <Editor.Content />
              <Editor.BubbleMenu />
            </Editor.Root>
          )}
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
