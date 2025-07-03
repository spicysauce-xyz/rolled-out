import { EditorRepository } from "./editor.repository";

export const EditorService = {
  createEditor: (postId: string, userId: string) => {
    return EditorRepository.createEditor(postId, userId);
  },
};
