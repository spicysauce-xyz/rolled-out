import { organizationQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// const confirmed = await Confirmer.confirm({
//   title: "Remove Member",
//   description: `Are you sure you want to remove ${member.user.name} from the organization?`,
//   phrase: member.user.name.toLowerCase().replaceAll(" ", "-").trim(),
//   action: {
//     icon: Trash2Icon,
//     label: "Remove",
//     color: "danger",
//   },
// });

// if (!confirmed) return;

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      memberId: string;
      organizationId: string;
    }) => {
      const response = await authClient.organization.removeMember({
        organizationId: data.organizationId,
        memberIdOrEmail: data.memberId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data.member;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Removing member...") };
    },
    onSuccess: async (data, __, context) => {
      await queryClient.invalidateQueries(
        organizationQuery(data.organizationId),
      );

      Toaster.success("Member removed", { id: context.toastId });
    },
    onError: (_, __, context) => {
      if (context) {
        Toaster.error("Failed to remove member", { id: context.toastId });
      }
    },
  });
};
