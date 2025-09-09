import { api } from "@lib/api";
import { membersQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { memberId: string; organizationId: string }) => {
      const response = await api.organizations[":organizationId"].members[
        ":id"
      ].$delete({
        param: {
          organizationId: data.organizationId,
          id: data.memberId,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onSettled: async (data) => {
      if (data) {
        await queryClient.invalidateQueries(membersQuery(data.organizationId));
      }
    },
  });
};
