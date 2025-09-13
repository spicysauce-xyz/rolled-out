import { Database, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export const MemberRepository = {
  findMemberById: (id: string) => {
    return ResultAsync.fromPromise(
      Database.query.member.findFirst({ where: eq(schema.member.id, id) }),
      () => new Error("Failed to find member")
    ).andThen((member) => {
      if (!member) {
        return errAsync(new Error("Member not found"));
      }
      return okAsync(member);
    });
  },
  findMembersByOrganizationId: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.member.findMany({
        where: eq(schema.member.organizationId, organizationId),
        columns: {
          id: true,
          userId: true,
          organizationId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      }),
      () => new Error("Failed to find members")
    );
  },
  createMember: (data: typeof schema.member.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.member).values(data).returning(),
      () => new Error("Failed to create member")
    );
  },
  deleteMemberById: (id: string) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.member)
        .where(eq(schema.member.id, id))
        .returning(),
      () => new Error("Failed to delete member")
    ).andThen((member) => {
      if (!member) {
        return errAsync(new Error("Member not found"));
      }
      return okAsync(member);
    });
  },
  updateMemberById: (
    id: string,
    data: Pick<typeof schema.member.$inferInsert, "role">
  ) => {
    return ResultAsync.fromPromise(
      Database.update(schema.member)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(schema.member.id, id))
        .returning(),
      () => new Error("Failed to update member")
    ).andThen((member) => {
      if (!member) {
        return errAsync(new Error("Member not found"));
      }
      return okAsync(member);
    });
  },
};
