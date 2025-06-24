import type { SuccessResponse, api } from "@lib/api";
import type { InferResponseType } from "hono/client";

export type Update = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["posts"]["$get"]
  >
>[number];
