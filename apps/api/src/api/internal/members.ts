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
      member.organizationId
    ).match(
      (members) => ok(c, members),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");

    return MemberService.deleteMemberById(id).match(
      (member) => ok(c, member),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put(
    "/:id",
    validator("json", z.object({ role: z.enum(["member", "admin", "owner"]) })),
    (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");

      return MemberService.updateMemberById(id, body).match(
        (member) => ok(c, member),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
