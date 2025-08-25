import { api } from "@lib/api";
import { updatesQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublishUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { organizationId: string; id: string }) => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].publish.$post({
        param: {
          organizationId: args.organizationId,
          id: args.id,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: updatesQuery(variables.organizationId).queryKey,
      });

      const previousData = queryClient.getQueryData(
        updatesQuery(variables.organizationId).queryKey
      );

      if (previousData) {
        queryClient.setQueryData(
          updatesQuery(variables.organizationId).queryKey,
          (old) => {
            if (old) {
              return old
                .map((post) => {
                  if (post.id === variables.id) {
                    return { ...post, status: "published" as const };
                  }

                  return post;
                })
                .sort((a, b) => {
                  const statusOrder = { draft: 1, scheduled: 2, published: 3 };
                  const statusDiff =
                    statusOrder[a.status] - statusOrder[b.status];

                  if (statusDiff !== 0) {
                    return statusDiff;
                  }

                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });
            }

            return old;
          }
        );
      }

      return { previousData };
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries(
        updatesQuery(variables.organizationId)
      );
    },
    onError: (error, { organizationId }, context) => {
      if (context) {
        Toaster.error("Error publishing update", {
          description: error.message,
        });

        if (context.previousData) {
          queryClient.setQueryData(
            updatesQuery(organizationId).queryKey,
            context.previousData
          );
        }
      }
    },
  });
};
