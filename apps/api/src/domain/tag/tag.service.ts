import { Database, schema } from "@database";
import { desc, eq } from "drizzle-orm";
import { ResultAsync, errAsync } from "neverthrow";
import { DatabaseError } from "pg";
import { TagRepository } from "./tag.repository";

export const TagService = {
  createTag: async (member: { organizationId: string }, label: string) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.tag).values({ label, organizationId: member.organizationId }).returning(),
      (error) => {
        if (error instanceof DatabaseError) {
          if (error.constraint === "tag_organization_id_label_unique") {
            return new Error("Tag already exists", { cause: error });
          }
        }
        return new Error("Failed to create tag", { cause: error });
      },
    );
  },
  getTags: async (member: { organizationId: string }) => {
    return ResultAsync.fromPromise(
      Database.query.tag.findMany({
        where: eq(schema.tag.organizationId, member.organizationId),
        orderBy: [desc(schema.tag.createdAt)],
        with: {
          posts: true,
        },
      }),
      (error) => new Error("Failed to get tags", { cause: error }),
    );
  },
  connectTagsToBoard: async (organizationId: string, board: { id: string; organizationId: string }, tags: string[]) => {
    if (board.organizationId !== organizationId) {
      return errAsync(new Error("Board does not belong to organization"));
    }

    return ResultAsync.fromPromise(
      Database.transaction(async (tx) => {
        await TagRepository.deleteBoardTags(board.id, { tx });
        await TagRepository.insertBoardTags(board.id, tags, { tx });
      }),
      (error) => new Error("Failed to connect tags to board", { cause: error }),
    );
  },
};
