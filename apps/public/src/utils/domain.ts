import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";

export const getHost = createServerFn().handler(async () => {
  return getRequestHost() || "";
});

export const getSubdomainFromHost = (host: string): string | null => {
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");

  if (parts.length >= 3) {
    return parts[parts.length - 3];
  }

  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0];
  }

  return null;
};
