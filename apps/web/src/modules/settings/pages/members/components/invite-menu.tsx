import { Confirmer } from "@components/confirmer";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { Button, DropdownMenu, Toaster } from "@mono/ui";
import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { useCancelInvitationMutation } from "../hooks/use-cancel-invitation-mutation";

interface InvitationMenuProps {
  invitation: { id: string; email: string };
  organizationId: string;
}

export const InvitationMenu = ({
  invitation,
  organizationId,
}: InvitationMenuProps) => {
  const { mutateAsync: cancelInvitation } = useCancelInvitationMutation();

  const cancelInvitationPermission = useHasPermission({
    organizationId,
    permission: { invitation: ["cancel"] },
  });

  const handleCancelInvitation = () => {
    Confirmer.confirm({
      title: "Cancel Invitation",
      description: `Are you sure you want to cancel the invitation for ${invitation.email}?`,
      phrase: invitation.email.toLowerCase().trim(),
      action: {
        icon: Trash2Icon,
        label: "Yes, cancel",
        color: "danger",
        run: () =>
          cancelInvitation(
            {
              invitationId: invitation.id,
              organizationId,
            },
            {
              onSuccess() {
                Toaster.success("Invitation cancelled", {
                  description: `The invitation for ${invitation.email} has been canceled.`,
                });
              },
              onError() {
                Toaster.error("Couldn't cancel invitation", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  if (cancelInvitationPermission.isPending) {
    return null;
  }

  if (!cancelInvitationPermission.hasPermission) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger render={<Button.Root variant="tertiary" />}>
        <Button.Icon render={<EllipsisVerticalIcon />} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {cancelInvitationPermission.hasPermission && (
          <DropdownMenu.Item onClick={handleCancelInvitation}>
            <DropdownMenu.ItemIcon render={<Trash2Icon />} />
            Cancel Invitation
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
