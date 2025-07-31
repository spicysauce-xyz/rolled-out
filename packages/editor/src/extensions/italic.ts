import Italic from "@tiptap/extension-italic";
import { onlyInAllowedNodesForMarks } from "../utils";

export const italicExtension = Italic.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-i": () =>
        onlyInAllowedNodesForMarks(
          this.editor,
          this.editor.commands.toggleItalic
        ),
    };
  },
});
