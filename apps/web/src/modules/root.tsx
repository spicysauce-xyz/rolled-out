import * as Transition from "@components/transition";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import type { Session, User } from "better-auth";
import { useEffect, useRef, useState } from "react";

interface RootContext {
  auth?: {
    user: User;
    session: Session;
  };
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: Root,
});

function Root() {
  const initializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouterState();

  useEffect(() => {
    if (route.status === "idle" && !initializedRef.current) {
      initializedRef.current = true;
      setIsLoading(false);
    }
  }, [route.status]);

  return (
    <>
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
    </>
  );
}
