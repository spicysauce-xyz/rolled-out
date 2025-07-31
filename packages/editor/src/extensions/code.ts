import Code from "@tiptap/extension-code";
import { onlyInAllowedNodesForMarks } from "../utils";

export const codeExtension = Code.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-e": () =>
        onlyInAllowedNodesForMarks(
          this.editor,
          this.editor.commands.toggleCode
        ),
    };
  },
});
