import type { EditorState } from "@tiptap/pm/state";
import {
  type Editor,
  Extension,
  type Range,
  ReactRenderer,
} from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import {
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
} from "lucide-react";
import tippy, {
  type GetReferenceClientRect,
  type Instance,
  type Props,
} from "tippy.js";
import { SlashCommandMenu } from "./slash-command-menu";

export const slashExtension = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: true,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: { command: (data: { editor: Editor; range: Range }) => void };
        }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) =>
          [
            {
              icon: Heading2Icon,
              title: "Heading 2",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 2 })
                  .run();
              },
            },
            {
              icon: Heading3Icon,
              title: "Heading 3",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 3 })
                  .run();
              },
            },
            {
              icon: ImageIcon,
              title: "Image",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                // Create file input element
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                input.onchange = (event) => {
                  const file = (event.target as HTMLInputElement).files?.[0];

                  if (file) {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .uploadImage(file, (node) => {
                        return editor.state.tr.replaceSelectionWith(node);
                      })
                      .run();
                  }
                };

                input.click();
              },
            },
            {
              icon: ListIcon,
              title: "Bullet List",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run();
              },
            },
            {
              icon: ListOrderedIcon,
              title: "Ordered List",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run();
              },
            },
            {
              icon: QuoteIcon,
              title: "Quote",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleNode("paragraph", "paragraph")
                  .toggleBlockquote()
                  .run();
              },
            },
            {
              icon: CodeIcon,
              title: "Code Block",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("codeBlock")
                  .run();
              },
            },
          ].filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          ),
        decorationClass:
          "text-neutral-500 bg-neutral-50 rounded-xs ring-2 ring-neutral-50",
        allow: (props: {
          editor: Editor;
          state: EditorState;
          range: Range;
          isActive?: boolean;
        }) => {
          const { selection } = props.editor.state;

          const parentNode = selection.$from.node(selection.$from.depth);
          const blockType = parentNode.type.name;
          const grandParentNode = selection.$from.node(
            selection.$from.depth - 1
          );

          if (
            !["paragraph", "heading"].includes(blockType) ||
            ["listItem", "blockquote"].includes(
              grandParentNode?.type.name ?? ""
            )
          ) {
            return false;
          }

          return true;
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: Instance<Props>[] | null = null;

          return {
            onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
              component = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              // @ts-expect-error
              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate: (props: {
              editor: Editor;
              clientRect: GetReferenceClientRect;
            }) => {
              component?.updateProps(props);
              popup?.[0]?.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown: (props: { event: KeyboardEvent }) => {
              if (props.event.key === "Escape") {
                popup?.[0]?.hide();

                return true;
              }

              if (!popup?.[0]?.state.isVisible) {
                return false;
              }

              // @ts-expect-error
              return component?.ref?.onKeyDown(props);
            },
            onExit: () => {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
