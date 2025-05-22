import { useHasPermission } from "@modules/shared/hooks/useHasPermission";
import { Button, DropdownMenu, Text } from "@mono/ui";
import { capitalize } from "lodash";
import { EllipsisVerticalIcon, Trash2Icon, UserCog2Icon } from "lucide-react";
import { useRemoveMember } from "../hooks/useRemoveMember";
import { useUpdateMemberRole } from "../hooks/useUpdateMemberRole";

interface MemberMenuProps {
  member: { id: string; user: { name: string }; role: string };
  organizationId: string;
}

export const MemberMenu = ({ member, organizationId }: MemberMenuProps) => {
  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const deleteMemberPermission = useHasPermission({
    organizationId,
    permission: { member: ["delete"] },
  });

  const updateMemberPermission = useHasPermission({
    organizationId,
    permission: { member: ["update"] },
  });

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
              {capitalize(member.role)}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup
                value={member.role}
                onValueChange={(value) => {
                  updateMemberRole(
                    organizationId,
                    member,
                    value as "member" | "admin" | "owner",
                  );
                }}
              >
                {["owner", "admin", "member"].map((role) => (
                  <DropdownMenu.RadioItem key={role} value={role}>
                    {capitalize(role)}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
        {deleteMemberPermission.hasPermission && (
          <DropdownMenu.Item
            onClick={() => removeMember(organizationId, member)}
          >
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
