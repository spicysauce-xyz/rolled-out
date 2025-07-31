import Strike from "@tiptap/extension-strike";
import { onlyInAllowedNodesForMarks } from "../utils";

export const strikeExtension = Strike.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-s": () =>
        onlyInAllowedNodesForMarks(
          this.editor,
          this.editor.commands.toggleStrike
        ),
    };
  },
});
