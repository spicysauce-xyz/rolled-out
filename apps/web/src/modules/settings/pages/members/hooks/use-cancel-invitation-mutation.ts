import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCancelInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { invitationId: string }) => {
      const response = await authClient.organization.cancelInvitation({
        invitationId: data.invitationId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSettled: async (data) => {
      if (data) {
        await queryClient.invalidateQueries(
          organizationQuery(data.organizationId)
        );
      }
    },
    onError: () => {
      Toaster.error("Failed to cancel invitation");
    },
  });
};
