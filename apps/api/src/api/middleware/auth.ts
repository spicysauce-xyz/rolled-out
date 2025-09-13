import { auth } from "@services/auth";
import type { User } from "@services/db";
import { notOk } from "@utils/network";
import { createMiddleware } from "hono/factory";

export type AuthMiddleware<R extends boolean> = {
  Variables: R extends true
    ? {
        user: User;
        session: typeof auth.$Infer.Session.session;
      }
    : {
        user: User | null;
        session: typeof auth.$Infer.Session.session | null;
      };
};

type AuthMiddlewareParams<R extends boolean> = {
  required: R;
};

export const authMiddleware = <R extends boolean = true>(
  params?: AuthMiddlewareParams<R>
) => {
  const required = params?.required ?? true;

  return createMiddleware<AuthMiddleware<R>>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      if (required) {
        return notOk(c, { message: "Unauthorized", code: "UNAUTHORIZED" }, 401);
      }

      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user as AuthMiddleware<R>["Variables"]["user"]);
    c.set("session", session.session);
    return next();
  });
};
