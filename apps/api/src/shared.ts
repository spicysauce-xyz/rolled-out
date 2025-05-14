import type { app } from "./index";
import type { ApiErrorPayload } from "./utils/network";

export type Api = typeof app;

export type ApiError = ApiErrorPayload;
