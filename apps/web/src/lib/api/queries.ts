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

export const organizationsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["organizations", userId],
    queryFn: async ({ queryKey }) => {
      const response = await api.me.organizations.$get({
        param: {
          id: queryKey[1],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

export const invitationsQuery = (organizationId: string) => {
  return queryOptions({
    queryKey: ["invitations", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].invitations.$get({
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
};

export const userInvitationsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["user-invitations", userId],
    queryFn: async ({ queryKey }) => {
      const response = await api.me.invitations.$get({
        param: {
          id: queryKey[1],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

export const organizationQuery = (id: string) =>
  queryOptions({
    queryKey: ["organization", id],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].$get({
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

export const membersQuery = (id: string) =>
  queryOptions({
    queryKey: ["members", id],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[":organizationId"].members.$get({
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
        throw json.error;
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

export const githubCommitsQuery = (
  organizationId: string,
  repositoryId?: string
) =>
  infiniteQueryOptions({
    queryKey: ["github", organizationId, repositoryId] as const,
    queryFn: async ({ pageParam, queryKey }) => {
      const response = await api.organizations[":organizationId"].repositories[
        ":repositoryId"
      ].commits.$get({
        param: {
          organizationId: queryKey[1],
          repositoryId: queryKey[2] as string,
        },
        query: {
          cursor: pageParam,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return {
        data: json.data,
        meta: json.meta,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.cursor;
    },
    enabled: !!repositoryId,
  });

export const repositoriesQuery = (organizationId: string) =>
  queryOptions({
    queryKey: ["repositories", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].repositories.$get({
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

export const githubIntegrationQuery = (organizationId: string) =>
  queryOptions({
    queryKey: ["github-integration", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].integrations.github.$get({
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
