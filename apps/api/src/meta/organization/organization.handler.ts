import { ok } from "@api";
import { authMiddleware } from "@auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { DatabaseError } from "pg";
import { z } from "zod";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";

export const Organization = new Hono()
  .post(
    "/",
    zValidator("json", z.object({ slug: z.string(), name: z.string() })),
    authMiddleware({ required: true }),
    async (c) => {
      const user = c.get("user");
      const body = c.req.valid("json");

      try {
        const { organization } = await OrganizationService.createOrganization(user.id, {
          slug: body.slug,
          name: body.name,
        });

        return c.json(organization, 201);
      } catch (error) {
        if (error instanceof DatabaseError) {
          if (error.constraint === "organization_slug_unique") {
            return c.json({ error: "Organization with this slug already exists" }, 400);
          }
        }

        return c.json({ error: "Failed to create organization" }, 500);
      }
    },
  )
  .get("/", authMiddleware({ required: true }), async (c) => {
    const user = c.get("user");

    const organizations = await OrganizationRepository.getByMemberId(user.id);

    return ok(c, organizations);
  });
