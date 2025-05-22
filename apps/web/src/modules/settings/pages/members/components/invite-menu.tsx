import { useHasPermission } from "@modules/shared/hooks/useHasPermission";
import { Button, DropdownMenu } from "@mono/ui";
import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { useCancelInvitation } from "../hooks/useCancelInvitation";

interface InvitationMenuProps {
  invitation: { id: string; email: string };
  organizationId: string;
}

export const InvitationMenu = ({
  invitation,
  organizationId,
}: InvitationMenuProps) => {
  const cancelInvitation = useCancelInvitation();

  const cancelInvitationPermission = useHasPermission({
    organizationId,
    permission: { invitation: ["cancel"] },
  });

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
          <DropdownMenu.Item
            onClick={() => cancelInvitation(organizationId, invitation)}
          >
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
