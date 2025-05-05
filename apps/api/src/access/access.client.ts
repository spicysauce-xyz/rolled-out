import type { auth } from "@auth/auth.client";
import { schema } from "@database";
import { Database } from "@database";
import { and, eq } from "drizzle-orm";
import type { Action, Resource, Role } from "./access.types";

const config: Record<
  Role,
  Partial<Record<Resource, (Action | { action: Action; condition: (entity: unknown) => boolean })[]>>
> = {
  owner: {},
  admin: {
    post: ["create"],
  },
  member: {},
};

export const createAccessForUser = async (
  user: typeof auth.$Infer.Session.user,
  session: typeof auth.$Infer.Session.session,
) => {
  return async (resource: Resource, action: Action, entity: unknown = {}) => {
    if (!session.activeOrganizationId) {
      return false;
    }

    const [member] = await Database.select()
      .from(schema.member)
      .where(and(eq(schema.member.userId, user.id), eq(schema.member.organizationId, session.activeOrganizationId)));

    if (!member) {
      return false;
    }

    const roleConfig = config[member.role];

    if (!roleConfig) {
      return false;
    }

    const actionConfig = roleConfig[resource]?.find((_action) => {
      if (typeof _action === "string") {
        return _action === action;
      }

      return _action.action === action;
    });

    if (!actionConfig) {
      return false;
    }

    if (typeof actionConfig === "string") {
      return true;
    }

    return actionConfig.condition(entity);
  };
};
