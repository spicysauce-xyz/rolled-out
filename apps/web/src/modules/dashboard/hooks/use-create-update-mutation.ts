import { api } from "@lib/api";
import { updateQuery, updatesQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
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
    onMutate: () => {
      return { toastId: Toaster.loading("Creating new draft...") };
    },
    onSuccess: async (post, _, context) => {
      await queryClient.refetchQueries(updatesQuery(post.organizationId));
      await queryClient.prefetchQuery(
        updateQuery(post.organizationId, post.id)
      );

      Toaster.success("Successfully created new draft", {
        id: context.toastId,
      });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Error creating new draft", {
          description: error.message,
          id: context.toastId,
        });
      }
    },
  });
};
