import { GroupBy } from "@components/group-by";
import type { api, SuccessResponse } from "@lib/api";
import { UpdatesList } from "@modules/dashboard/components/update-list";
import type { InferResponseType } from "node_modules/hono/dist/types/client/types";
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
      {data.status === "scheduled" && (
        <ScheduledUpdate
          {...data}
          organizationId={organization.id}
          organizationSlug={organization.slug}
        />
      )}
      {data.status === "published" && (
        <PublishedUpdate
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
  return (
    <UpdatesList.Root>
      <GroupBy
        data={data}
        divider={(status) => <GroupDivider status={status} />}
        field="status"
      >
        {(update) => (
          <UpdateByStatus data={update} organization={organization} />
        )}
      </GroupBy>
    </UpdatesList.Root>
  );
};
