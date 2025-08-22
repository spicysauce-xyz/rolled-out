import { api } from "@lib/api";
import { editorContentClassName, generateHtml } from "@mono/editor";
import { Avatar, Button, Tag, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import hljs from "highlight.js";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
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
  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Highlight all code blocks after the component mounts
    if (postsContainerRef.current) {
      const codeBlocks = postsContainerRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        // Only highlight if not already highlighted
        if (!block.classList.contains('hljs')) {
          hljs.highlightElement(block as HTMLElement);
        }
      });
    }
  }, [posts]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-2 border-neutral-100 border-b px-6">
        <div className="flex w-full max-w-180 items-center justify-between py-4">
          <div className="flex size-10 items-center justify-center rounded-md bg-neutral-50">
            <ScrollTextIcon className="size-4 text-neutral-900" />
          </div>
          <div className="flex items-center gap-2">
            <Button.Root className="!text-neutral-900" variant="tertiary">
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

      <div className="flex flex-col divide-y divide-neutral-100" ref={postsContainerRef}>
        {posts.map((post) => (
          <div className="mx-auto flex w-full" key={post.id}>
            <div className="relative flex flex-1 items-start justify-end gap-4 p-6">
              <div className="sticky top-6 flex flex-col items-end gap-4">
                {post.publishedAt && (
                  <Text.Root color="muted" size="sm">
                    {format(post.publishedAt, "MMM d, h:mm a")}
                  </Text.Root>
                )}
                <div className="flex flex-wrap justify-end gap-2">
                  {post.tags.map(({ tag }) => (
                    <Tag.Root className="h-7.5 rounded-sm px-2" key={tag.id}>
                      {tag.label}
                    </Tag.Root>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full max-w-180 border-neutral-100 border-x">
              <div
                className={cn(editorContentClassName, "p-6")}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: ok this is bad, will think about it
                dangerouslySetInnerHTML={{ __html: post.contentHTML }}
              />
              <div className="flex w-full items-center justify-between border-neutral-100 border-t p-6">
                <div className="flex flex-col gap-0.5">
                  <Text.Root color="muted" size="xs">
                    Published by:
                  </Text.Root>
                  <div className="flex items-center gap-2">
                    {post.editors.map((editor) => (
                      <div className="flex items-center gap-1" key={editor.id}>
                        <Avatar.Root className="size-4 rounded-sm">
                          <Avatar.Image src={editor.user.image || ""} />
                          <Avatar.Fallback>
                            {editor.user.name[0]}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <Text.Root size="sm" weight="medium">
                          {editor.user.name}
                        </Text.Root>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button.Root color="success" variant="secondary">
                    <Button.Icon>
                      <ThumbsUpIcon />
                    </Button.Icon>
                    12
                  </Button.Root>
                  <Button.Root color="danger" variant="secondary">
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
