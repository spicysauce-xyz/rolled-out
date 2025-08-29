import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
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

    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries(
        organizationQuery(variables.organizationId)
      );
    },
  });
};
