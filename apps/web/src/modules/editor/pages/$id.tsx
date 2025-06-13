import * as Confirmer from "@components/feedback/confirmer";
import * as Page from "@components/layout/page";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { api } from "@lib/api";
import { Editor, type JSONContent } from "@mono/editor";
import { Avatar, Button, IconButton, Text, Toaster } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  createFileRoute,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeftIcon, ClockIcon, SendIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/editor/$id",
)({
  component: import.meta.env.SSR ? Outlet : RouteComponent,
});

// const getTitleFromContent = (content: JSONContent | undefined) => {
//   const text = content?.content?.[0]?.content?.[0]?.text?.trim();

//   return text ?? "Untitled Update";
// };

const useHocuspocusProvider = (
  documentName: string,
):
  | { isReady: false; provider: null }
  | { isReady: true; provider: HocuspocusProvider } => {
  const [isReady, setIsReady] = useState(false);
  const providerRef = useRef<HocuspocusProvider | null>(null);

  useEffect(() => {
    if (providerRef.current) return;

    providerRef.current = new HocuspocusProvider({
      url: "ws://localhost:8787/hocuspocus",
      name: documentName,
      onSynced: () => setIsReady(true),
    });

    return () => {
      providerRef.current?.destroy();
    };
  }, [documentName]);

  return {
    provider: providerRef.current,
    isReady,
  };
};

const useCurrentEditors = (provider: HocuspocusProvider) => {
  const [editors, setEditors] = useState<string[]>([]);

  useEffect(() => {
    provider.on("awarenessUpdate", ({ states }) => {
      setEditors(states);
    });
  }, [provider]);

  return editors as unknown as { user?: { name: string; color: string } }[];
};

const Editors = ({ provider }: { provider: HocuspocusProvider }) => {
  const editors = useCurrentEditors(provider);

  return (
    <div className="flex items-center gap-2">
      {editors.map((editor) => (
        <div className="relative" key={editor.clientId}>
          <Avatar.Root key={editor.user?.id}>
            <Avatar.Image src={editor.user?.image} />
            <Avatar.Fallback>{editor.user?.name.slice(0, 1)}</Avatar.Fallback>
          </Avatar.Root>
          <div className="-right-1.5 -top-1.5 absolute flex size-3 items-center justify-center rounded-full bg-white p-0.75">
            <div
              className={cn(
                "h-full w-full rounded-full",
                editor?.status === "online" && "bg-success-500",
                editor?.status === "away" && "bg-warning-500",
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

function RouteComponent() {
  const { id, organizationSlug } = useParams({
    from: "/_authorized/_has-organization/$organizationSlug/editor/$id",
  });
  const router = useRouter();
  const { organization, user } = Route.useRouteContext();

  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].$get({ param: { id, organizationId: organization.id } });
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

  const { provider, isReady } = useHocuspocusProvider(id);

  useEffect(() => {
    const onVisibility = () =>
      provider?.setAwarenessField(
        "status",
        document.hidden ? "away" : "online",
      );

    onVisibility();

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [provider]);

  if (!data || !isReady) return null;

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
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Editors provider={provider} />
            <div className="flex items-center gap-2">
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
          </div>
        </Page.Header>
        <Page.Content className="mx-auto flex w-full max-w-180 flex-1 flex-col">
          {content && (
            <Editor.Root provider={provider} user={user}>
              <Editor.Content />
              <Editor.BubbleMenu />
            </Editor.Root>
          )}
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
