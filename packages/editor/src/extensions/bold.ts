import Bold from "@tiptap/extension-bold";
import { onlyInAllowedNodesForMarks } from "../utils";

export const boldExtension = Bold.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-b": () =>
        onlyInAllowedNodesForMarks(
          this.editor,
          this.editor.commands.toggleBold
        ),
    };
  },
});
