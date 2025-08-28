import { sessionsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTerminateSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sessionToken: string }) => {
      const response = await authClient.revokeSession({
        token: data.sessionToken,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSettled: async () => {
      await queryClient.refetchQueries(sessionsQuery());
    },
  });
};
