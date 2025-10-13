import { api } from "@lib/api";
import { editorContentClassName, generateHtml } from "@mono/editor";
import { Avatar, Button, Tag, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import hljs from "highlight.js";
import { GlobeIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    if (!context.subdomain) {
      throw new Error("No subdomain found");
    }

    const [organizationResponse, postsResponse] = await Promise.all([
      api.public[":organizationSlug"].$get({
        param: {
          organizationSlug: context.subdomain,
        },
      }),
      api.public[":organizationSlug"].posts.$get({
        param: {
          organizationSlug: context.subdomain,
        },
      }),
    ]);

    const [organizationJson, postsJson] = await Promise.all([
      organizationResponse.json(),
      postsResponse.json(),
    ]);

    if (!organizationJson.success) {
      throw organizationJson.error;
    }

    if (!postsJson.success) {
      throw postsJson.error;
    }

    return {
      organization: organizationJson.data,
      posts: postsJson.data.map((post) => {
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
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.organization?.name
          ? `${loaderData.organization.name}'s Changelog | rolledout.xyz`
          : "Changelog | rolledout.xyz",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { organization, posts } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex justify-center border-neutral-100 border-b bg-white">
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 md:max-w-192 lg:max-w-204">
          <div className="flex items-center gap-4">
            <Avatar.Root size="lg">
              <Avatar.Image
                alt={organization.name}
                src={organization.logo || undefined}
              />
              <Avatar.Fallback>
                {organization.name.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <Text.Root size="lg" weight="medium">
              {organization.name}'s Changelog
            </Text.Root>
          </div>
          {organization.websiteUrl && (
            <Button.Root
              render={<a href={organization.websiteUrl} />}
              variant="secondary"
            >
              <Button.Icon render={<GlobeIcon />} />
              Website
            </Button.Root>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100">
        {posts.map((post) => (
          <div className="mx-auto flex w-full justify-center" key={post.id}>
            <div className="relative hidden flex-1 items-start justify-end gap-4 p-6 lg:flex">
              <div className="sticky top-24 flex flex-col items-end gap-4">
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
            <div className="w-full border-neutral-100 md:max-w-192 lg:border-x">
              <div className="flex p-6 pb-0 lg:hidden">
                {post.publishedAt && (
                  <Text.Root color="muted" size="sm">
                    {format(post.publishedAt, "MMM d, h:mm a")}
                  </Text.Root>
                )}
              </div>
              <div
                className={cn(editorContentClassName, "p-6")}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: ok this is bad, will think about it
                dangerouslySetInnerHTML={{ __html: post.contentHTML }}
              />
              <div className="flex w-full items-center justify-between border-neutral-100 px-6 pb-6 lg:border-t lg:pt-6">
                <div className="flex flex-col gap-0.5">
                  <Text.Root color="muted" size="sm">
                    Author(s):
                  </Text.Root>
                  <div className="flex items-center gap-2">
                    {post.editors.map((editor) => (
                      <Text.Root key={editor.id} weight="medium">
                        {editor.member.user.name}
                      </Text.Root>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden flex-1 p-6 lg:flex" />
          </div>
        ))}
      </div>
    </div>
  );
}
