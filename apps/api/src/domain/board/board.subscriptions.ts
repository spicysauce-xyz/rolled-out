import { OrganizationCreatedEvent } from "@domain/auth";
import { Emitter } from "@events";
import { BoardsService } from "./board.service";

Emitter.on<OrganizationCreatedEvent>(
  OrganizationCreatedEvent.eventName,
  (event) => {
    const { member } = event;

    return BoardsService.createBoard(member, {
      name: "Main Board",
      symbol: "house",
      slug: "main",
    });
  }
);
