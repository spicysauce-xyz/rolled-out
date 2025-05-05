import type { Api, ApiError } from "@mono/api";
import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import "@tanstack/react-query";

export const queryClient = new QueryClient();

export const api = hc<Api>("http://localhost:3000", {
  init: {
    credentials: "include",
  },
});

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}
