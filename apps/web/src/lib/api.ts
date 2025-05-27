import type { Api, ApiError } from "@mono/api";
import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import "@tanstack/react-query";

export const queryClient = new QueryClient();

export const { api } = hc<Api>(`https://${import.meta.env.VITE_DOMAIN}`, {
  init: {
    credentials: "include",
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
