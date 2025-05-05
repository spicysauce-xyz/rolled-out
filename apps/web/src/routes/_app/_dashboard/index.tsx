import { LinkButton, Text, Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, HomeIcon, PlusIcon } from "lucide-react";
import * as Page from "../../../components/layout/page";
import { api } from "../../../lib/api";

export const Route = createFileRoute("/_app/_dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const createPost = useMutation({
    mutationFn: api.posts.$post,
  });

  const handleCreateNewUpdate = async () => {
    const id = Toaster.loading("Creating new draft...");

    try {
      const response = await createPost.mutateAsync({
        json: {},
      });

      if (!response.ok) {
        throw new Error("Failed to create new draft");
      }

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      const post = json.data;
      navigate({ to: "/editor/$id", params: { id: post.id } });

      Toaster.success("Successfully created new draft", { id });
    } catch {
      Toaster.error("Failed to create new draft", { id });
    }
  };

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <div className="flex items-center gap-2">
          <HomeIcon className="size-4 text-neutral-500" />
          <ChevronRight className="size-4 text-neutral-500" />
          <Text.Root size="sm" weight="medium">
            Updates
          </Text.Root>
        </div>
        <LinkButton.Root
          isDisabled={createPost.isPending}
          onClick={handleCreateNewUpdate}
        >
          <LinkButton.Icon>
            <PlusIcon />
          </LinkButton.Icon>
          New Update
        </LinkButton.Root>
      </Page.Header>
      <Page.Content>Updates</Page.Content>
    </Page.Wrapper>
  );
}
