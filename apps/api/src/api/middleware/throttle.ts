import { createMiddleware } from "hono/factory";

export const throttleDevEnvironment = (min: number, max: number) =>
  createMiddleware(async (_, next) => {
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * (max - min) + min)
      );
    }
    await next();
  });
