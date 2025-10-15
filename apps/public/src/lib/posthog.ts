import { config } from "@config";
import { posthog } from "posthog-js";
import { useEffect, useState } from "react";

export const useInitializePosthog = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    posthog.init(config.posthog.key, {
      api_host: config.posthog.host,
      defaults: "2025-05-24",
    });
  }, [isHydrated]);

  return posthog;
};
