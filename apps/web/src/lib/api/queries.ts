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
    staleTime: 0,
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
