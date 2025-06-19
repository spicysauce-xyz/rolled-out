import { Database, schema } from "@database";
import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { zValidator } from "@hono/zod-validator";
import { handleValidationError, notOk, ok } from "@utils/network";
import { desc, eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import z from "zod";

export const TagHandler = organizationFactory
  .createApp()
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        label: z
          .string()
          .min(3, "Tag must be at least 3 characters long")
          .max(20, "Tag must be less than 20 characters long"),
      }),
      handleValidationError,
    ),
    async (c) => {
      const member = c.get("member");

      const { label } = c.req.valid("json");

      try {
        const tag = await Database.insert(schema.tag)
          .values({ label, organizationId: member.organizationId })
          .returning();

        return ok(c, tag);
      } catch (error) {
        if (error instanceof DatabaseError) {
          if (error.constraint === "tag_organization_id_label_unique") {
            return notOk(
              c,
              {
                code: "TAG_ALREADY_EXISTS",
                message: "Tag already exists",
              },
              400,
            );
          }
        }

        throw error;
      }
    },
  )
  .get("/", async (c) => {
    const member = c.get("member");

    const tags = await Database.query.tag.findMany({
      where: eq(schema.tag.organizationId, member.organizationId),
      orderBy: [desc(schema.tag.createdAt)],
    });

    return ok(c, tags);
  });
