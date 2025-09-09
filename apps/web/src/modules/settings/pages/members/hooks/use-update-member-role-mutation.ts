import { api } from "@lib/api";
import { membersQuery } from "@lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      memberId: string;
      organizationId: string;
      // TODO: Update member types here
      role: "member" | "admin" | "owner";
    }) => {
      const response = await api.organizations[":organizationId"].members[
        ":id"
      ].$put({
        param: {
          organizationId: data.organizationId,
          id: data.memberId,
        },
        json: {
          role: data.role,
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
        membersQuery(variables.organizationId)
      );
    },
  });
};
