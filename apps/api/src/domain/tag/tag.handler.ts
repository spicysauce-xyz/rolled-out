import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { zValidator } from "@hono/zod-validator";
import { handleValidationError, notOk, ok } from "@utils/network";
import z from "zod";
import { TagService } from "./tag.service";

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

      const tagResult = await TagService.createTag(member, label);

      if (tagResult.isErr()) {
        return notOk(c, { message: tagResult.error.message }, 500);
      }

      return ok(c, tagResult.value);
    },
  )
  .get("/", async (c) => {
    const member = c.get("member");

    const tagsResult = await TagService.getTags(member);

    if (tagsResult.isErr()) {
      return notOk(c, { message: tagsResult.error.message }, 500);
    }

    return ok(c, tagsResult.value);
  });
