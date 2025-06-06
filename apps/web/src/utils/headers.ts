import { createServerFn } from "@tanstack/react-start";
import { getHeaders as getVinxiHeaders } from "vinxi/http";

export const getHeaders = createServerFn().handler(async () => {
  return getVinxiHeaders() || {};
});
