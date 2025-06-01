import "./app.css";
import { config } from "@config";
import { Toaster } from "@mono/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import * as Confirmer from "./components/feedback/confirmer";
import { routeTree } from "./generated/router";
import { queryClient } from "./lib/api";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingMinMs: 0,
  scrollRestoration: true,
  scrollRestorationBehavior: "smooth",
  defaultHashScrollIntoView: { behavior: "smooth" },
  basepath: config.basepath,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Root = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Confirmer.Root />
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
