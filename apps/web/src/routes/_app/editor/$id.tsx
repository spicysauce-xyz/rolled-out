import * as Editor from "@components/editor/editor";
import { TimeSince } from "@components/editor/time-since";
import { api } from "@lib/api";
import { Button, IconButton, Text } from "@mono/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { debounce } from "lodash";
import { ArrowLeftIcon, ClockIcon, SendIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import * as Page from "../../../components/layout/page";

export const Route = createFileRoute("/_app/editor/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { id } = useParams({ from: "/_app/editor/$id" });

  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await api.posts[":id"].$get({ param: { id } });
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

  const title = useMemo(() => {
    const text = content?.content?.[0]?.content?.[0]?.text;

    return text ?? "Untitled Update";
  }, [content]);

  const updatePost = useMutation({
    mutationFn: (content: JSONContent) =>
      api.posts[":id"].$put({ param: { id }, json: { title: "", content } }),
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
    debounce(updatePost.mutateAsync, 1000),
    [],
  );

  const handleUpdate = useCallback(
    async (json: JSONContent) => {
      queryClient.setQueryData(["posts", id], (old: typeof data) => {
        if (!old) return old;

        return {
          ...old,
          content: json,
        };
      });

      debouncedUpdatePost(json);
    },
    [id, queryClient, debouncedUpdatePost],
  );

  if (!data) return null;

  return (
    <Page.Root>
      <Page.Wrapper>
        <Page.Header>
          <div className="flex items-center gap-4">
            <IconButton.Root variant="tertiary">
              <IconButton.Icon>
                <ArrowLeftIcon />
              </IconButton.Icon>
            </IconButton.Root>
            <div className="flex flex-col gap-0.5">
              <Text.Root size="sm" weight="medium">
                {title}
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
            <Button.Root>
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
            </Editor.Root>
          )}
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
