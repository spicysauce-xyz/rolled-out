import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { zValidator } from "@hono/zod-validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { BoardsService } from "./board.service";

export const BoardHandler = organizationFactory
  .createApp()
  .get("/", async (c) => {
    const member = c.get("member");

    const boardsResult = await BoardsService.getBoardsFromOrganization(member);

    if (boardsResult.isErr()) {
      return notOk(c, { message: boardsResult.error.message }, 500);
    }

    return ok(c, boardsResult.value);
  })

  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().trim().min(1),
        symbol: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        tags: z.array(z.string().uuid()).optional(),
      }),
    ),
    async (c) => {
      const member = c.get("member");
      const body = c.req.valid("json");

      const boardResult = await BoardsService.createBoard(member, body);

      if (boardResult.isErr()) {
        return notOk(c, { message: boardResult.error.message }, 500);
      }

      return ok(c, boardResult.value);
    },
  )

  .get("/:id", zValidator("param", z.object({ id: z.string().uuid() })), async (c) => {
    const boardId = c.req.param("id");
    const member = c.get("member");

    const boardResult = await BoardsService.getBoardById(member, boardId);

    if (boardResult.isErr()) {
      return notOk(c, { message: boardResult.error.message }, 500);
    }

    return ok(c, boardResult.value);
  })

  .get("/:id/posts", zValidator("param", z.object({ id: z.string().uuid() })), async (c) => {
    const boardId = c.req.param("id");
    const member = c.get("member");

    const postsResult = await BoardsService.getBoardPosts(member, boardId);

    if (postsResult.isErr()) {
      return notOk(c, { message: postsResult.error.message }, 500);
    }

    return ok(c, postsResult.value);
  })

  .put(
    "/:id",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        symbol: z.string().optional(),
        slug: z.string().optional(),
        tags: z.array(z.string().uuid()).optional(),
      }),
    ),
    async (c) => {
      const boardId = c.req.param("id");
      const member = c.get("member");
      const body = c.req.valid("json");

      const boardResult = await BoardsService.updateBoard(member, boardId, body);

      if (boardResult.isErr()) {
        return notOk(c, { message: boardResult.error.message }, 500);
      }

      return ok(c, boardResult.value);
    },
  );
