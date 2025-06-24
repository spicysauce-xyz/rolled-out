import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
    onMutate: () => {
      return { toastId: Toaster.loading("Updating member role...") };
    },
    onSuccess: async (data, __, context) => {
      await queryClient.invalidateQueries(
        organizationQuery(data.organizationId),
      );

      Toaster.success("Member role updated", { id: context.toastId });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to update member role", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
