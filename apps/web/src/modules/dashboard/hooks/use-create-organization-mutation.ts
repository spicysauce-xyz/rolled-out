import { api } from "@lib/api";
import { organizationsQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

export const useCreateOrganizationMutation = () => {
  const { user } = useRouteContext({ from: "/_authorized" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string; logo?: string }) => {
      const response = await api.organizations.$post({
        json: {
          slug: data.slug,
          name: data.name,
          logo: data.logo,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async () => {
      await queryClient.refetchQueries(organizationsQuery(user.id));
    },
  });
};
