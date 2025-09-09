import { api } from "@lib/api";
import { invitationsQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCancelInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      invitationId: string;
      organizationId: string;
    }) => {
      const response = await api.organizations[":organizationId"].invitations[
        ":invitationId"
      ].$delete({
        param: {
          organizationId: data.organizationId,
          invitationId: data.invitationId,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async (data) => {
      if (data) {
        await queryClient.invalidateQueries(
          invitationsQuery(data.organizationId)
        );
      }
    },
  });
};
