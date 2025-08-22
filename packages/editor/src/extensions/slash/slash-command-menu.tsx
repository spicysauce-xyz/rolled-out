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

  const handleMouseClick = (index: number) => {
    items[index].command({ editor, range });
  };

  return (
    <div className="min-w-40 flex-col gap-px rounded-xl border border-neutral-100 bg-white p-2 shadow-xl">
      {items.map((item, index) => (
        <button
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 font-[450] text-md transition-colors [&>svg]:size-4 [&>svg]:text-neutral-700",
            selectedIndex === index &&
              "border-neutral-100 bg-neutral-100 [&>svg]:text-neutral-900"
          )}
          key={item.title}
          onClick={() => handleMouseClick(index)}
          onMouseEnter={() => setSelectedIndex(index)}
          type="button"
        >
          <item.icon className="size-4 transition-colors" />
          {item.title}
        </button>
      ))}
    </div>
  );
});
