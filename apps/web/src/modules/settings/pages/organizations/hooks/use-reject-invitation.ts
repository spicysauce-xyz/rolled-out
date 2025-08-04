import { invitationsQuery, organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseRejectInvitationMutationProps {
  onSuccess?: () => void;
}

export const useRejectInvitationMutation = (
  args?: UseRejectInvitationMutationProps
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await authClient.organization.rejectInvitation({
        invitationId: data.id,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Rejecting invitation...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries(invitationsQuery());

      await queryClient.invalidateQueries(organizationsQuery());

      args?.onSuccess?.();

      Toaster.success("Invitation rejected", {
        id: context.toastId,
      });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to reject invitation", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
