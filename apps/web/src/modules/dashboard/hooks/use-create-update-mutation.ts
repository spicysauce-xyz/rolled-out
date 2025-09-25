import { api } from "@lib/api";
import {
  githubIntegrationPendingCommitsQuery,
  updateQuery,
  updatesQuery,
} from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      organizationId: string;
      githubIds?: string[];
    }) => {
      const response = await api.organizations[":organizationId"].posts.$post({
        param: {
          organizationId: data.organizationId,
        },
        json: {
          githubIds: data.githubIds,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async (data, __, { organizationId }) => {
      if (data) {
        await queryClient.prefetchQuery(updateQuery(organizationId, data.id));
      }

      await queryClient.invalidateQueries(updatesQuery(organizationId));
      await queryClient.invalidateQueries(
        githubIntegrationPendingCommitsQuery(organizationId)
      );
    },
  });
};
