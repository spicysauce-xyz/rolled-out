import { Heading } from "@tiptap/extension-heading";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";

export const titleExtension = Heading.extend({
  name: "title",
  group: "block",
  content: "text*",
  defining: true,

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if ($from.parent.type.name === "title") {
          if ($from.parentOffset === 0) {
            return true;
          }

          const pos = $from.after($from.depth);
          return editor.commands.insertContentAt(pos, { type: "paragraph" });
        }

        return false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("preventNonTextTitleContent"),

        props: {
          handleDrop(view: EditorView, event: DragEvent): boolean {
            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            if (!coords) {
              return false;
            }

            const { state } = view;
            const $pos = state.doc.resolve(coords.pos);

            if ($pos.parent.type.name === "title") {
              return true;
            }

            const nodeAfter = $pos.nodeAfter;
            if (nodeAfter && nodeAfter.type.name === "title") {
              return true;
            }

            return false;
          },

          handlePaste(view: EditorView, event: ClipboardEvent): boolean {
            const clipboardData = event.clipboardData;

            if (!clipboardData) {
              return false;
            }

            const plainText = clipboardData.getData("text/plain");

            const { state } = view;
            const { selection } = state;

            const $pos = state.doc.resolve(selection.from);
            const nodeAfter = $pos.nodeAfter;

            if (
              $pos.parent.type.name === "title" ||
              (nodeAfter && nodeAfter.type.name === "title")
            ) {
              if (plainText) {
                const tr = state.tr.replaceSelectionWith(
                  state.schema.text(
                    plainText
                      .replace(/\n/g, " ")
                      .replace(/\r/g, "")
                      .replace(/\s+/g, " ")
                  )
                );
                view.dispatch(tr);
              }
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },

  addInputRules() {
    return [];
  },
  parseHTML() {
    return [{ tag: "h1:first-child" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["h1", HTMLAttributes, 0];
  },
});
