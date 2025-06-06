import { config } from "@config";
import { getHeaders } from "@utils/headers";
import {
  inferAdditionalFields,
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";
import { type BetterFetchPlugin, createAuthClient } from "better-auth/react";

const url = new URL(config.authUrl);

const dynamicCookiePlugin = {
  id: "dynamic-cookie",
  name: "Dynamic Cookie",
  hooks: {
    onRequest: async (context) => {
      if (import.meta.env.SSR) {
        const headers = await getHeaders();

        return {
          ...context,
          headers: {
            ...context.headers,
            cookie: headers.cookie ?? "",
          },
        };
      }

      return context;
    },
  },
} satisfies BetterFetchPlugin;

export const authClient = createAuthClient({
  fetchOptions: {
    plugins: [dynamicCookiePlugin],
  },
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
