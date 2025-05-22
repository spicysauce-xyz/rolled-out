import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized")({
  component: Outlet,
  beforeLoad: ({ location, context }) => {
    if (!context.auth?.session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    return {
      auth: context.auth,
    };
  },
});
