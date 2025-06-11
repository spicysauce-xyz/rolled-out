import { Database, schema } from "@database";
import { notOk, ok } from "@utils/network";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

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

  const posts = await Database.query.post.findMany({
    columns: {
      id: true,
      content: true,
      publishedAt: true,
    },
    where: and(eq(schema.post.organizationId, organization.id), eq(schema.post.status, "published")),
  });

  return ok(c, posts);
});
