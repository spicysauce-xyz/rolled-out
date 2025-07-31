import { Clickable, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import type { Editor, Range } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

interface SlashCommandMenuRef {
  onKeyDown: (data: { event: KeyboardEvent }) => void;
}

export const SlashCommandMenu = forwardRef<
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
          className={cn(
            "w-full items-center gap-2 p-2",
            selectedIndex === index && "bg-neutral-50 text-neutral-600"
          )}
          key={item.title}
          onMouseEnter={() => setSelectedIndex(index)}
          variant="tertiary"
        >
          <Clickable.Icon
            className={cn(
              "size-5",
              selectedIndex === index && "text-neutral-500"
            )}
          >
            <item.icon />
          </Clickable.Icon>
          <Text.Root className="text-inherit" size="sm" weight="medium">
            {item.title}
          </Text.Root>
        </Clickable.Root>
      ))}
    </div>
  );
});
