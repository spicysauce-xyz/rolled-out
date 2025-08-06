import { sessionsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
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
    onMutate: () => {
      return { toastId: Toaster.loading("Terminating session...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.refetchQueries(sessionsQuery());

      Toaster.success("Session terminated", { id: context.toastId });
    },
    onError: (error, __, context) => {
      Toaster.error("Failed to terminate session", {
        description: error.message,
        id: context?.toastId,
      });
    },
  });
};
