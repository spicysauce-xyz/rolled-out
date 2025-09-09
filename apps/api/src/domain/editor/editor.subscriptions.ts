import { Emitter } from "@services/events";
import { PostCreatedEvent } from "../post";
import { EditorService } from "./editor.service";

const registerEditorSubscriptions = () => {
  Emitter.on<PostCreatedEvent>(PostCreatedEvent.eventName, (event) => {
    return EditorService.createEditor(event.post.id, event.member.userId);
  });
};

export { registerEditorSubscriptions };
