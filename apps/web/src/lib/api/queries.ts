import { authClient } from "@lib/auth";
import { queryOptions } from "@tanstack/react-query";

export const sessionQuery = () =>
  queryOptions({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await authClient.getSession();

      if (response.error) {
        throw response.error;
      }

      return response;
    },
  });

export const organizationsQuery = () =>
  queryOptions({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await authClient.organization.list();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

export const organizationQuery = (id: string) =>
  queryOptions({
    queryKey: ["organization", id],
    queryFn: async ({ queryKey }) => {
      const response = await authClient.organization.getFullOrganization({
        query: {
          organizationId: queryKey[1],
        },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
