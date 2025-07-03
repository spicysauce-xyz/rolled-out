import { createMiddleware } from "hono/factory";
import { auth } from "./auth.client";

type AuthMiddleware<R extends boolean> = {
  Variables: R extends true
    ? {
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
      }
    : {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
      };
};

type AuthMiddlewareParams<R extends boolean> = {
  required: R;
};

export const authMiddleware = <R extends boolean>(
  params: AuthMiddlewareParams<R>
) => {
  return createMiddleware<AuthMiddleware<R>>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      if (params.required) {
        return c.json(
          {
            success: false,
            error: { message: "Unauthorized", code: "UNAUTHORIZED" },
          },
          401
        );
      }

      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });
};
