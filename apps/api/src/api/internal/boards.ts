import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validate } from "@api/middleware/validate";
import { Emitter } from "@services/events";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import {
  BoardCreatedEvent,
  BoardUpdatedEvent,
} from "../../domain/board/board.events";
import { BoardsService } from "../../domain/board/board.service";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const BoardsRouter = new Hono<{ Variables: Variables }>()

  .get("/", (c) => {
    const member = c.get("member");

    return BoardsService.getBoardsFromOrganization(member).match(
      (boards) => ok(c, boards),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post(
    "/",
    validate(
      "json",
      z.object({
        name: z.string().trim().min(1),
        symbol: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        tags: z.array(z.string().uuid()).optional(),
      })
    ),
    (c) => {
      const member = c.get("member");
      const body = c.req.valid("json");

      return BoardsService.createBoard(member, body)
        .andThen((board) =>
          Emitter.emitAsync(
            BoardCreatedEvent.eventName,
            new BoardCreatedEvent(board, body.tags || [])
          )
        )
        .match(
          (result) => ok(c, result.board),
          (error) => notOk(c, { message: error.message }, 500)
        );
    }
  )

  .get("/:id", validate("param", z.object({ id: z.string().uuid() })), (c) => {
    const boardId = c.req.param("id");
    const member = c.get("member");

    return BoardsService.getBoardById(member, boardId).match(
      (board) => ok(c, board),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .put(
    "/:id",
    validate("param", z.object({ id: z.string().uuid() })),
    validate(
      "json",
      z.object({
        name: z.string().optional(),
        symbol: z.string().optional(),
        slug: z.string().optional(),
        tags: z.array(z.string().uuid()).optional(),
      })
    ),
    (c) => {
      const boardId = c.req.param("id");
      const member = c.get("member");
      const body = c.req.valid("json");

      return BoardsService.updateBoard(member, boardId, body)
        .andThen((board) =>
          Emitter.emitAsync(
            BoardUpdatedEvent.eventName,
            new BoardUpdatedEvent(board, body.tags || [])
          )
        )
        .match(
          (result) => ok(c, result.board),
          (error) => notOk(c, { message: error.message }, 500)
        );
    }
  )

  .get(
    "/:id/posts",
    validate("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const boardId = c.req.param("id");
      const member = c.get("member");

      return BoardsService.getBoardPosts(member, boardId).match(
        (posts) => ok(c, posts),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
