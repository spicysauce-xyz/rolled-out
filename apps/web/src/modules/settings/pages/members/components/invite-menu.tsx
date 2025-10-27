import { Confirmer } from "@components/confirmer";
import {
  Delete02Icon,
  MoreVerticalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { Button, DropdownMenu, Toaster } from "@mono/ui";
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
        icon: Delete02Icon,
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
        <Button.Icon
          render={
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} />
          }
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {cancelInvitationPermission.hasPermission && (
          <DropdownMenu.Item onClick={handleCancelInvitation}>
            <DropdownMenu.ItemIcon
              render={<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />}
            />
            Cancel Invitation
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
