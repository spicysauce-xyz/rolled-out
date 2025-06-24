import { api } from "@lib/api";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      organizationId: string;
      label: string;
    }) => {
      const response = await api.organizations[":organizationId"].tags.$post({
        json: {
          label: data.label,
        },
        param: {
          organizationId: data.organizationId,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data[0];
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Creating tag...") };
    },
    onSuccess: async (data, _, context) => {
      await queryClient.refetchQueries({
        queryKey: ["tags", data.organizationId],
      });

      Toaster.success(`${data.label} created and added to your tags`, {
        id: context.toastId,
      });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to create tag", {
          description: error.message,
          id: context.toastId,
        });
      }
    },
  });
};
