import type { BoardCreatedEvent, BoardUpdatedEvent } from "@domain/board";
import { Emitter } from "@services/events";
import { TagService } from "./tag.service";

const registerTagSubscriptions = () => {
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
};

export { registerTagSubscriptions };
