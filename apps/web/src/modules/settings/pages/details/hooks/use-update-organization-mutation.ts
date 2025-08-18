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
      console.time("invalidating organization");
      await queryClient.invalidateQueries(organizationQuery(data.id));
      console.timeEnd("invalidating organization");

      console.time("refetching organizations");
      await queryClient.refetchQueries(organizationsQuery());
      console.timeEnd("refetching organizations");

      Toaster.success("Organization updated.");
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
