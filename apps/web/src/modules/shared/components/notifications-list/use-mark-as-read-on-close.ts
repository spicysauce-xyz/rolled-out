import { api } from "@lib/api";
import { notificationsStatusQuery } from "@lib/api/queries";
import type { useDisclosure } from "@mono/ui/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Args {
  organizationId: string;
  disclosure: ReturnType<typeof useDisclosure>;
}

export const useMarkAsReadOnClose = (args: Args) => {
  const { disclosure, organizationId } = args;
  const queryClient = useQueryClient();

  const markNotificationsAsRead = useMutation({
    mutationFn: async () => {
      const response = await api.organizations[
        ":organizationId"
      ].notifications.status.$put({
        param: {
          organizationId,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }
    },
    onMutate: () => {
      const previousNotificationsStatus = queryClient.getQueryData(
        notificationsStatusQuery(organizationId).queryKey
      );

      queryClient.setQueryData(
        notificationsStatusQuery(organizationId).queryKey,
        (old) => ({
          unreadCount: 0,
          count: old?.count ?? 0,
          lastReadAt: new Date().toISOString(),
        })
      );

      return { previousNotificationsStatus };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        notificationsStatusQuery(organizationId).queryKey,
        context?.previousNotificationsStatus
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationsStatusQuery(organizationId).queryKey,
      });
    },
  });

  return (open: boolean) => {
    if (!open) {
      markNotificationsAsRead.mutate();
    }

    disclosure.setOpen(open);
  };
};
