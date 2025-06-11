import { createServerFn } from "@tanstack/react-start";
import { getHeaders as getTanstackHeaders } from "@tanstack/react-start/server";

export const getHeaders = createServerFn().handler(async () => {
  return getTanstackHeaders() || {};
});
