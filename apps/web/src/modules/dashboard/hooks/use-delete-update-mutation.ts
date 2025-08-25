import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { organizationId: string; id: string }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].$delete({
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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: updatesQuery(variables.organizationId).queryKey,
      });

      const previousData = queryClient.getQueryData(
        updatesQuery(variables.organizationId).queryKey
      );

      if (previousData) {
        queryClient.setQueryData(
          updatesQuery(variables.organizationId).queryKey,
          (old) => {
            if (old) {
              return old.filter((post) => post.id !== variables.id);
            }

            return old;
          }
        );
      }

      return { previousData };
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries(
        updatesQuery(variables.organizationId)
      );
    },
    onError: (error, { organizationId }, context) => {
      if (context) {
        Toaster.error("Error deleting update", {
          description: error.message,
        });

        if (context.previousData) {
          queryClient.setQueryData(
            updatesQuery(organizationId).queryKey,
            context.previousData
          );
        }
      }
    },
  });
};
