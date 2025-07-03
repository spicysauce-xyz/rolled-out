import {
  Anchor as RadixPopoverAnchor,
  Content as RadixPopoverContent,
  Portal as RadixPopoverPortal,
  Root as RadixPopoverRoot,
  Trigger as RadixPopoverTrigger,
} from "@radix-ui/react-popover";
import type React from "react";
import { cn } from "../../utils";

function PopoverRoot({
  ...props
}: React.ComponentProps<typeof RadixPopoverRoot>) {
  return <RadixPopoverRoot {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof RadixPopoverTrigger>) {
  return <RadixPopoverTrigger {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof RadixPopoverContent>) {
  return (
    <RadixPopoverPortal>
      <RadixPopoverContent
        align={align}
        arrowPadding={12}
        className={cn(
          "z-50 max-h-[var(--radix-popover-content-available-height)] rounded-xl border border-neutral-100 bg-white p-2 shadow-lg",
          // transition
          "transition-all",
          // animation
          "fade-in data-[state=closed]:fade-out animate-in data-[state=closed]:animate-out",
          // animation left
          "data-[side=left]:slide-in-from-right-1 data-[side=left]:data-[state=closed]:slide-out-to-right-1",
          // animation top
          "data-[side=top]:slide-in-from-bottom-1 data-[side=top]:data-[state=closed]:slide-out-to-bottom-1",
          // animation right
          "data-[side=right]:slide-in-from-left-1 data-[side=right]:data-[state=closed]:slide-out-to-left-1",
          // animation bottom
          "data-[side=bottom]:slide-in-from-top-1 data-[side=bottom]:data-[state=closed]:slide-out-to-top-1",
          className
        )}
        collisionPadding={8}
        hideWhenDetached
        sideOffset={4}
        {...props}
      />
    </RadixPopoverPortal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof RadixPopoverAnchor>) {
  return <RadixPopoverAnchor data-slot="popover-anchor" {...props} />;
}

export {
  PopoverRoot as Root,
  PopoverTrigger as Trigger,
  PopoverContent as Content,
  PopoverAnchor as Anchor,
};
