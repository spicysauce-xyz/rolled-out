import { Page } from "@components/page";
import { Transition } from "@components/transition";
import { boardPostsQuery, boardQuery } from "@lib/api/queries";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { EditBoardDialog } from "@modules/dashboard/pages/board/components/edit-board-dialog";
import { Button, LinkButton, Tag, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { BookOpenIcon, SettingsIcon } from "lucide-react";
// @ts-expect-error https://github.com/lucide-icons/lucide/issues/2867
import { DynamicIcon, type IconName } from "lucide-react/dynamic.mjs";
import { match, P } from "ts-pattern";
import { UpdateEntry, UpdatesList } from "../../components/update-list";
import { BoardUpdate } from "./components/board-update";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout/boards/$id"
)({
  beforeLoad: async ({ params, context }) => {
    const board = await tryCatch(
      context.queryClient.ensureQueryData(
        boardQuery(context.organization.id, params.id)
      )
    );

    if (board.error || !board.data) {
      throw redirect({
        to: "/$organizationSlug",
        params: {
          organizationSlug: context.organization.slug,
        },
      });
    }

    return { board: board.data };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organization, board } = Route.useRouteContext();
  const { id } = Route.useParams();

  const updates = useQuery(boardPostsQuery(organization.id, id));

  const editBoardDialog = useDisclosure();

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organization={organization} page={board.name} />
        <LinkButton.Root onClick={editBoardDialog.open}>
          <LinkButton.Icon>
            <SettingsIcon />
          </LinkButton.Icon>
          Settings
        </LinkButton.Root>
        <EditBoardDialog
          board={board}
          isOpen={editBoardDialog.isOpen}
          onOpenChange={editBoardDialog.setOpen}
        />
      </Page.Header>
      <Page.Content className="flex-1 gap-0 p-0">
        <Transition.Root>
          {match(updates)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <UpdatesList.Root>
                  {new Array(10).fill(null).map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
                    <div className="flex w-full" key={index}>
                      <UpdateEntry.Skeleton />
                    </div>
                  ))}
                </UpdatesList.Root>
              </Transition.Item>
            ))
            .with({ isError: true }, () => (
              // TODO: Error state
              <Transition.Item key="error">failed</Transition.Item>
            ))
            .with(
              { isSuccess: true, data: P.when((posts) => posts.length === 0) },
              () => (
                // TODO: Empty state
                <Transition.Item
                  className="flex flex-1 flex-col items-center justify-center pb-13"
                  key="empty"
                >
                  <div className="flex flex-col items-center gap-6">
                    <DynamicIcon
                      className="size-10 fill-neutral-50 stroke-neutral-500"
                      name={board.symbol as IconName}
                    />
                    <div className="flex flex-col items-center gap-1">
                      <Text.Root weight="medium">{board.name}</Text.Root>
                      <Text.Root
                        className="max-w-96 text-balance text-center"
                        color="muted"
                        size="sm"
                      >
                        No updates here yet. Only published updates with one of
                        the following tags will appear on this board:
                      </Text.Root>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {board.tags.map(({ tag }) => (
                        <Tag.Root
                          className="h-7.5 rounded-sm px-2"
                          key={tag.id}
                        >
                          {tag.label}
                        </Tag.Root>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button.Root size="sm" variant="secondary">
                        <Button.Icon>
                          <BookOpenIcon />
                        </Button.Icon>
                        Learn more
                      </Button.Root>
                      <Button.Root
                        onClick={editBoardDialog.open}
                        size="sm"
                        variant="secondary"
                      >
                        <Button.Icon>
                          <SettingsIcon />
                        </Button.Icon>
                        Update Settings
                      </Button.Root>
                    </div>
                  </div>
                </Transition.Item>
              )
            )
            .otherwise(() => (
              <Transition.Item key="list">
                <UpdatesList.Root>
                  {updates.data?.map((update) => (
                    <div className="mx-auto flex w-full" key={update.id}>
                      <BoardUpdate {...update} />
                    </div>
                  ))}
                </UpdatesList.Root>
              </Transition.Item>
            ))}
        </Transition.Root>
      </Page.Content>
    </Page.Wrapper>
  );
}

// TODO: Edit board settings: name, symbol, slug, tags
