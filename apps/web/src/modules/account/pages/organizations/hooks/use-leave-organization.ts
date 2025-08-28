import { organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLeaveOrganizationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await authClient.organization.leave({
        organizationId: data.id,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(organizationsQuery());
    },
  });
};
