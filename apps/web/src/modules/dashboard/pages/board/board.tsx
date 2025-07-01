import * as Page from "@components/layout/page";
import * as Transition from "@components/transition";
import { boardPostsQuery, boardQuery } from "@lib/api/queries";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { EditBoardDialog } from "@modules/shared/components/edit-board-dialog";
import { LinkButton } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { SettingsIcon } from "lucide-react";
import { P, match } from "ts-pattern";
import { UpdateEntry, UpdatesList } from "../../components/update-list";
import { BoardUpdate } from "./components/board-update";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_index/boards/$id",
)({
  beforeLoad: async ({ params, context }) => {
    const board = await tryCatch(
      context.queryClient.ensureQueryData(
        boardQuery(context.organization.id, params.id),
      ),
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
          isOpen={editBoardDialog.isOpen}
          onOpenChange={editBoardDialog.setOpen}
          board={board}
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
                  key="empty"
                  className="flex flex-1 flex-col items-center justify-center pb-13"
                >
                  no data
                </Transition.Item>
              ),
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
