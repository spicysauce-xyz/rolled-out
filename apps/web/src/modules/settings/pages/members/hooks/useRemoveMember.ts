import * as Confirmer from "@components/feedback/confirmer";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: async (data: {
      memberId: string;
      organizationId: string;
    }) => {
      const response = await authClient.organization.removeMember({
        organizationId: data.organizationId,
        memberIdOrEmail: data.memberId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  return async (
    organizationId: string,
    member: { id: string; user: { name: string } },
  ) => {
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

    const toastId = Toaster.loading("Removing member...");

    try {
      await removeMemberMutation.mutateAsync({
        organizationId,
        memberId: member.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["organization", organizationId],
      });

      Toaster.success("Member removed", { id: toastId });
    } catch {
      Toaster.error("Failed to remove member", { id: toastId });
    }
  };
};
