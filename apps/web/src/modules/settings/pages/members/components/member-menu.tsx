import { Confirmer } from "@components/confirmer";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { DropdownMenu, IconButton, Text, Toaster } from "@mono/ui";
import _ from "lodash";
import { EllipsisVerticalIcon, Trash2Icon, UserCog2Icon } from "lucide-react";
import { useRemoveMemberMutation } from "../hooks/use-remove-member-mutation";
import { useUpdateMemberRoleMutation } from "../hooks/use-update-member-role-mutation";

interface MemberMenuProps {
  member: { id: string; user: { name: string }; role: string };
  organizationId: string;
}

export const MemberMenu = ({ member, organizationId }: MemberMenuProps) => {
  const { mutateAsync: removeMember } = useRemoveMemberMutation();

  const deleteMemberPermission = useHasPermission({
    organizationId,
    permission: { member: ["delete"] },
  });

  const handleRemoveMember = () => {
    Confirmer.confirm({
      title: "Remove Member",
      description: `Are you sure you want to remove ${member.user.name} from the organization?`,
      phrase: member.user.name.toLowerCase().replaceAll(" ", "-").trim(),
      action: {
        icon: Trash2Icon,
        label: "Remove",
        color: "danger",
        run: () =>
          removeMember(
            {
              organizationId,
              memberId: member.id,
            },
            {
              onSuccess() {
                Toaster.success("Member removed", {
                  description: `${member.user.name} has been removed from the organization.`,
                });
              },
              onError() {
                Toaster.error("Couldn't remove member", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  const { mutateAsync: updateMemberRole } = useUpdateMemberRoleMutation();

  const updateMemberPermission = useHasPermission({
    organizationId,
    permission: { member: ["update"] },
  });

  const handleUpdateMemberRole = (role: "member" | "admin" | "owner") => {
    Confirmer.confirm({
      title: "Update member role",
      description: `Are you sure you want to change ${member.user.name}'s role to ${role}?`,
      action: {
        label: "Yes, update",
        color: "success",
        icon: UserCog2Icon,
        run: () =>
          updateMemberRole(
            {
              organizationId,
              memberId: member.id,
              role,
            },
            {
              onSuccess() {
                Toaster.success("Role updated", {
                  description: `${member.user.name} is now an ${_.capitalize(role)}.`,
                });
              },
              onError() {
                Toaster.error("Couldn't update role", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

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
