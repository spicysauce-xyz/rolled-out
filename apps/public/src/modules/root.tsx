import { useInitializePosthog } from "@lib/posthog";
import styles from "@styles/global.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { getHost, getSubdomainFromHost } from "@utils/domain";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "rolledout.xyz",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap",
      },
      {
        rel: "stylesheet",
        href: styles,
      },
    ],
  }),
  component: RootComponent,
  beforeLoad: async () => {
    let host = "";

    if (import.meta.env.SSR) {
      host = await getHost();
    } else {
      host = window.location.host;
    }

    return {
      subdomain: getSubdomainFromHost(host),
    };
  },
});

function RootComponent() {
  const posthog = useInitializePosthog();

  useEffect(() => {
    posthog.captureException(new Error("Test error"));
  }, [posthog]);

  return (
    <html lang="en">
      {/** biome-ignore lint/style/noHeadElement: actually needed */}
      <head>
        <HeadContent />
      </head>
      <body>
        <PostHogProvider client={posthog}>
          <Outlet />
        </PostHogProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
