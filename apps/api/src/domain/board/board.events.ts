import type { schema } from "@database";

export class BoardCreatedEvent {
  static readonly eventName = "board.created";

  constructor(
    public readonly board: typeof schema.board.$inferSelect,
    public readonly tags: string[],
  ) {}
}

export class BoardUpdatedEvent {
  static readonly eventName = "board.updated";

  constructor(
    public readonly board: typeof schema.board.$inferSelect,
    public readonly tags: string[],
  ) {}
}
