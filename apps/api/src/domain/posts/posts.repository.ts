import { Database, type DatabaseTransaction, schema } from "@database";
import { eq } from "drizzle-orm";

export const PostsRepository = {
  create: async (data: typeof schema.post.$inferInsert, tx?: DatabaseTransaction) => {
    const executor = tx ?? Database;

    return executor.insert(schema.post).values(data).returning();
  },
  getById: async (id: string) => {
    return Database.query.post.findFirst({ where: eq(schema.post.id, id) });
  },
  getByOrganizationId: async (organizationId: string) => {
    return Database.query.post.findMany({ where: eq(schema.post.organizationId, organizationId) });
  },
};
