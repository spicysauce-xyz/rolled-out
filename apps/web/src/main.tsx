import "./main.css";
import { Toaster } from "@mono/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { scan } from "react-scan";
import { Confirmer } from "./components/feedback/confirmer";
import { routeTree } from "./generated/router";
import { useSession } from "./hooks/useSession";
import { queryClient } from "./lib/api";

scan({
  enabled: import.meta.env.DEV,
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingMinMs: 0,
  scrollRestoration: true,
  scrollRestorationBehavior: "smooth",
  defaultHashScrollIntoView: { behavior: "smooth" },
  context: {
    auth: undefined,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Root = () => {
  const { data, isFetched } = useSession();

  if (!isFetched) {
    return null;
  }

  return (
    <>
      <RouterProvider
        router={router}
        context={{ auth: data?.data ?? undefined }}
      />
      <Confirmer />
      <Toaster.Root />
    </>
  );
};

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
