import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import type { Session, User } from "better-auth";
import { AnimatePresence, motion } from "motion/react";

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
  const route = useRouterState();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {route.status === "idle" ? (
        <motion.div key="app" {...animation}>
          <Outlet />
        </motion.div>
      ) : (
        <motion.div
          key="loader"
          {...animation}
          className="h-svh w-screen bg-white"
        />
      )}
    </AnimatePresence>
  );
}
