import * as Transition from "@components/transition";
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createRootRoute({
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
