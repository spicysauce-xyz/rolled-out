import type { Auth } from "@mono/api";
import {
  inferAdditionalFields,
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  basePath: "/auth",
  plugins: [
    organizationClient(),
    magicLinkClient(),
    inferAdditionalFields<Auth>(),
  ],
});
