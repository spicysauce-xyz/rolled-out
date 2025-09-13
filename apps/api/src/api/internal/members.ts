import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validator } from "@services/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import { MemberService } from "../../domain/member/member.service";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const MembersRouter = new Hono<{ Variables: Variables }>()

  .get("/", (c) => {
    const member = c.get("member");

    return MemberService.findMembersByOrganizationId(
      member,
      member.organizationId
    ).match(
      (data) => ok(c, data),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const member = c.get("member");

    return MemberService.deleteMemberById(member, id).match(
      (data) => ok(c, data),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put(
    "/:id",
    validator("json", z.object({ role: z.enum(["member", "admin", "owner"]) })),
    (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const member = c.get("member");

      return MemberService.updateMemberById(member, id, body).match(
        (data) => ok(c, data),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
