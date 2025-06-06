import * as Confirmer from "@components/feedback/confirmer";
import { sessionQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = await authClient.signOut();

      if (response.error) {
        throw response.error;
      }

      return response;
    },
  });

  return async () => {
    const confirmed = await Confirmer.confirm({
      title: "Logout",
      description: "Are you sure you want to logout?",
      action: {
        icon: LogOutIcon,
        label: "Logout",
        color: "danger",
      },
    });

    if (!confirmed) return;

    const toastId = Toaster.loading("Logging out...");

    try {
      await signOutMutation.mutateAsync();

      await queryClient.refetchQueries(sessionQuery());

      await router.invalidate({ sync: true });

      Toaster.success("Logged out successfully", { id: toastId });
    } catch {
      Toaster.error("Failed to log out", { id: toastId });
    }
  };
};
