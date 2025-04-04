import type { Api } from "@mono/api";
import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

export const queryClient = new QueryClient();

export const api = hc<Api>("http://localhost:3000", {
  fetch: (
    req: string | URL | globalThis.Request,
    init: RequestInit | undefined,
  ) =>
    fetch(req, {
      ...(init ?? {}),
      credentials: "include",
    }),
});
