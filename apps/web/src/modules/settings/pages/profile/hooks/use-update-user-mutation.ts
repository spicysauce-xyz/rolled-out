import { sessionQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
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
    onMutate: () => {
      return { toastId: Toaster.loading("Updating user...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.refetchQueries(sessionQuery());

      await router.invalidate({ sync: true });

      Toaster.success("Account updated successfully!", { id: context.toastId });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to update profile", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
