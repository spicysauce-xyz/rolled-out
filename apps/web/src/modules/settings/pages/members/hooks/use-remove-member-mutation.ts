import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { memberId: string; organizationId: string }) => {
      const response = await authClient.organization.removeMember({
        organizationId: data.organizationId,
        memberIdOrEmail: data.memberId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data.member;
    },
    onSettled: async (data) => {
      if (data) {
        await queryClient.invalidateQueries(
          organizationQuery(data.organizationId)
        );
      }
    },
  });
};
