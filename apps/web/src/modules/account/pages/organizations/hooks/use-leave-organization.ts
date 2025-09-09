import { api } from "@lib/api";
import { organizationsQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

export const useLeaveOrganizationMutation = () => {
  const { user } = useRouteContext({ from: "/_authorized" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { organizationId: string }) => {
      const response = await api.users[":id"].organizations[
        ":organizationId"
      ].leave.$put({
        param: {
          id: user.id,
          organizationId: data.organizationId,
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
    },
  });
};
