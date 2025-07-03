import { Database, schema } from "@database";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { notOk, ok } from "@utils/network";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import _ from "lodash";
import { applyUpdate, Doc } from "yjs";

export const PublicHandler = new Hono()
  .basePath("/:organizationSlug")
  .get("/posts", async (c) => {
    const organization = await Database.query.organization.findFirst({
      where: eq(schema.organization.slug, c.req.param("organizationSlug")),
    });

    if (!organization) {
      return notOk(
        c,
        {
          message: "Organization not found",
        },
        404
      );
    }

    const posts = await Database.query.post.findMany({
      where: and(
        eq(schema.post.organizationId, organization.id),
        eq(schema.post.status, "published")
      ),
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
      orderBy: [desc(schema.post.publishedAt)],
    });

    const mappedPosts = posts.map((post) => {
      const doc = new Doc();

      if (post.byteContent) {
        applyUpdate(doc, post.byteContent);
      }

      return {
        ..._.omit(post, "byteContent"),
        contentJSON: TiptapTransformer.fromYdoc(doc),
      };
    });

    return ok(c, mappedPosts);
  });
