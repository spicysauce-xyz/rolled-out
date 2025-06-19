import { Database, schema } from "@database";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { notOk, ok } from "@utils/network";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { Hono } from "hono";
import _ from "lodash";
import * as Y from "yjs";

export const PublicHandler = new Hono().basePath("/:organizationSlug").get("/posts", async (c) => {
  const organization = await Database.query.organization.findFirst({
    where: eq(schema.organization.slug, c.req.param("organizationSlug")),
  });

  if (!organization) {
    return notOk(
      c,
      {
        message: "Organization not found",
      },
      404,
    );
  }

  const posts = await Database.select({
    id: schema.post.id,
    title: schema.post.title,
    editors: sql<Pick<typeof schema.user.$inferSelect, "id" | "name" | "image">[]>`
      coalesce(
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'id',         ${schema.user.id},
            'name',       ${schema.user.name},
            'image',  ${schema.user.image}
          )
        ) filter (where ${schema.user.id} is not null),
        '[]'::jsonb
      )
    `.as("editors"),
    tags: sql<Pick<typeof schema.tag.$inferSelect, "id" | "label">[]>`
      coalesce(
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'id',         ${schema.tag.id},
            'label',       ${schema.tag.label}
          )
        ) filter (where ${schema.tag.id} is not null),
        '[]'::jsonb
      )
    `.as("tags"),
    byteContent: schema.post.byteContent,
    publishedAt: schema.post.publishedAt,
  })
    .from(schema.post)
    .where(
      and(
        eq(schema.post.organizationId, organization.id),
        eq(schema.post.status, "published"),
        isNotNull(schema.post.publishedAt),
      ),
    )
    .leftJoin(schema.editor, eq(schema.editor.postId, schema.post.id))
    .leftJoin(schema.user, eq(schema.editor.userId, schema.user.id))
    .leftJoin(schema.postTag, eq(schema.post.id, schema.postTag.postId))
    .leftJoin(schema.tag, eq(schema.postTag.tagId, schema.tag.id))
    .orderBy(desc(schema.post.publishedAt))
    .groupBy(schema.post.id);

  const mappedPosts = posts.map((post) => {
    const doc = new Y.Doc();

    if (post.byteContent) {
      Y.applyUpdate(doc, post.byteContent);
    }

    return {
      ..._.omit(post, "byteContent"),
      contentJSON: TiptapTransformer.fromYdoc(doc),
    };
  });

  return ok(c, mappedPosts);
});
