import { Image as ImageExtension } from "@tiptap/extension-image";
import type { Node } from "@tiptap/pm/model";
import { Plugin, type Transaction } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./image-node-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      uploadImage: (
        file: File,
        addImageTransaction: (node: Node) => Transaction
      ) => ReturnType;
    };
  }
}

export const imageExtension = ImageExtension.extend<{
  uploadImage: (file: File) => Promise<string>;
}>({
  name: "customImage",
  draggable: false,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      loading: {
        default: false,
      },
    };
  },

  addCommands() {
    return {
      uploadImage:
        (file: File, addImageTransaction: (node: Node) => Transaction) =>
        ({ view }: { view: EditorView }) => {
          const img = new Image();

          img.onload = () => {
            const imageNode = view.state.schema.nodes.customImage.create({
              src: `${file.name}-${file.size}-${file.lastModified}`,
              width: img.width,
              height: img.height,
              loading: true,
            });

            view.dispatch(addImageTransaction(imageNode));

            const nodeId = this.editor.$node("customImage", {
              src: `${file.name}-${file.size}-${file.lastModified}`,
            })?.node?.attrs.id as string | undefined;

            if (!nodeId) {
              return;
            }

            this.options
              .uploadImage(file)
              .then((url) => {
                const nodePos = this.editor.$node("customImage", {
                  id: nodeId,
                });

                if (!nodePos) {
                  return;
                }

                const updateTransaction = view.state.tr.setNodeMarkup(
                  nodePos.pos,
                  null,
                  {
                    ...nodePos.node.attrs,
                    src: url,
                    loading: false,
                  }
                );

                view.dispatch(updateTransaction);
              })
              .catch(() => {
                const nodePos = this.editor.$node("customImage", {
                  id: nodeId,
                });

                if (!nodePos) {
                  return;
                }

                const removeTransaction = view.state.tr.delete(
                  nodePos.pos,
                  nodePos.pos + nodePos.size
                );

                view.dispatch(removeTransaction);
              });
          };

          img.src = URL.createObjectURL(file);

          return true;
        },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      uploadImage: () => Promise.resolve(""),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView, {
      attrs(props) {
        return {
          "data-id": props.node.attrs.id,
        };
      },
    });
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop: (view, event) => {
            const files = Array.from(event.dataTransfer?.files || []);
            const imageFiles = files.filter((file) =>
              file.type.startsWith("image/")
            );

            if (imageFiles.length > 0) {
              const file = imageFiles[0];

              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (pos) {
                this.editor.commands.uploadImage(file, (node) => {
                  return view.state.tr.insert(pos.pos, node);
                });
              }

              return true;
            }
            return false;
          },
          handlePaste: (view, event) => {
            const items = Array.from(event.clipboardData?.items || []);
            const imageItems = items.filter((item) =>
              item.type.startsWith("image/")
            );

            if (imageItems.length > 0) {
              const item = imageItems[0];
              const file = item.getAsFile();

              if (file) {
                this.editor.commands.uploadImage(file, (node) => {
                  return view.state.tr.replaceSelectionWith(node);
                });
              }

              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
