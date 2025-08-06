import { api } from "@lib/api";
import { notificationsStatusQuery } from "@lib/api/queries";
import type { useDisclosure } from "@mono/ui/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Args {
  disclosure: ReturnType<typeof useDisclosure>;
}

export const useMarkAsReadOnClose = (args: Args) => {
  const { disclosure } = args;
  const queryClient = useQueryClient();

  const markNotificationsAsRead = useMutation({
    mutationFn: async () => {
      const response = await api.notifications.status.$put();

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onMutate: () => {
      const previousNotificationsStatus = queryClient.getQueryData(
        notificationsStatusQuery().queryKey
      );

      queryClient.setQueryData(notificationsStatusQuery().queryKey, (old) => ({
        unreadCount: 0,
        count: old?.count ?? 0,
        lastReadAt: new Date().toISOString(),
      }));

      return { previousNotificationsStatus };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        notificationsStatusQuery().queryKey,
        context?.previousNotificationsStatus
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationsStatusQuery().queryKey,
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
