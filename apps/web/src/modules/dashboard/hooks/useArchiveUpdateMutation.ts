import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useArchiveUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      organizationId: string;
      id: string;
    }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].archive.$post({
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
    onMutate: () => {
      return { toastId: Toaster.loading("Archiving update...") };
    },
    onSuccess: async (update, _, context) => {
      await queryClient.invalidateQueries(updatesQuery(update.organizationId));

      Toaster.success("Update archived", {
        id: context.toastId,
      });
    },
    onError: (error, _, context) => {
      if (context) {
        Toaster.error("Error archiving update", {
          description: error.message,
          id: context.toastId,
        });
      }
    },
  });
};
