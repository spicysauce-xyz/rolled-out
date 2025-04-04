import * as TooltipPrimitives from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const TooltipProvider = TooltipPrimitives.Provider;

const TooltipRoot = TooltipPrimitives.Root;

const TooltipTrigger = TooltipPrimitives.Trigger;

TooltipPrimitives.Content;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitives.Content>
>(({ className, children, ...rest }, ref) => {
  return (
    <TooltipPrimitives.Content
      ref={ref}
      className={cn(
        "z-10 flex max-w-80 flex-col gap-0.5 rounded-md bg-neutral-800 px-3 py-2 shadow-lg",
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
        className,
      )}
      sideOffset={4}
      arrowPadding={12}
      hideWhenDetached
      collisionPadding={8}
      {...rest}
    >
      {children}
      <TooltipPrimitives.Arrow className="fill-neutral-800" />
    </TooltipPrimitives.Content>
  );
});

const TooltipTitle = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...rest }, ref) => {
  return (
    <Text.Root
      ref={ref}
      size="xs"
      weight="semibold"
      className={cn("text-white", className)}
      {...rest}
    />
  );
});

const TooltipDescription = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...rest }, ref) => {
  return (
    <Text.Root
      ref={ref}
      size="xs"
      className={cn("text-neutral-200", className)}
      {...rest}
    />
  );
});

export {
  TooltipProvider as Provider,
  TooltipRoot as Root,
  TooltipTrigger as Trigger,
  TooltipContent as Content,
  TooltipTitle as Title,
  TooltipDescription as Description,
};
