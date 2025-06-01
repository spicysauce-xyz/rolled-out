import { config } from "@config";
import {
  inferAdditionalFields,
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const url = new URL(config.authUrl);

export const authClient = createAuthClient({
  baseURL: url.origin,
  basePath: url.pathname,
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
