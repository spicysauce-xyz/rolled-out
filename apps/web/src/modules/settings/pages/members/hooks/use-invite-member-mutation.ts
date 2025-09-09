import { api } from "@lib/api";
import { invitationsQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInviteMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      organizationId: string;
      // TODO: Update member types here
      role: "member" | "admin" | "owner";
    }) => {
      const response = await api.organizations[
        ":organizationId"
      ].invitations.$post({
        param: {
          organizationId: data.organizationId,
        },
        json: {
          email: data.email,
          role: data.role,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries(
        invitationsQuery(variables.organizationId)
      );
    },
  });
};
