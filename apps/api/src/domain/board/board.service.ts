import type { schema } from "@database";
import { TagService } from "@domain/tag";
import { errAsync, okAsync } from "neverthrow";
import { BoardsRepository } from "./board.repository";

export const BoardsService = {
  createBoard: async (
    member: { organizationId: string; userId: string },
    data: Pick<typeof schema.board.$inferInsert, "name" | "symbol" | "slug"> & { tags?: string[] },
  ) => {
    const insertResult = await BoardsRepository.createBoard({
      ...(data ?? {}),
      symbol: data?.symbol ?? "smile",
      organizationId: member.organizationId,
      slug: data?.slug,
    });

    if (insertResult.isErr()) {
      return errAsync(insertResult.error);
    }

    if (data.tags) {
      const tagsResult = await TagService.connectTagsToBoard(member.organizationId, insertResult.value[0], data.tags);

      if (tagsResult.isErr()) {
        return errAsync(tagsResult.error);
      }
    }

    return okAsync(insertResult.value);
  },

  getBoardById: async (member: { organizationId: string }, id: string) => {
    const result = await BoardsRepository.findBoardById(id, member.organizationId);

    if (result.isErr()) {
      return errAsync(result.error);
    }

    const board = result.value;

    if (!board) {
      return errAsync(new Error("Board not found"));
    }

    return okAsync(board);
  },

  getBoardsFromOrganization: async (member: { organizationId: string }) => {
    return BoardsRepository.findBoardsByOrganization(member.organizationId);
  },

  getBoardPosts: async (member: { organizationId: string }, boardId: string) => {
    return BoardsRepository.findBoardPosts(member.organizationId, boardId);
  },

  updateBoard: async (
    member: { organizationId: string },
    id: string,
    data: Partial<typeof schema.board.$inferInsert & { tags: string[] }>,
  ) => {
    const boardResult = await BoardsRepository.findBoardById(id, member.organizationId);

    if (boardResult.isErr()) {
      return errAsync(boardResult.error);
    }

    const board = boardResult.value;

    if (!board) {
      return errAsync(new Error("Board not found"));
    }

    const updatedBoardResult = await BoardsRepository.updateBoard(id, member.organizationId, data);

    if (data.tags) {
      const tagsResult = await TagService.connectTagsToBoard(member.organizationId, board, data.tags);

      if (tagsResult.isErr()) {
        return errAsync(tagsResult.error);
      }
    }

    if (updatedBoardResult.isErr()) {
      return errAsync(updatedBoardResult.error);
    }

    return okAsync(updatedBoardResult.value[0]);
  },
};
