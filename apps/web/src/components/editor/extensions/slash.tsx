import { Clickable, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import {
  type Editor,
  Extension,
  type Range,
  ReactRenderer,
} from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { Heading2Icon, Heading3Icon, type LucideIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import tippy, {
  type Props,
  type Instance,
  type GetReferenceClientRect,
} from "tippy.js";

interface SlashCommandMenuRef {
  onKeyDown: (data: { event: KeyboardEvent }) => void;
}

const SlashCommandMenu = forwardRef<
  SlashCommandMenuRef,
  {
    editor: Editor;
    range: Range;
    items: {
      icon: LucideIcon;
      title: string;
      command: (props: { editor: Editor; range: Range }) => void;
    }[];
  }
>(({ items, editor, range }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        event.preventDefault();

        if (event.key === "ArrowUp") {
          setSelectedIndex(Math.max(selectedIndex - 1, 0));
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex(Math.min(selectedIndex + 1, items.length - 1));
        }

        if (event.key === "Enter") {
          items[selectedIndex].command({ editor, range });
        }

        return true;
      }

      return false;
    },
  }));

  return (
    <div className="flex-col gap-px rounded-xl border border-neutral-100 bg-white p-2 shadow-xl">
      {items.map((item, index) => (
        <Clickable.Root
          key={item.title}
          variant="tertiary"
          onMouseEnter={() => setSelectedIndex(index)}
          className={cn(
            "items-center gap-2 p-2",
            selectedIndex === index && "bg-neutral-50 text-neutral-600",
          )}
        >
          <Clickable.Icon
            className={cn(
              "size-6",
              selectedIndex === index && "text-neutral-500",
            )}
          >
            <item.icon />
          </Clickable.Icon>
          <Text.Root weight="medium" className="text-inherit">
            {item.title}
          </Text.Root>
        </Clickable.Root>
      ))}
    </div>
  );
});

export const Slash = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: { command: (props: { editor: Editor; range: Range }) => void };
        }) => {
          props.command({ editor, range });
        },
        items: () => [
          {
            icon: Heading2Icon,
            title: "Heading 2",
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
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
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
            },
          },
        ],
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: Instance<Props>[] | null = null;

          return {
            onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
              component = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: props.editor,
              });

              const { selection } = props.editor.state;

              const parentNode = selection.$from.node(selection.$from.depth);
              const blockType = parentNode.type.name;

              if (blockType === "title") {
                return;
              }

              if (!props.clientRect) {
                return;
              }

              // @ts-ignore
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

              // @ts-ignore
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
