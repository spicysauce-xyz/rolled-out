import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInviteMember = () => {
  const queryClient = useQueryClient();

  const inviteMemberMutation = useMutation({
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
  });

  // TODO: Update member types here
  return async (
    organizationId: string,
    email: string,
    role: "member" | "admin" | "owner",
  ) => {
    const toastId = Toaster.loading("Inviting member...");

    try {
      const invitation = await inviteMemberMutation.mutateAsync({
        organizationId,
        email,
        role,
      });

      await queryClient.invalidateQueries({
        queryKey: ["organization", organizationId],
      });

      Toaster.success("Member invited", { id: toastId });

      return invitation;
    } catch {
      Toaster.error("Failed to invite member", { id: toastId });
      return null;
    }
  };
};
