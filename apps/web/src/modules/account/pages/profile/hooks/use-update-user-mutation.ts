import { sessionQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (value: { name: string; image: string | null }) => {
      const response = await authClient.updateUser(value);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(sessionQuery());

      await router.invalidate({ sync: true });
    },
  });
};
