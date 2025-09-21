import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const ok = <T>(
  c: Context,
  data: T,
  status: ContentfulStatusCode = 200
) => {
  return c.json({ success: true, data }, status);
};

export const okWithMeta = <T, U>(
  c: Context,
  data: T,
  meta: U,
  status: ContentfulStatusCode = 200
) => {
  return c.json({ success: true, data, meta }, status);
};

export type ApiErrorPayload = { message: string; code?: string };

export const notOk = <T extends ApiErrorPayload>(
  c: Context,
  error: T,
  status: ContentfulStatusCode
) => {
  return c.json(
    {
      success: false,
      error,
    },
    status
  );
};
