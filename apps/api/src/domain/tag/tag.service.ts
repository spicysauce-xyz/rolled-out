import { Database, schema } from "@database";
import { and, countDistinct, desc, eq } from "drizzle-orm";
import { err, errAsync, ok, ResultAsync } from "neverthrow";
import { DatabaseError } from "pg";
import { TagRepository } from "./tag.repository";

export const TagService = {
  createTag: (member: { organizationId: string }, label: string) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.tag)
        .values({ label, organizationId: member.organizationId })
        .returning(),
      (error) => {
        if (
          error instanceof DatabaseError &&
          error.constraint === "tag_organization_id_label_unique"
        ) {
          return new Error("Tag already exists", { cause: error });
        }
        return new Error("Failed to create tag", { cause: error });
      }
    ).andThen(([tag]) => {
      if (!tag) {
        return err(new Error("Tag not created"));
      }

      return ok(tag);
    });
  },
  getTags: (member: { organizationId: string }) => {
    return ResultAsync.fromPromise(
      Database.select({
        id: schema.tag.id,
        label: schema.tag.label,
        postsCount: countDistinct(schema.post.id),
      })
        .from(schema.tag)
        .where(
          eq(schema.tag.organizationId, member.organizationId)
        )
        .leftJoin(schema.postTag, eq(schema.tag.id, schema.postTag.tagId))
        .leftJoin(
          schema.post,
          and(
            eq(schema.postTag.postId, schema.post.id),
            eq(schema.post.status, "published")
          )
        )
        .groupBy(schema.tag.id)
        .orderBy(desc(schema.tag.createdAt)),
      (error) => new Error("Failed to get tags", { cause: error })
    );
  },
  connectTagsToBoard: (
    organizationId: string,
    board: { id: string; organizationId: string },
    tags: string[]
  ) => {
    if (board.organizationId !== organizationId) {
      return errAsync(new Error("Board does not belong to organization"));
    }

    return ResultAsync.fromPromise(
      Database.transaction(async (tx) => {
        await TagRepository.deleteBoardTags(board.id, { tx });

        if (tags.length > 0) {
          await TagRepository.insertBoardTags(board.id, tags, { tx });
        }
      }),
      (error) => new Error("Failed to connect tags to board", { cause: error })
    );
  },
};
