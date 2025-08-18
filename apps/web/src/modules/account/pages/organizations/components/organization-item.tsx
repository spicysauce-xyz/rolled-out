import { Confirmer } from "@components/confirmer";
import type { api, SuccessResponse } from "@lib/api";
import { Avatar, Button, Text } from "@mono/ui";
import type { InferResponseType } from "hono";
import { DoorClosedIcon } from "lucide-react";
import { useCallback } from "react";
import { useLeaveOrganizationMutation } from "../hooks/use-leave-organization";

type Organization = SuccessResponse<
  InferResponseType<(typeof api.organizations)["$get"]>
>[number];

interface OrganizationItemProps {
  data: Organization;
  isActive: boolean;
}

export const OrganizationItem: React.FC<OrganizationItemProps> = ({
  data,
  isActive,
}) => {
  const leaveOrganizationMutation = useLeaveOrganizationMutation();

  const handleLeave = useCallback(async () => {
    const confirmed = await Confirmer.confirm({
      title: "Leave Organization",
      description: `Are you sure you want to leave ${data.name}?`,
      phrase: data.slug,
      action: {
        icon: DoorClosedIcon,
        label: "Leave",
        color: "danger",
      },
    });

    if (!confirmed) {
      return;
    }

    await leaveOrganizationMutation.mutateAsync({
      id: data.id,
    });
  }, [data, leaveOrganizationMutation]);

  return (
    <div className="group flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar.Root className="size-10 rounded-md">
            <Avatar.Image src={data?.logo || ""} />
            <Avatar.Fallback>{data?.name[0]}</Avatar.Fallback>
          </Avatar.Root>
          {isActive && (
            <div className="-right-1.5 -top-1.5 absolute flex items-center justify-center rounded-full bg-accent-500 px-0.75 text-[8px] text-white">
              Active
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <Text.Root weight="medium">{data?.name}</Text.Root>
          <Text.Root className="capitalize" color="muted" size="sm">
            {data.role}
          </Text.Root>
        </div>
      </div>
      <Button.Root
        className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
        onClick={handleLeave}
        variant="tertiary"
      >
        <Button.Icon render={<DoorClosedIcon />} />
        Leave
      </Button.Root>
    </div>
  );
};
