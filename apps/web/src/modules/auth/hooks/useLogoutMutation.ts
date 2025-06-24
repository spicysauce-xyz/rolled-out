import { sessionQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useQuery(sessionQuery());

  return useMutation({
    mutationFn: async () => {
      const response = await authClient.signOut();

      if (response.error) {
        throw response.error;
      }

      return response;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Logging out...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.refetchQueries(sessionQuery());
      await router.invalidate({ sync: true });

      Toaster.success("Logged out successfully", { id: context.toastId });
    },
    onError: (_, __, context) => {
      if (context) {
        Toaster.error("Failed to log out", { id: context.toastId });
      }
    },
  });
};
