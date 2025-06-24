import * as Confirmer from "@components/feedback/confirmer";
import { useHasPermission } from "@modules/shared/hooks/useHasPermission";
import { Button, DropdownMenu, Text } from "@mono/ui";
import _ from "lodash";
import { EllipsisVerticalIcon, Trash2Icon, UserCog2Icon } from "lucide-react";
import { useCallback } from "react";
import { useRemoveMemberMutation } from "../hooks/useRemoveMemberMutation";
import { useUpdateMemberRoleMutation } from "../hooks/useUpdateMemberRoleMutation";

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

    if (!confirmed) return;

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

      if (!confirmed) return;

      await updateMemberRoleMutation.mutateAsync({
        organizationId,
        memberId: member.id,
        role,
      });
    },
    [member, organizationId, updateMemberRoleMutation],
  );

  if (deleteMemberPermission.isPending || updateMemberPermission.isPending) {
    return null;
  }

  if (
    !deleteMemberPermission.hasPermission &&
    !updateMemberPermission.hasPermission
  ) {
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
        {updateMemberPermission.hasPermission && (
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <DropdownMenu.ItemIcon>
                <UserCog2Icon />
              </DropdownMenu.ItemIcon>
              <Text.Root asChild color="muted" size="sm" weight="medium">
                <span>Role:</span>
              </Text.Root>{" "}
              {_.capitalize(member.role)}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup
                value={member.role}
                onValueChange={(value) => {
                  handleUpdateMemberRole(value as "member" | "admin" | "owner");
                }}
              >
                {["owner", "admin", "member"].map((role) => (
                  <DropdownMenu.RadioItem key={role} value={role}>
                    {_.capitalize(role)}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
        {deleteMemberPermission.hasPermission && (
          <DropdownMenu.Item onClick={handleRemoveMember}>
            <DropdownMenu.ItemIcon>
              <Trash2Icon />
            </DropdownMenu.ItemIcon>
            Remove Member
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
