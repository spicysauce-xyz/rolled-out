import { Confirmer } from "@components/confirmer";
import type { api, SuccessResponse } from "@lib/api";
import { Avatar, IconButton, Text } from "@mono/ui";
import { useNavigate } from "@tanstack/react-router";
import { formatDistance } from "date-fns";
import type { InferResponseType } from "hono";
import { CheckIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import { useAcceptInvitationMutation } from "../hooks/use-accept-invitation";
import { useRejectInvitationMutation } from "../hooks/use-reject-invitation";

type Invitation = SuccessResponse<
  InferResponseType<(typeof api.invitations)["$get"]>
>[number];

interface InvitationItemProps {
  data: Invitation;
}

export const InvitationItem: React.FC<InvitationItemProps> = ({ data }) => {
  const navigate = useNavigate();

  const acceptInvitationMutation = useAcceptInvitationMutation({
    onSuccess: () => {
      if (!data.organization.slug) {
        return;
      }

      navigate({
        to: ".",
        params: {
          organizationSlug: data.organization.slug,
        },
      });
    },
  });

  const handleAcceptInvitation = useCallback(async () => {
    const confirmed = await Confirmer.confirm({
      title: "Accept Invitation",
      description: `Are you sure you want to accept invitation for ${data.organization.name}?`,
      action: {
        icon: CheckIcon,
        label: "Accept",
        color: "success",
      },
    });

    if (!confirmed) {
      return;
    }

    await acceptInvitationMutation.mutateAsync({
      id: data.id,
    });
  }, [acceptInvitationMutation, data]);

  const rejectInvitationMutation = useRejectInvitationMutation();

  const handleRejectInvitation = useCallback(async () => {
    const confirmed = await Confirmer.confirm({
      title: "Reject Invitation",
      description: `Are you sure you want to reject invitation for ${data.organization.name}?`,
      phrase: data.organization.name.toLowerCase().trim(),
      action: {
        icon: XIcon,
        label: "Reject",
        color: "danger",
      },
    });

    if (!confirmed) {
      return;
    }

    await rejectInvitationMutation.mutateAsync({
      id: data.id,
    });
  }, [data, rejectInvitationMutation]);

  return (
    <div className="group flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar.Root className="size-10 rounded-md">
            <Avatar.Image src={data?.organization?.logo || ""} />
            <Avatar.Fallback className="text-xs">
              {data?.organization?.name[0]}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="-right-1.5 -top-1.5 absolute flex size-3 items-center justify-center rounded-full bg-white p-0.75">
            <div className="h-full w-full animate-pulse rounded-full bg-warning-500" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <Text.Root size="sm" weight="medium">
            {data?.organization?.name}
          </Text.Root>
          <Text.Root color="muted" size="xs">
            {data.inviter.name} invited you to join {data.organization.name},
            expires{" "}
            {formatDistance(data.expiresAt, new Date(), {
              addSuffix: true,
            })}
          </Text.Root>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconButton.Root
          color="success"
          onClick={handleAcceptInvitation}
          variant="tertiary"
        >
          <IconButton.Icon>
            <CheckIcon />
          </IconButton.Icon>
        </IconButton.Root>
        <IconButton.Root
          color="danger"
          onClick={handleRejectInvitation}
          variant="tertiary"
        >
          <IconButton.Icon>
            <XIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </div>
    </div>
  );
};
