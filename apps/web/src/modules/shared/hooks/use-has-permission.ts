import type { authClient } from "@lib/auth";

type Permission = Parameters<
  typeof authClient.organization.hasPermission
>[0]["permission"];

export const useHasPermission = (_: {
  organizationId: string;
  permission: Permission;
}) => {
  return {
    hasPermission: true,
    isPending: false,
  };
};
