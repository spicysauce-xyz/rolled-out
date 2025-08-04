import { Confirmer } from "@components/confirmer";
import type { api, SuccessResponse } from "@lib/api";
import { organizationsQuery } from "@lib/api/queries";
import { Avatar, Button, Text } from "@mono/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { DoorClosedIcon } from "lucide-react";
import { useCallback } from "react";
import { useLeaveOrganizationMutation } from "../hooks/use-leave-organization";

type Organization = SuccessResponse<
  InferResponseType<(typeof api.organizations)["$get"]>
>[number];

interface OrganizationItemProps {
  data: Organization;
}

export const OrganizationItem: React.FC<OrganizationItemProps> = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { organizationSlug } = useParams({
    from: "/_authorized/_has-organization/$organizationSlug/settings/organizations",
  });

  const leaveOrganizationMutation = useLeaveOrganizationMutation({
    onSuccess: () => {
      if (organizationSlug === data.slug) {
        const otherOrganizations = queryClient.getQueryData(
          organizationsQuery().queryKey
        );

        if (otherOrganizations && otherOrganizations.length > 0) {
          router.navigate({
            to: ".",
            params: {
              organizationSlug: otherOrganizations[0].slug,
            },
          });
        } else {
          router.invalidate({ sync: true });
        }
      }
    },
  });

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

  const isActive = organizationSlug === data.slug;

  return (
    <div className="group flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar.Root className="size-10 rounded-md">
            <Avatar.Image src={data?.logo || ""} />
            <Avatar.Fallback className="text-xs">
              {data?.name[0]}
            </Avatar.Fallback>
          </Avatar.Root>
          {isActive && (
            <div className="-right-1.5 -top-1.5 absolute flex items-center justify-center rounded-full bg-accent-500 px-0.75 text-[8px] text-white">
              Active
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <Text.Root size="sm" weight="medium">
            {data?.name}
          </Text.Root>
          <Text.Root className="capitalize" color="muted" size="xs">
            {data.role}
          </Text.Root>
        </div>
      </div>
      <Button.Root
        className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
        onClick={handleLeave}
        variant="tertiary"
      >
        <Button.Icon>
          <DoorClosedIcon />
        </Button.Icon>
        Leave
      </Button.Root>
    </div>
  );
};
