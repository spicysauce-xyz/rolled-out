import { Page } from "@components/page";
import { Transition } from "@components/transition";
import { githubIntegrationQuery, updatesQuery } from "@lib/api/queries";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/use-create-update-mutation";
import { Button, DropdownMenu, Skeleton, Text, Toaster } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon, FileIcon, GithubIcon } from "lucide-react";
import { match, P } from "ts-pattern";
import { StartWithGithubDialog } from "./components/start-with-github-dialog";
import { Empty } from "./empty";
import { List } from "./list";
import { Skeleton as ListSkeleton } from "./skeleton";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout/updates/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { organizationSlug } = Route.useParams();
  const { organization } = Route.useRouteContext();

  const postsQuery = useQuery(updatesQuery(organization.id));

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreateUpdateMutation();

  const handleCreateBlankDraft = () => {
    const toastId = Toaster.loading("Creating draft...");

    createPost(
      { organizationId: organization.id },
      {
        onSuccess: (post) => {
          Toaster.success("Draft created", {
            description: "A new draft has been created and saved.",
            id: toastId,
          });
          navigate({
            to: "/$organizationSlug/updates/$id",
            params: { id: post.id, organizationSlug },
          });
        },
        onError: () => {
          Toaster.error("Couldn't create draft", {
            description:
              "Something went wrong while creating your draft. Please try again.",
            id: toastId,
          });
        },
      }
    );
  };

  const githubIntegration = useQuery(githubIntegrationQuery(organization.id));

  const startWithGithubDialog = useDisclosure();

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between py-2">
        <Breadcrumbs pages={["Updates"]} />

        <Transition.Root>
          {match(githubIntegration)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <Skeleton.Root className="h-9 w-24 rounded-md" />
              </Transition.Item>
            ))
            .with(
              { isSuccess: true, data: P.when((data) => !!data?.id) },
              () => (
                <Transition.Item key="dropdown">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                      render={<Button.Root variant="tertiary" />}
                    >
                      New Draft
                      <Button.Icon render={<ChevronDownIcon />} />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item onClick={handleCreateBlankDraft}>
                        <DropdownMenu.ItemIcon render={<FileIcon />} />
                        Blank
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={startWithGithubDialog.open}>
                        <DropdownMenu.ItemIcon render={<GithubIcon />} />
                        From Commits
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Transition.Item>
              )
            )
            .otherwise(() => (
              <Transition.Item key="button">
                <Button.Root
                  isDisabled={isCreatingPost}
                  onClick={handleCreateBlankDraft}
                  variant="tertiary"
                >
                  New Draft
                </Button.Root>
              </Transition.Item>
            ))}
        </Transition.Root>
        <StartWithGithubDialog
          onOpenChange={startWithGithubDialog.setOpen}
          open={startWithGithubDialog.isOpen}
          organizationId={organization.id}
          organizationSlug={organizationSlug}
        />
      </Page.Header>
      <Page.Content className="flex-1 gap-0 p-0">
        <Transition.Root>
          {match(postsQuery)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <ListSkeleton />
              </Transition.Item>
            ))
            .with({ isError: true }, ({ error }) => (
              <Transition.Item key="error">
                <Text.Root weight="medium">
                  Failed to load updates: {error.message}
                </Text.Root>
              </Transition.Item>
            ))
            .with(
              { isSuccess: true, data: P.when((posts) => posts.length === 0) },
              () => (
                <Transition.Item
                  className="flex flex-1 flex-col items-center justify-center pb-13"
                  key="empty"
                >
                  <Empty
                    isCreatingPost={isCreatingPost}
                    onCreatePost={handleCreateBlankDraft}
                  />
                </Transition.Item>
              )
            )
            .otherwise(({ data }) => (
              <Transition.Item key="list">
                <List data={data} organization={organization} />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Page.Content>
    </Page.Wrapper>
  );
}
