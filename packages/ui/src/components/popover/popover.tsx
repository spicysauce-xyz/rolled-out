import { Popover } from "@base-ui-components/react/popover";
import type React from "react";
import { cn } from "../../utils";

const PopoverRoot = Popover.Root;

const PopoverTrigger = Popover.Trigger;

function PopoverContent({
  className,
  side,
  ...props
}: React.ComponentProps<typeof Popover.Popup> &
  Pick<React.ComponentPropsWithoutRef<typeof Popover.Positioner>, "side">) {
  return (
    <Popover.Portal>
      <Popover.Positioner collisionPadding={8} side={side} sideOffset={4}>
        <Popover.Popup
          className={cn(
            "z-50 rounded-xl border border-neutral-100 bg-white p-2 shadow-lg",
            // transition
            "transition-all",
            // animation
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[instant]:duration-0",
            // // animation left
            "data-[side=left]:data-[ending-style]:-translate-x-1 data-[side=left]:data-[starting-style]:-translate-x-1",
            // // animation top
            "data-[side=top]:data-[ending-style]:-translate-y-1 data-[side=top]:data-[starting-style]:-translate-y-1",
            // // animation right
            "data-[side=right]:data-[ending-style]:translate-x-1 data-[side=right]:data-[starting-style]:translate-x-1",
            // // animation bottom
            "data-[side=bottom]:data-[ending-style]:translate-y-1 data-[side=bottom]:data-[starting-style]:translate-y-1",
            className
          )}
          {...props}
        />
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export {
  PopoverRoot as Root,
  PopoverTrigger as Trigger,
  PopoverContent as Content,
};
