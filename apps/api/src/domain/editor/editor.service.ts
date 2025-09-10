import { EditorRepository } from "./editor.repository";

export const EditorService = {
  createEditor: (
    postId: string,
    memberId: string,
    role: "creator" | "editor"
  ) => {
    return EditorRepository.createEditor(postId, memberId, role);
  },
};
