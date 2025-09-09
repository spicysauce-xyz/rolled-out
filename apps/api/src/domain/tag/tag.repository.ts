import { Database, type DatabaseTransaction, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

interface MutableActionOptions {
  tx?: DatabaseTransaction;
}

export const TagRepository = {
  deleteBoardTags: (boardId: string, options?: MutableActionOptions) => {
    const executor = options?.tx ?? Database;

    return ResultAsync.fromPromise(
      executor
        .delete(schema.boardTag)
        .where(eq(schema.boardTag.boardId, boardId)),
      (error) => new Error("Failed to delete board tags", { cause: error })
    );
  },
  insertBoardTags: (
    boardId: string,
    tagIds: string[],
    options?: MutableActionOptions
  ) => {
    const executor = options?.tx ?? Database;

    return ResultAsync.fromPromise(
      executor
        .insert(schema.boardTag)
        .values(tagIds.map((tagId) => ({ boardId, tagId }))),
      (error) => new Error("Failed to insert board tags", { cause: error })
    );
  },
};
