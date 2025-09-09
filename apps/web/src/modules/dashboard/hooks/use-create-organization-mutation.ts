import { api } from "@lib/api";
import { organizationsQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

export const useCreateOrganizationMutation = () => {
  const { user } = useRouteContext({ from: "/_authorized" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const response = await api.organizations.$post({
        json: {
          slug: data.slug,
          name: data.name,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(organizationsQuery(user.id));

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
