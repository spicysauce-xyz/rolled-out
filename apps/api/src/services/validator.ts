import { zValidator } from "@hono/zod-validator";
import { notOk } from "@utils/network";
import type { Context } from "hono";
import type { ValidationTargets } from "hono/types";
import _ from "lodash";
import z from "zod";

type ValidationResult =
  | { success: false; error: z.ZodError }
  | { success: true; data: unknown };

// @ts-expect-error - no need to return everywhere
export const handleValidationError = (
  result: ValidationResult,
  context: Context
) => {
  if (result.success === false && result.error instanceof z.ZodError) {
    const error = _.first(result.error.errors);

    return notOk(
      context,
      {
        message: error?.message ?? "Validation error",
        code: error?.code ?? "VALIDATION_ERROR",
      },
      400
    );
  }
};

export const validator = <
  T extends z.ZodTypeAny,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T
) => {
  return zValidator(target, schema, handleValidationError);
};
