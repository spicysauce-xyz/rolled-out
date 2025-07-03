import type { BoardCreatedEvent, BoardUpdatedEvent } from "@domain/board";
import { Emitter } from "@events";
import { TagService } from "./tag.service";

Emitter.on<BoardCreatedEvent>("board.created", (payload) =>
  TagService.connectTagsToBoard(
    payload.board.organizationId,
    payload.board,
    payload.tags
  )
);

Emitter.on<BoardUpdatedEvent>("board.updated", (payload) =>
  TagService.connectTagsToBoard(
    payload.board.organizationId,
    payload.board,
    payload.tags
  )
);
