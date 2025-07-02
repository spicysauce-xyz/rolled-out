import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { Emitter } from "@events";
import { zValidator } from "@hono/zod-validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { BoardCreatedEvent, BoardUpdatedEvent } from "./board.events";
import { BoardsService } from "./board.service";

export const BoardHandler = organizationFactory
  .createApp()
  .get("/", async (c) => {
    const member = c.get("member");

    return BoardsService.getBoardsFromOrganization(member).match(
      (boards) => ok(c, boards),
      (error) => notOk(c, { message: error.message }, 500),
    );
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

      return BoardsService.createBoard(member, body)
        .andThen((board) =>
          Emitter.emitAsync(BoardCreatedEvent.eventName, new BoardCreatedEvent(board, body.tags || [])),
        )
        .match(
          (result) => ok(c, result.board),
          (error) => notOk(c, { message: error.message }, 500),
        );
    },
  )

  .get("/:id", zValidator("param", z.object({ id: z.string().uuid() })), async (c) => {
    const boardId = c.req.param("id");
    const member = c.get("member");

    return BoardsService.getBoardById(member, boardId).match(
      (board) => ok(c, board),
      (error) => notOk(c, { message: error.message }, 500),
    );
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

      return BoardsService.updateBoard(member, boardId, body)
        .andThen((board) =>
          Emitter.emitAsync(BoardUpdatedEvent.eventName, new BoardUpdatedEvent(board, body.tags || [])),
        )
        .match(
          (result) => ok(c, result.board),
          (error) => notOk(c, { message: error.message }, 500),
        );
    },
  )

  .get("/:id/posts", zValidator("param", z.object({ id: z.string().uuid() })), async (c) => {
    const boardId = c.req.param("id");
    const member = c.get("member");

    return BoardsService.getBoardPosts(member, boardId).match(
      (posts) => ok(c, posts),
      (error) => notOk(c, { message: error.message }, 500),
    );
  });
