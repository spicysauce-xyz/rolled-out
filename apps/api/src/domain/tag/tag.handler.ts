import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { validator } from "@lib/validator";
import { notOk, ok } from "@utils/network";
import z from "zod";
import { TagService } from "./tag.service";

export const TagHandler = organizationFactory
  .createApp()
  .post(
    "/",
    validator(
      "json",
      z.object({
        label: z
          .string()
          .min(3, "Tag must be at least 3 characters long")
          .max(20, "Tag must be less than 20 characters long"),
      })
    ),
    (c) => {
      const member = c.get("member");

      const { label } = c.req.valid("json");

      return TagService.createTag(member, label).match(
        (tag) => ok(c, tag),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )
  .get("/", (c) => {
    const member = c.get("member");

    return TagService.getTags(member).match(
      (tags) => ok(c, tags),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
