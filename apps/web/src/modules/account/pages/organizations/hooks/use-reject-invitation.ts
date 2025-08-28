import { invitationsQuery, organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRejectInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await authClient.organization.rejectInvitation({
        invitationId: data.id,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(invitationsQuery());

      await queryClient.invalidateQueries(organizationsQuery());
    },
  });
};
