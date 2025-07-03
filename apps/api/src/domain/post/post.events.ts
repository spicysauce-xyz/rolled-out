import type { schema } from "@database";

export class PostCreatedEvent {
  static readonly eventName = "post.created";

  constructor(
    readonly post: typeof schema.post.$inferSelect,
    readonly member: typeof schema.member.$inferSelect
  ) {}
}
