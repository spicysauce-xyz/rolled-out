import { Database, schema } from "@database";
import { desc, eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "pg";

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
      }),
      (error) => new Error("Failed to get tags", { cause: error }),
    );
  },
};
