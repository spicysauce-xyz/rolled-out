import { Database, schema } from "@database";
import { err, ok, ResultAsync } from "neverthrow";

export const EditorRepository = {
  createEditor: (postId: string, userId: string) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.editor)
        .values({
          postId,
          userId,
        })
        .returning(),
      (error) => new Error("Failed to create editor for post", { cause: error })
    ).andThen(([editor]) => {
      if (!editor) {
        return err(new Error("Editor not created"));
      }

      return ok(editor);
    });
  },
};
