import { api } from "@lib/api";
import { boardsQuery } from "@lib/api/queries";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      organizationId: string;
      name: string;
      symbol: string;
      slug: string;
      tags: string[];
    }) => {
      const response = await api.organizations[":organizationId"].boards.$post({
        json: {
          name: data.name,
          symbol: data.symbol,
          slug: data.slug,
          tags: data.tags,
        },
        param: {
          organizationId: data.organizationId,
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

      Toaster.success("Board created");
    },
    onError: (error) => {
      Toaster.error("Failed to create board", {
        description: error.message,
      });
    },
  });
};
