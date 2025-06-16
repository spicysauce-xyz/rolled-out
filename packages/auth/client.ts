import {
  inferAdditionalFields,
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";
import { type BetterFetchPlugin, createAuthClient } from "better-auth/react";

interface Params {
  baseURL: string;
  basePath: string;
  fetchPlugins: BetterFetchPlugin[];
}

export const createClientAuth = (params: Params) =>
  createAuthClient({
    fetchOptions: {
      plugins: params.fetchPlugins,
    },
    baseURL: params.baseURL,
    basePath: params.basePath,
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
