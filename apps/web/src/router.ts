import { GlobalError } from "@components/error";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./generated/router";

export const createRouter = () => {
  const queryClient = new QueryClient();

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      scrollRestoration: true,
      defaultPreload: "viewport",
      defaultPendingMinMs: 0,
      defaultPendingMs: 0,
      defaultErrorComponent: GlobalError,
    }),
    queryClient
  );
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
