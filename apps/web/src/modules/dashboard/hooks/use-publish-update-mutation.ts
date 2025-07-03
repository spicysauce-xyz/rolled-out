import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublishUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { organizationId: string; id: string }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].publish.$post({
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
      return { toastId: Toaster.loading("Publishing update...") };
    },
    onSuccess: async (update, _, context) => {
      await queryClient.refetchQueries(updatesQuery(update.organizationId));

      Toaster.success("Update published", {
        id: context.toastId,
      });
    },
    onError: (error, _, context) => {
      if (context) {
        Toaster.error("Error publishing update", {
          description: error.message,
          id: context.toastId,
        });
      }
    },
  });
};
