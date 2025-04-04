import { useCallback, useMemo, useSyncExternalStore } from "react";

const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

interface UseScreenBreakpointProps {
  type?: "min" | "max";
  breakpoint: keyof typeof breakpoints;
}

export const useScreenBreakpoint = (data: UseScreenBreakpointProps) => {
  const query = useMemo(() => {
    const inclusive = data.type === "min";
    let breakpoint: string = breakpoints[data.breakpoint] ?? data.breakpoint;

    if (!inclusive) {
      breakpoint = `calc(${breakpoint} - 1px)`;
    }

    return `(${data.type === "min" ? "min-width" : "max-width"}: ${breakpoint})`;
  }, [data.breakpoint, data.type]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot);
};
