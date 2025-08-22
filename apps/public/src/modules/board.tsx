import { api } from "@lib/api";
import { editorContentClassName, generateHtml } from "@mono/editor";
import { Avatar, Button, Tag, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import hljs from "highlight.js";
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
      posts: json.data.map((post) => {
        const htmlContent = generateHtml(post.contentJSON.default);

        const codeBlockRegex =
          /<pre><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/g;

        const processedHtmlContent = htmlContent.replace(
          codeBlockRegex,
          (match, language, code) => {
            const decodedCode = code
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");

            try {
              const highlighted = hljs.highlight(decodedCode, { language });
              return `<pre><code class="language-${language}">${highlighted.value}</code></pre>`;
            } catch {
              return match;
            }
          }
        );

        return {
          ...post,
          contentHTML: processedHtmlContent,
        };
      }),
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
            <Button.Root variant="tertiary">
              <Button.Icon render={() => <CircleIcon />} />
              Main
            </Button.Root>
            <Button.Root variant="tertiary">
              <Button.Icon render={() => <TabletSmartphoneIcon />} />
              Mobile
            </Button.Root>
            <Button.Root variant="tertiary">
              <Button.Icon render={() => <GlobeIcon />} />
              Web
            </Button.Root>
            <Button.Root variant="tertiary">
              <Button.Icon render={() => <ServerIcon />} />
              Self-hosted
            </Button.Root>
          </div>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100">
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
                  <Text.Root color="muted" size="sm">
                    Published by:
                  </Text.Root>
                  <div className="flex items-center gap-2">
                    {post.editors.map((editor) => (
                      <Text.Root key={editor.id} weight="medium">
                        {editor.user.name}
                      </Text.Root>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button.Root variant="tertiary">
                    <Button.Icon render={() => <ThumbsUpIcon />} />
                    12
                  </Button.Root>
                  <Button.Root variant="tertiary">
                    <Button.Icon render={() => <ThumbsDownIcon />} />3
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
