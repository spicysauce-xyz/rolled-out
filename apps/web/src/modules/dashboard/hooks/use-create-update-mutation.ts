import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await api.organizations[":organizationId"].posts.$post({
        param: {
          organizationId,
        },
        json: {},
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async (_, __, organizationId) => {
      await queryClient.invalidateQueries(updatesQuery(organizationId));
    },
  });
};
