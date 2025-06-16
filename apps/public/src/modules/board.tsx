import { api } from "@lib/api";
import { editorContentClassName, generateHtml } from "@mono/editor";
import { Button, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  CircleIcon,
  GlobeIcon,
  ScrollTextIcon,
  ServerIcon,
  TabletSmartphoneIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    if (!context.subdomain) {
      throw new Error("No subdomain found");
    }

    const posts = await api.public[":organizationSlug"].posts.$get({
      param: {
        organizationSlug: context.subdomain,
      },
    });

    const json = await posts.json();

    if (!json.success) {
      throw json.error;
    }

    return {
      posts: json.data.map((post) => ({
        ...post,
        contentHTML: generateHtml(post.contentJSON.default),
      })),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-2 border-neutral-100 border-b px-6">
        <div className="flex w-full max-w-180 items-center justify-between py-4">
          <div className="flex size-10 items-center justify-center rounded-md bg-neutral-50">
            <ScrollTextIcon className="size-4 text-neutral-900" />
          </div>
          <div className="flex items-center gap-2">
            <Button.Root variant="tertiary" className="!text-neutral-900">
              <Button.Icon className="!text-neutral-900">
                <CircleIcon />
              </Button.Icon>
              Main
            </Button.Root>
            <Button.Root variant="tertiary">
              <Button.Icon>
                <TabletSmartphoneIcon />
              </Button.Icon>
              Mobile
            </Button.Root>
            <Button.Root variant="tertiary">
              <Button.Icon>
                <GlobeIcon />
              </Button.Icon>
              Web
            </Button.Root>
            <Button.Root variant="tertiary">
              <Button.Icon>
                <ServerIcon />
              </Button.Icon>
              Self-hosted
            </Button.Root>
          </div>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100">
        {posts.map((post) => (
          <div className="mx-auto flex w-full" key={post.id}>
            <div className="relative flex flex-1 items-start justify-end p-6">
              <Text.Root className="sticky top-6" color="muted" size="sm">
                Jan 20, 2025
              </Text.Root>
            </div>
            <div className="w-full max-w-180 border-neutral-100 border-x">
              <div
                className={cn(editorContentClassName, "p-6")}
                dangerouslySetInnerHTML={{ __html: post.contentHTML }}
              />
              <div className="flex w-full items-center justify-between border-neutral-100 border-t p-6">
                <div className="flex items-center gap-4">
                  <div className="-space-x-2 flex">
                    <div className="size-10 rounded-md bg-neutral-200" />
                    <div className="size-10 rounded-md bg-neutral-300" />
                    <div className="size-10 rounded-md bg-neutral-400" />
                    <div className="size-10 rounded-md bg-neutral-500" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button.Root variant="secondary" color="success">
                    <Button.Icon>
                      <ThumbsUpIcon />
                    </Button.Icon>
                    12
                  </Button.Root>
                  <Button.Root variant="secondary" color="danger">
                    <Button.Icon>
                      <ThumbsDownIcon />
                    </Button.Icon>
                    3
                  </Button.Root>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
