import { api } from "@lib/api";
import { organizationsQuery, userInvitationsQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

export const useAcceptInvitationMutation = () => {
  const { user } = useRouteContext({ from: "/_authorized" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { invitationId: string }) => {
      const response = await api.users[":id"].invitations[
        ":invitationId"
      ].accept.$put({
        param: {
          id: user.id,
          invitationId: data.invitationId,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(organizationsQuery(user.id));
      await queryClient.invalidateQueries(userInvitationsQuery(user.id));
    },
  });
};
