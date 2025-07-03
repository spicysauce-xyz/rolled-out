import { GroupBy } from "@components/group-by";
import type { api, SuccessResponse } from "@lib/api";
import { UpdatesList } from "@modules/dashboard/components/update-list";
import type { InferResponseType } from "node_modules/hono/dist/types/client/types";
import {
  ArchivedUpdate,
  ArchivedUpdatesButton,
  useArchivedUpdates,
} from "./components/archived-update";
import { DraftUpdate } from "./components/draft-update";
import { GroupDivider } from "./components/group-divider";
import { PublishedUpdate } from "./components/published-update";
import { ScheduledUpdate } from "./components/scheduled-update";

type Update = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["posts"]["$get"]
  >
>[number];

interface UpdateByStatusProps {
  data: Update;
  organization: { id: string; slug: string };
}

const UpdateByStatus: React.FC<UpdateByStatusProps> = ({
  data,
  organization,
}) => {
  return (
    <div className="flex w-full" key={data.id}>
      {data.status === "draft" && (
        <DraftUpdate
          {...data}
          organizationId={organization.id}
          organizationSlug={organization.slug}
        />
      )}
      {data.status === "scheduled" && <ScheduledUpdate {...data} />}
      {data.status === "published" && <PublishedUpdate {...data} />}
      {data.status === "archived" && (
        <ArchivedUpdate
          {...data}
          organizationId={organization.id}
          organizationSlug={organization.slug}
        />
      )}
    </div>
  );
};

interface ListProps {
  data: Update[];
  organization: { id: string; slug: string };
}

export const List = ({ data, organization }: ListProps) => {
  const archivedPosts = useArchivedUpdates(data);

  return (
    <UpdatesList.Root>
      <GroupBy
        data={data}
        divider={(status) => <GroupDivider status={status} />}
        field="status"
        visible={(status) => {
          if (status === "archived") {
            return archivedPosts.isOpen;
          }

          return true;
        }}
      >
        {(update) => (
          <UpdateByStatus data={update} organization={organization} />
        )}
      </GroupBy>
      {archivedPosts.buttonVisible && (
        <ArchivedUpdatesButton
          count={archivedPosts.count}
          isOpen={archivedPosts.isOpen}
          onClick={archivedPosts.toggle}
        />
      )}
    </UpdatesList.Root>
  );
};
