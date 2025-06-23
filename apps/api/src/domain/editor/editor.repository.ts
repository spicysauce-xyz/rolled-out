import { Database, schema } from "@database";
import { ResultAsync } from "neverthrow";

export const EditorRepository = {
  createEditor: async (postId: string, userId: string) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.editor).values({
        postId,
        userId,
      }),
      (error) => new Error("Failed to create editor for post", { cause: error }),
    );
  },
};
