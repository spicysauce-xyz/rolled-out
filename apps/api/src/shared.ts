import type { ApiErrorPayload } from "./api/api.utils";
import type { auth } from "./auth/auth.client";
import type { app } from "./index";

export type Api = typeof app;
export type Auth = typeof auth;

export type ApiError = ApiErrorPayload;
