import type { Api, ApiError } from "@mono/api";
import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import "@tanstack/react-query";
import { config } from "@config";

export const queryClient = new QueryClient();

export const api = hc<Api>(config.apiUrl, {
  init: {
    credentials: import.meta.env.PROD ? "same-origin" : "include",
  },
});

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

export type SuccessResponse<
  T extends
    | { success: true; data: unknown }
    | { success: false; error: unknown },
> = T extends { success: true } ? T["data"] : never;
