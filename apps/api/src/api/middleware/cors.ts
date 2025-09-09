import { Config } from "@services/config";
import { cors } from "hono/cors";

export const corsMiddleware = () => {
  return cors({
    origin: [Config.client.base],
    credentials: true,
  });
};
