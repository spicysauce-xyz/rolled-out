import { organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateOrganizationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const response = await authClient.organization.create({
        slug: data.slug,
        name: data.name,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(organizationsQuery());

      Toaster.success("Organization created successfully!");
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to create organization", {
          description: error.message,
        });
      }
    },
  });
};
