import type { auth } from "@domain/auth/auth.client";
import type { app } from "./index";
import type { ApiErrorPayload } from "./utils/network";

export type Api = typeof app;
export type Auth = typeof auth;

export type ApiError = ApiErrorPayload;
