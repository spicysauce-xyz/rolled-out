import { invitationsQuery, organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAcceptInvitationMutationProps {
  onSuccess?: () => void;
}

export const useAcceptInvitationMutation = (
  args?: UseAcceptInvitationMutationProps
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await authClient.organization.acceptInvitation({
        invitationId: data.id,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Accepting invitation...") };
    },
    onSuccess: async (data, __, context) => {
      await queryClient.invalidateQueries(organizationsQuery());

      queryClient.setQueryData(invitationsQuery().queryKey, (old) => {
        return old?.filter((item) => item.id !== data.invitation.id);
      });

      args?.onSuccess?.();

      Toaster.success(`You've joined the organization`, {
        id: context.toastId,
      });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to accept invitation", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
