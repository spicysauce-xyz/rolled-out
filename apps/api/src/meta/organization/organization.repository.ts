import { Database, type DatabaseTransaction, schema } from "@database";
import { eq } from "drizzle-orm";

export const OrganizationRepository = {
  create: async (data: typeof schema.organization.$inferInsert, tx?: DatabaseTransaction) => {
    const executor = tx ?? Database;

    return executor.insert(schema.organization).values(data).returning();
  },
  getByMemberId: async (memberId: string) => {
    return Database.select({
      id: schema.organization.id,
      slug: schema.organization.slug,
      name: schema.organization.name,
      logo: schema.organization.logo,
      createdAt: schema.organization.createdAt,
      updatedAt: schema.organization.updatedAt,
    })
      .from(schema.organization)
      .leftJoin(schema.member, eq(schema.organization.id, schema.member.organizationId))
      .where(eq(schema.member.userId, memberId));
  },
  getById: async (id: string) => {
    return Database.query.organization.findFirst({
      where: eq(schema.organization.id, id),
    });
  },
  getBySlug: async (slug: string) => {
    return Database.query.organization.findFirst({
      where: eq(schema.organization.slug, slug),
    });
  },
};
