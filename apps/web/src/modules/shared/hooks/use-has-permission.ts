import { authClient } from "@lib/auth";
import { useQuery } from "@tanstack/react-query";

type Permission = Parameters<
  typeof authClient.organization.hasPermission
>[0]["permission"];

export const useHasPermission = (args: {
  organizationId: string;
  permission: Permission;
}) => {
  const { data, isPending } = useQuery({
    queryKey: ["permission", args.organizationId, args.permission] as const,
    queryFn: async ({ queryKey }) => {
      const response = await authClient.organization.hasPermission({
        organizationId: queryKey[1],
        permission: queryKey[2],
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  return {
    hasPermission: Boolean(data?.success),
    isPending,
  };
};
