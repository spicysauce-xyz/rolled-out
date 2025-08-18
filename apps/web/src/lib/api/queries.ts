import { authClient } from "@lib/auth";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
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
      const response = await api.organizations.$get();

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

export const invitationsQuery = () => {
  return queryOptions({
    queryKey: ["invitations"],
    queryFn: async () => {
      const response = await api.invitations.$get();

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });
};

export const invitationQuery = (id: string) =>
  queryOptions({
    queryKey: ["invitation", id],
    queryFn: async ({ queryKey }) => {
      const response = await authClient.organization.getInvitation({
        query: {
          id: queryKey[1],
        },
      });

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

export const updateQuery = (organizationId: string, updateId: string) =>
  queryOptions({
    queryKey: ["update", organizationId, updateId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].$get({
        param: {
          organizationId: queryKey[1],
          id: queryKey[2],
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

export const boardsQuery = (organizationId: string) =>
  queryOptions({
    queryKey: ["boards", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].boards.$get({
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

export const boardQuery = (organizationId: string, boardId: string) =>
  queryOptions({
    queryKey: ["board", organizationId, boardId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].boards[
        ":id"
      ].$get({
        param: {
          organizationId: queryKey[1],
          id: queryKey[2],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

export const boardPostsQuery = (organizationId: string, boardId: string) =>
  queryOptions({
    queryKey: ["boardPosts", organizationId, boardId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].boards[
        ":id"
      ].posts.$get({
        param: {
          organizationId: queryKey[1],
          id: queryKey[2],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

export const notificationsStatusQuery = (organizationId: string) =>
  queryOptions({
    queryKey: ["notifications-status", organizationId] as const,
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].notifications.status.$get({
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

export const notificationsQuery = (organizationId: string, limit: number) =>
  infiniteQueryOptions({
    queryKey: ["notifications", organizationId] as const,
    queryFn: async ({ pageParam = 0, queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].notifications.$get({
        param: {
          organizationId: queryKey[1],
        },
        query: {
          limit: limit.toString(),
          offset: pageParam.toString(),
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const itemsLength = pages.flat().length;
      const lastPageItemsLength = lastPage.length;

      return lastPageItemsLength === limit ? itemsLength : undefined;
    },
  });
