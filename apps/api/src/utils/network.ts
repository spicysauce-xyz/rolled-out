import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import _ from "lodash";
import z from "zod";

export const ok = <T>(c: Context, data: T, status: ContentfulStatusCode = 200) => {
  return c.json({ success: true, data }, status);
};

export type ApiErrorPayload = { message: string; code?: string };

export const notOk = <T extends ApiErrorPayload>(c: Context, error: T, status: ContentfulStatusCode) => {
  return c.json(
    {
      success: false,
      error,
    },
    status,
  );
};

type ValidationResult = { success: false; error: z.ZodError } | { success: true; data: unknown };

// @ts-expect-error - no need to return everywhere
export const handleValidationError = (result: ValidationResult, context: Context) => {
  if (result.success === false && result.error instanceof z.ZodError) {
    const error = _.first(result.error.errors);

    return notOk(
      context,
      {
        message: error?.message ?? "Validation error",
        code: error?.code ?? "VALIDATION_ERROR",
      },
      400,
    );
  }
};
