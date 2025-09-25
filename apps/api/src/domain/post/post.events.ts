import type { schema } from "@services/db";

export class ScheduledPostPublishedEvent {
  static readonly eventName = "post.published:scheduled";

  constructor(
    readonly post: typeof schema.post.$inferSelect,
    readonly organizationId: string
  ) {}
}
