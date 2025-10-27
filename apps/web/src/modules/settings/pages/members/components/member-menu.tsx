import { Confirmer } from "@components/confirmer";
import {
  Delete02Icon,
  MoreVerticalCircle01Icon,
  UserSettings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { DropdownMenu, IconButton, Toaster } from "@mono/ui";
import _ from "lodash";
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
        icon: Delete02Icon,
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
        icon: UserSettings02Icon,
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
      <DropdownMenu.Trigger render={<IconButton.Root variant="tertiary" />}>
        <IconButton.Icon
          render={
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} />
          }
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {updateMemberPermission.hasPermission && (
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <DropdownMenu.ItemIcon
                render={
                  <HugeiconsIcon icon={UserSettings02Icon} strokeWidth={2} />
                }
              />
              {_.capitalize(member.role)}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Content alignOffset={-8} side="right" sideOffset={12}>
              <DropdownMenu.RadioGroup
                onValueChange={(value) => {
                  handleUpdateMemberRole(value as "member" | "admin" | "owner");
                }}
                value={member.role}
              >
                {["owner", "admin", "member"].map((role) => (
                  <DropdownMenu.RadioItem key={role} value={role}>
                    {_.capitalize(role)}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Sub>
        )}
        <DropdownMenu.Separator />
        {deleteMemberPermission.hasPermission && (
          <DropdownMenu.Item onClick={handleRemoveMember}>
            <DropdownMenu.ItemIcon
              render={<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />}
            />
            Remove Member
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
