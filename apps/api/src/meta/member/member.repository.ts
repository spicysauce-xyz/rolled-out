import { Database, type DatabaseTransaction, schema } from "@database";

export const MemberRepository = {
  create: async (data: typeof schema.member.$inferInsert, tx?: DatabaseTransaction) => {
    const executor = tx ?? Database;

    return executor.insert(schema.member).values(data).returning();
  },
};
