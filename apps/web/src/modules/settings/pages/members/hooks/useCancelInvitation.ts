import * as Confirmer from "@components/feedback/confirmer";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  const cancelInvitationMutation = useMutation({
    mutationFn: async (data: {
      invitationId: string;
    }) => {
      const response = await authClient.organization.cancelInvitation({
        invitationId: data.invitationId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  return async (
    organizationId: string,
    invitation: { id: string; email: string },
  ) => {
    const confirmed = await Confirmer.confirm({
      title: "Cancel Invitation",
      description: `Are you sure you want to cancel invitation for ${invitation.email}?`,
      phrase: invitation.email.toLowerCase().trim(),
      action: {
        icon: Trash2Icon,
        label: "Cancel",
        color: "danger",
      },
    });

    if (!confirmed) return;

    const toastId = Toaster.loading("Cancelling invitation...");

    try {
      await cancelInvitationMutation.mutateAsync({
        invitationId: invitation.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["organization", organizationId],
      });

      Toaster.success("Invitation cancelled", { id: toastId });
    } catch {
      Toaster.error("Failed to cancel invitation", { id: toastId });
    }
  };
};
