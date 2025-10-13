import { api } from "@lib/api";
import { organizationQuery, organizationsQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

export const useUpdateOrganizationMutation = () => {
  const { user } = useRouteContext({ from: "/_authorized" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      logo: string | undefined;
      websiteUrl: string;
      organizationId: string;
    }) => {
      const response = await api.organizations[":organizationId"].$put({
        param: {
          organizationId: data.organizationId,
        },
        json: {
          name: data.name,
          slug: data.slug,
          logo: data.logo,
          websiteUrl: data.websiteUrl,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries(
        organizationQuery(variables.organizationId)
      );
      await queryClient.refetchQueries(organizationsQuery(user.id));
    },
  });
};
