import type { api, SuccessResponse } from "@lib/api";
import type { InferResponseType } from "hono";

export type Tag = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["tags"]["$get"]
  >
>[number];
