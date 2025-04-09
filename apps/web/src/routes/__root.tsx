import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import type { Session, User } from "better-auth";
import { AnimatePresence, delay, motion } from "motion/react";
import React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface RootContext {
  auth?: {
    user: User;
    session: Session;
  };
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: Root,
});

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

function Root() {
  const initializedRef = useRef(false);
  const [showApp, setShowApp] = useState(false);
  const route = useRouterState();

  useEffect(() => {
    if (route.status === "idle" && !initializedRef.current) {
      console.log("idle", Date.now());
      initializedRef.current = true;
      setShowApp(true);
    }
  }, [route.status]);

  return (
    <>
      <AnimatePresence initial={false}>
        {!showApp && (
          <motion.div
            key="loader"
            {...animation}
            className="fixed inset-0 z-50 h-svh w-screen bg-white"
          />
        )}
      </AnimatePresence>
      <Outlet />
    </>
  );
}
