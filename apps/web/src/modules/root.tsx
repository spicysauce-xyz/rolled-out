import { Confirmer } from "@components/confirmer";
import { Transition } from "@components/transition";
import { Toaster } from "@mono/ui";
import styles from "@styles/global.css?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

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
});

function RootComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouterState();

  useEffect(() => {
    if (route.status === "idle") {
      setIsLoading(false);
    }
  }, [route.status]);

  return (
    <RootDocument>
      <Transition.Root>
        {isLoading && (
          <Transition.Item
            className="fixed inset-0 z-50 h-svh w-screen bg-white"
            key="loader"
            transition={{
              duration: 0.3,
            }}
          />
        )}
      </Transition.Root>
      <Outlet />
      <Confirmer.Root />
      <Toaster.Root />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      {/** biome-ignore lint/style/noHeadElement: head is required */}
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
