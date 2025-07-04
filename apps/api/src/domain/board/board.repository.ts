import { Database, schema } from "@database";
import { and, desc, eq, exists, sql } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "pg";

export const BoardsRepository = {
  createBoard: async (data: typeof schema.board.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.board)
        .values({
          organizationId: data.organizationId,
          name: data.name,
          symbol: data.symbol,
          slug: data.slug,
        })
        .returning(),
      (error) => {
        if (error instanceof DatabaseError) {
          if (error.constraint === "board_slug_unique") {
            return new Error("Board slug already taken", { cause: error });
          }
        }

        return new Error("Failed to create board", { cause: error });
      },
    );
  },

  findBoardById: async (id: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.board.findFirst({
        where: and(eq(schema.board.id, id), eq(schema.board.organizationId, organizationId)),
        with: {
          tags: true,
        },
      }),
      (error) => new Error("Failed to get board by id", { cause: error }),
    );
  },

  findBoardBySlug: async (slug: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.board.findFirst({
        where: and(eq(schema.board.slug, slug), eq(schema.board.organizationId, organizationId)),
      }),
      (error) => new Error("Failed to get board by slug", { cause: error }),
    );
  },

  findBoardsByOrganization: async (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.select({
        id: schema.board.id,
        name: schema.board.name,
        symbol: schema.board.symbol,
        createdAt: schema.board.createdAt,
        postCount: sql<number>`count(distinct ${schema.post.id})::int`.as("post_count"),
      })
        .from(schema.board)
        .leftJoin(schema.boardTag, eq(schema.boardTag.boardId, schema.board.id))
        .leftJoin(schema.postTag, eq(schema.postTag.tagId, schema.boardTag.tagId))
        .leftJoin(schema.post, and(eq(schema.post.id, schema.postTag.postId), eq(schema.post.status, "published")))
        .where(eq(schema.board.organizationId, organizationId))
        .groupBy(schema.board.id)
        .orderBy(desc(schema.board.createdAt)),
      (error) => new Error("Failed to get boards from organization", { cause: error }),
    );
  },

  findBoardPosts: async (organizationId: string, boardId: string) => {
    return ResultAsync.fromPromise(
      Database.query.post.findMany({
        columns: {
          id: true,
          title: true,
          status: true,
          order: true,
          createdAt: true,
          updatedAt: true,
          archivedAt: true,
          publishedAt: true,
        },
        with: {
          editors: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          tags: {
            with: {
              tag: {
                columns: {
                  id: true,
                  label: true,
                },
              },
            },
          },
        },
        where: and(
          eq(schema.post.organizationId, organizationId),
          eq(schema.post.status, "published"),
          exists(
            Database.select()
              .from(schema.postTag)
              .innerJoin(schema.boardTag, eq(schema.postTag.tagId, schema.boardTag.tagId))
              .where(and(eq(schema.postTag.postId, schema.post.id), eq(schema.boardTag.boardId, boardId))),
          ),
        ),
        orderBy: [desc(schema.post.updatedAt)],
      }),
      (error) => new Error("Failed to get posts for board", { cause: error }),
    );
  },

  updateBoard: async (id: string, organizationId: string, data: Partial<typeof schema.board.$inferInsert>) => {
    return ResultAsync.fromPromise(
      Database.update(schema.board)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(schema.board.id, id), eq(schema.board.organizationId, organizationId)))
        .returning(),
      (error) => new Error("Failed to update board", { cause: error }),
    );
  },
};
