import { Button, IconButton, Text } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { ArrowLeftIcon, ClockIcon, SendIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Editor } from "../../components/editor/editor";
import * as Page from "../../components/layout/page";

export const Route = createFileRoute("/_app/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = useState("Untitled Update");

  const updateTitle = useCallback((json: JSONContent) => {
    const content = json.content?.[0]?.content?.[0]?.text;
    setTitle(content ?? "Untitled Update");
  }, []);

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
              <Text.Root size="xs" color="muted">
                Saved 10 minutes ago
              </Text.Root>
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
          <Editor onCreate={updateTitle} onUpdate={updateTitle} />
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
