import type { schema } from "@services/db";

export class BoardCreatedEvent {
  static readonly eventName = "board.created";

  constructor(
    readonly board: typeof schema.board.$inferSelect,
    readonly tags: string[]
  ) {}
}

export class BoardUpdatedEvent {
  static readonly eventName = "board.updated";

  constructor(
    readonly board: typeof schema.board.$inferSelect,
    readonly tags: string[]
  ) {}
}
