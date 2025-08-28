import { sessionQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
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
    onSettled: async () => {
      await queryClient.refetchQueries(sessionQuery());
      await router.invalidate({ sync: true });
    },
  });
};
