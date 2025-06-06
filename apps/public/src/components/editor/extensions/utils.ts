import type { Editor } from "@tiptap/react";

export const onlyInAllowedNodesForMarks = (
  editor: Editor,
  action: () => boolean,
) => {
  const { $from } = editor.state.selection;
  const parentNode = $from.node($from.depth);

  if (["heading", "title"].includes(parentNode.type.name)) {
    return true;
  }

  return action();
};
