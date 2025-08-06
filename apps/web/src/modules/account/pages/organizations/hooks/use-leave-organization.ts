import { organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseLeaveOrganizationMutationProps {
  onSuccess?: () => void;
}

export const useLeaveOrganizationMutation = (
  args?: UseLeaveOrganizationMutationProps
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await authClient.organization.leave({
        organizationId: data.id,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Leaving organization...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries(organizationsQuery());

      args?.onSuccess?.();

      Toaster.success("You've left the organization", {
        id: context.toastId,
      });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Failed to leave organization", {
          description: error.message,
          id: context?.toastId,
        });
      }
    },
  });
};
