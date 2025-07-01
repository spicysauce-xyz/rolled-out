import { api } from "@lib/api";
import { boardPostsQuery, boardQuery, boardsQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      organizationId: string;
      name: string;
      symbol: string;
      slug: string;
      tags: string[];
    }) => {
      const response = await api.organizations[":organizationId"].boards[
        ":id"
      ].$put({
        json: {
          name: data.name,
          symbol: data.symbol,
          slug: data.slug,
          tags: data.tags,
        },
        param: {
          organizationId: data.organizationId,
          id: data.id,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries(boardsQuery(data.organizationId));

      await queryClient.refetchQueries(
        boardQuery(data.organizationId, data.id),
      );

      await queryClient.invalidateQueries(
        boardPostsQuery(data.organizationId, data.id),
      );

      Toaster.success("Board updated");
    },
    onError: (error) => {
      Toaster.error("Failed to update board", {
        description: error.message,
      });
    },
  });
};
