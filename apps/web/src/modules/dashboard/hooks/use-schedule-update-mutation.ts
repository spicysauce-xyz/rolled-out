import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSchedulePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      organizationId: string;
      id: string;
      scheduledAt: string;
    }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].schedule.$put({
        param: {
          organizationId: args.organizationId,
          id: args.id,
        },
        json: {
          scheduledAt: args.scheduledAt,
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
    onError: (error, context) => {
      if (context) {
        Toaster.error("Error scheduling update", {
          description: error.message,
        });
      }
    },
  });
};
