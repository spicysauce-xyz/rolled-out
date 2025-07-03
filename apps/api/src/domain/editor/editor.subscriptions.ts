import { Emitter } from "@events";
import { PostCreatedEvent } from "../post";
import { EditorService } from "./editor.service";

Emitter.on<PostCreatedEvent>(PostCreatedEvent.eventName, (event) => {
  return EditorService.createEditor(event.post.id, event.member.userId);
});
