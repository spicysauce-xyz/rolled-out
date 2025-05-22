import * as Confirmer from "@components/feedback/confirmer";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  const updateMemberMutation = useMutation({
    mutationFn: async (data: {
      memberId: string;
      organizationId: string;
      // TODO: Update member types here
      role: "member" | "admin" | "owner";
    }) => {
      const response = await authClient.organization.updateMemberRole({
        organizationId: data.organizationId,
        memberId: data.memberId,
        role: data.role,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  // TODO: Update member types here
  return async (
    organizationId: string,
    member: { id: string; user: { name: string } },
    role: "member" | "admin" | "owner",
  ) => {
    const confirmed = await Confirmer.confirm({
      title: "Update Member Role",
      description: `Are you sure you want to update ${member.user.name}'s role to ${role}?`,
    });

    if (!confirmed) return;

    const toastId = Toaster.loading("Updating member role...");

    try {
      await updateMemberMutation.mutateAsync({
        organizationId,
        memberId: member.id,
        role,
      });

      await queryClient.invalidateQueries({
        queryKey: ["organization", organizationId],
      });

      Toaster.success("Member role updated", { id: toastId });
    } catch {
      Toaster.error("Failed to update member role", { id: toastId });
    }
  };
};
