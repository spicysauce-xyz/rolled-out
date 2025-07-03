import type { Api, ApiError } from "@mono/api";
import { hc } from "hono/client";
import "@tanstack/react-query";
import { config } from "@lib/config";
import { getHeaders } from "@utils/headers";

export const api = hc<Api>(config.apiUrl, {
  init: {
    credentials: "include",
  },
  headers: async () => {
    if (import.meta.env.SSR) {
      const headers = await getHeaders();

      return {
        cookie: headers.cookie ?? "",
      };
    }

    return {} as Record<string, string>;
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
