import { config } from "@config";
import { createClientAuth } from "@mono/auth/client";
import { getHeaders } from "@utils/headers";

const url = new URL(config.authUrl);

export const authClient = createClientAuth({
  fetchPlugins: [
    {
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
    },
  ],
  baseURL: url.origin,
  basePath: url.pathname,
});
