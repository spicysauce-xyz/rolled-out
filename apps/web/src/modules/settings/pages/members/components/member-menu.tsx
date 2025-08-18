import { Confirmer } from "@components/confirmer";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { DropdownMenu, IconButton, Text } from "@mono/ui";
import _ from "lodash";
import { EllipsisVerticalIcon, Trash2Icon, UserCog2Icon } from "lucide-react";
import { useCallback } from "react";
import { useRemoveMemberMutation } from "../hooks/use-remove-member-mutation";
import { useUpdateMemberRoleMutation } from "../hooks/use-update-member-role-mutation";

interface MemberMenuProps {
  member: { id: string; user: { name: string }; role: string };
  organizationId: string;
}

export const MemberMenu = ({ member, organizationId }: MemberMenuProps) => {
  const removeMemberMutation = useRemoveMemberMutation();

  const deleteMemberPermission = useHasPermission({
    organizationId,
    permission: { member: ["delete"] },
  });

  const handleRemoveMember = useCallback(async () => {
    const confirmed = await Confirmer.confirm({
      title: "Remove Member",
      description: `Are you sure you want to remove ${member.user.name} from the organization?`,
      phrase: member.user.name.toLowerCase().replaceAll(" ", "-").trim(),
      action: {
        icon: Trash2Icon,
        label: "Remove",
        color: "danger",
      },
    });

    if (!confirmed) {
      return;
    }

    await removeMemberMutation.mutateAsync({
      organizationId,
      memberId: member.id,
    });
  }, [member, organizationId, removeMemberMutation]);

  const updateMemberRoleMutation = useUpdateMemberRoleMutation();

  const updateMemberPermission = useHasPermission({
    organizationId,
    permission: { member: ["update"] },
  });

  const handleUpdateMemberRole = useCallback(
    async (role: "member" | "admin" | "owner") => {
      const confirmed = await Confirmer.confirm({
        title: "Update Member Role",
        description: `Are you sure you want to update ${member.user.name}'s role to ${role}?`,
      });

      if (!confirmed) {
        return;
      }

      await updateMemberRoleMutation.mutateAsync({
        organizationId,
        memberId: member.id,
        role,
      });
    },
    [member, organizationId, updateMemberRoleMutation]
  );

  if (deleteMemberPermission.isPending || updateMemberPermission.isPending) {
    return null;
  }

  if (
    !(
      deleteMemberPermission.hasPermission ||
      updateMemberPermission.hasPermission
    )
  ) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton.Root variant="tertiary">
          <IconButton.Icon>
            <EllipsisVerticalIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {updateMemberPermission.hasPermission && (
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <DropdownMenu.Item.Icon>
                <UserCog2Icon />
              </DropdownMenu.Item.Icon>
              <Text.Root asChild color="muted" weight="medium">
                <span>Role:</span>
              </Text.Root>{" "}
              {_.capitalize(member.role)}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup
                onValueChange={(value) => {
                  handleUpdateMemberRole(value as "member" | "admin" | "owner");
                }}
                value={member.role}
              >
                {["owner", "admin", "member"].map((role) => (
                  <DropdownMenu.RadioItem.Root key={role} value={role}>
                    <DropdownMenu.RadioItem.Content>
                      {_.capitalize(role)}
                    </DropdownMenu.RadioItem.Content>
                  </DropdownMenu.RadioItem.Root>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
        {deleteMemberPermission.hasPermission && (
          <DropdownMenu.Item.Root onClick={handleRemoveMember}>
            <DropdownMenu.Item.Content>
              <DropdownMenu.Item.Icon>
                <Trash2Icon />
              </DropdownMenu.Item.Icon>
              Remove Member
            </DropdownMenu.Item.Content>
          </DropdownMenu.Item.Root>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
