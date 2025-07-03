import type { schema } from "@database";
import { BoardsRepository } from "./board.repository";

export const BoardsService = {
  createBoard: (
    member: { organizationId: string },
    data: Pick<typeof schema.board.$inferInsert, "name" | "symbol" | "slug">
  ) => {
    return BoardsRepository.createBoard({
      ...(data ?? {}),
      symbol: data?.symbol ?? "smile",
      organizationId: member.organizationId,
      slug: data?.slug,
    });
  },

  getBoardById: (member: { organizationId: string }, id: string) => {
    return BoardsRepository.findBoardById(id, member.organizationId);
  },

  getBoardsFromOrganization: (member: { organizationId: string }) => {
    return BoardsRepository.findBoardsByOrganization(member.organizationId);
  },

  getBoardPosts: (member: { organizationId: string }, boardId: string) => {
    return BoardsRepository.findBoardPosts(member.organizationId, boardId);
  },

  updateBoard: (
    member: { organizationId: string },
    id: string,
    data: Partial<typeof schema.board.$inferInsert>
  ) => {
    return BoardsRepository.updateBoard(id, member.organizationId, data);
  },
};
