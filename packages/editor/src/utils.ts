import { generateHTML as generateTiptapHTML } from "@tiptap/html";
import type { Editor, JSONContent } from "@tiptap/react";
import extensions from "./extensions";

export const onlyInAllowedNodesForMarks = (
  editor: Editor,
  action: () => boolean
) => {
  const { $from } = editor.state.selection;
  const parentNode = $from.node($from.depth);

  if (["heading", "title"].includes(parentNode.type.name)) {
    return true;
  }

  return action();
};

export type { JSONContent } from "@tiptap/react";

export const generateHtml = (content: JSONContent) => {
  return generateTiptapHTML(content, extensions);
};
