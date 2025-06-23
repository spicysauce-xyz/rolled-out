import * as Confirmer from "@components/feedback/confirmer";
import * as Transition from "@components/transition";
import { Toaster } from "@mono/ui";
import styles from "@styles/global.css?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

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
        title: "Title",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
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
            key="loader"
            className="fixed inset-0 z-50 h-svh w-screen bg-white"
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
