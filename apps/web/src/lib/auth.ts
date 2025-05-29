import { config } from "@config";
import {
  inferAdditionalFields,
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: config.api.url,
  basePath: "/api/auth",
  plugins: [
    organizationClient(),
    magicLinkClient(),
    inferAdditionalFields({
      user: {
        onboarded: {
          type: "boolean",
          required: false,
          defaultValue: false,
        },
      },
    }),
  ],
});
