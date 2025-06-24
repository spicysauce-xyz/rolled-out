import { authClient } from "@lib/auth";
import { queryOptions } from "@tanstack/react-query";
import { api } from ".";

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
    staleTime: 1000 * 30,
  });

export const sessionsQuery = () =>
  queryOptions({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await authClient.listSessions();

      if (response.error) {
        throw response.error;
      }

      return response.data;
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
    staleTime: 1000 * 30,
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

export const updatesQuery = (organizationId: string) =>
  queryOptions({
    queryKey: ["posts", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].posts.$get({
        param: {
          organizationId: queryKey[1],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

export const organizationTagsQuery = (organizationId: string) =>
  queryOptions({
    queryKey: ["tags", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].tags.$get({
        param: {
          organizationId: queryKey[1],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error);
      }

      return json.data;
    },
  });
