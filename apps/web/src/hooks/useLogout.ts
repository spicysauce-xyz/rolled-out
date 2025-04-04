import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "../lib/auth";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["session"] });
          setTimeout(async () => {
            await router.invalidate();
          });
        },
      },
    });
  };
};
