import { type ToOptions, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export const useGoBack = (fallback?: ToOptions) => {
  const router = useRouter();

  return useCallback(() => {
    if (router.history.canGoBack()) {
      router.history.back();
      return;
    }

    if (fallback) {
      router.navigate(fallback);
    }
  }, [router, fallback]);
};
