import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUnschedulePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { organizationId: string; id: string }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].unschedule.$put({
        param: {
          organizationId: args.organizationId,
          id: args.id,
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
        updatesQuery(variables.organizationId)
      );
    },
  });
};
