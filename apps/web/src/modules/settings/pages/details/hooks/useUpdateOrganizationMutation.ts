import { organizationQuery, organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateOrganizationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      logo: string | undefined;
      organizationId: string;
    }) => {
      const response = await authClient.organization.update({
        organizationId: data.organizationId,
        data: {
          name: data.name,
          slug: data.slug,
          logo: data.logo,
        },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries(organizationQuery(data.id));

      await queryClient.refetchQueries(organizationsQuery());

      Toaster.success("Organization updated successfully!");
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to update organization", {
          description: error.message,
        });
      }
    },
  });
};
