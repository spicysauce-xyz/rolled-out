import Underline from "@tiptap/extension-underline";
import { onlyInAllowedNodesForMarks } from "../utils";

export const underlineExtension = Underline.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-u": () =>
        onlyInAllowedNodesForMarks(
          this.editor,
          this.editor.commands.toggleUnderline
        ),
    };
  },
});
