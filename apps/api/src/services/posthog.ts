import { type EventMessage, PostHog as PostHogClient } from "posthog-node";
import { Config } from "./config";

const client = new PostHogClient(Config.posthog.apiKey, {
  host: Config.posthog.host,
});

export const Posthog = {
  capture: (
    userId: string,
    context: { module: string; entity: string; action: string },
    event?: Omit<EventMessage, "event" | "distinctId">
  ) => {
    client.capture({
      ...(event ?? {}),
      distinctId: userId,
      event: `${context.module}.${context.entity}_${context.action}`,
    });
  },
};
