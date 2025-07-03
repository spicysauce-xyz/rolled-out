import { Confirmer } from "@components/confirmer";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { Button, DropdownMenu } from "@mono/ui";
import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { useCallback } from "react";
import { useCancelInvitationMutation } from "../hooks/use-cancel-invitation-mutation";

interface InvitationMenuProps {
  invitation: { id: string; email: string };
  organizationId: string;
}

export const InvitationMenu = ({
  invitation,
  organizationId,
}: InvitationMenuProps) => {
  const cancelInvitationMutation = useCancelInvitationMutation();

  const cancelInvitationPermission = useHasPermission({
    organizationId,
    permission: { invitation: ["cancel"] },
  });

  const handleCancelInvitation = useCallback(async () => {
    const confirmed = await Confirmer.confirm({
      title: "Cancel Invitation",
      description: `Are you sure you want to cancel invitation for ${invitation.email}?`,
      phrase: invitation.email.toLowerCase().trim(),
      action: {
        icon: Trash2Icon,
        label: "Cancel",
        color: "danger",
      },
    });

    if (!confirmed) {
      return;
    }

    await cancelInvitationMutation.mutateAsync({
      invitationId: invitation.id,
    });
  }, [cancelInvitationMutation, invitation]);

  if (cancelInvitationPermission.isPending) {
    return null;
  }

  if (!cancelInvitationPermission.hasPermission) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button.Root variant="tertiary">
          <Button.Icon>
            <EllipsisVerticalIcon />
          </Button.Icon>
        </Button.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {cancelInvitationPermission.hasPermission && (
          <DropdownMenu.Item onClick={handleCancelInvitation}>
            <DropdownMenu.ItemIcon>
              <Trash2Icon />
            </DropdownMenu.ItemIcon>
            Cancel Invitation
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
