import { Confirmer } from "@components/confirmer";
import type { api, SuccessResponse } from "@lib/api";
import { Avatar, IconButton, Text, Toaster } from "@mono/ui";
import { useNavigate } from "@tanstack/react-router";
import { formatDistance } from "date-fns";
import type { InferResponseType } from "hono";
import { CheckIcon, XIcon } from "lucide-react";
import { useAcceptInvitationMutation } from "../hooks/use-accept-invitation";
import { useRejectInvitationMutation } from "../hooks/use-reject-invitation";

type Invitation = SuccessResponse<
  InferResponseType<(typeof api.users)[":id"]["invitations"]["$get"]>
>[number];

interface InvitationItemProps {
  data: Invitation;
}

export const InvitationItem: React.FC<InvitationItemProps> = ({ data }) => {
  const navigate = useNavigate();

  const { mutateAsync: acceptInvitation } = useAcceptInvitationMutation();

  const handleAcceptInvitation = () => {
    Confirmer.confirm({
      title: "Accept invitation",
      description: `Are you sure you want to accept the invitation to join ${data.organization.name}?`,
      action: {
        icon: CheckIcon,
        label: "Yes, accept",
        color: "success",
        run: () =>
          acceptInvitation(
            {
              invitationId: data.id,
            },
            {
              onSuccess() {
                Toaster.success("Invitation accepted", {
                  description: `You’ve successfully joined ${data.organization.name}.`,
                });

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
              onError() {
                Toaster.error("Couldn't accept invitation", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  const { mutateAsync: rejectInvitation } = useRejectInvitationMutation();

  const handleRejectInvitation = () => {
    Confirmer.confirm({
      title: "Reject invitation",
      description: `Are you sure you want to reject the invitation to join ${data.organization.name}?`,
      phrase: data.organization.name.toLowerCase().trim(),
      action: {
        icon: XIcon,
        label: "Yes, reject",
        color: "danger",
        run: () =>
          rejectInvitation(
            {
              invitationId: data.id,
            },
            {
              onSuccess() {
                Toaster.success("Invitation rejected", {
                  description: `The invitation to join ${data.organization.name} has been rejected.`,
                });
              },
              onError() {
                Toaster.error("Couldn't reject invitation", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  return (
    <div className="group flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar.Root className="size-10 rounded-md">
            <Avatar.Image src={data?.organization?.logo || ""} />
            <Avatar.Fallback>{data?.organization?.name[0]}</Avatar.Fallback>
          </Avatar.Root>
          <div className="-right-1.5 -top-1.5 absolute flex size-3 items-center justify-center rounded-full bg-white p-0.75">
            <div className="h-full w-full animate-pulse rounded-full bg-warning-500" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <Text.Root weight="medium">{data?.organization?.name}</Text.Root>
          <Text.Root color="muted" size="sm">
            {data.inviter.name} invited you to join {data.organization.name},
            expires{" "}
            {formatDistance(data.expiresAt, new Date(), {
              addSuffix: true,
            })}
          </Text.Root>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconButton.Root onClick={handleAcceptInvitation} variant="tertiary">
          <IconButton.Icon render={<CheckIcon />} />
        </IconButton.Root>
        <IconButton.Root onClick={handleRejectInvitation} variant="tertiary">
          <IconButton.Icon render={<XIcon />} />
        </IconButton.Root>
      </div>
    </div>
  );
};
