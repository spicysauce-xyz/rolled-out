import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCancelInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { invitationId: string }) => {
      const response = await authClient.organization.cancelInvitation({
        invitationId: data.invitationId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Cancelling invitation...") };
    },
    onSuccess: async (data, __, context) => {
      await queryClient.invalidateQueries(
        organizationQuery(data.organizationId)
      );

      Toaster.success("Invitation cancelled", { id: context.toastId });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to cancel invitation", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
