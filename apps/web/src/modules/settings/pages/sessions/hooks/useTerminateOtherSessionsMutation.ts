import { sessionsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTerminateOtherSessionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authClient.revokeOtherSessions();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Terminating other sessions...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.refetchQueries(sessionsQuery());

      Toaster.success("Other sessions terminated", { id: context.toastId });
    },
    onError: (error, __, context) => {
      Toaster.error("Failed to terminate other sessions", {
        description: error.message,
        id: context?.toastId,
      });
    },
  });
};
