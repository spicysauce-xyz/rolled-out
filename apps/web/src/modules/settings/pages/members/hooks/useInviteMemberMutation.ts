import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseInviteMemberMutationProps {
  onSuccess?: () => void;
}

export const useInviteMemberMutation = (
  args?: UseInviteMemberMutationProps,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      organizationId: string;
      // TODO: Update member types here
      role: "member" | "admin" | "owner";
    }) => {
      const response = await authClient.organization.inviteMember({
        organizationId: data.organizationId,
        email: data.email,
        role: data.role,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Inviting member...") };
    },
    onSuccess: async (data, __, context) => {
      await queryClient.invalidateQueries(
        organizationQuery(data.organizationId),
      );

      args?.onSuccess?.();

      Toaster.success("Member invited", { id: context.toastId });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to invite member", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
