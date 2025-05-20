import * as Confirmer from "@components/feedback/confirmer";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      await authClient.signOut();

      await queryClient.invalidateQueries({ queryKey: ["session"] });

      setTimeout(async () => {
        await router.invalidate();
      });

      Toaster.success("Logged out successfully", { id: toastId });
    } catch {
      Toaster.error("Failed to log out", { id: toastId });
    }
  };
};
