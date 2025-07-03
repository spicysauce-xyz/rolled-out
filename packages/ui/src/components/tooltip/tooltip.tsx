import {
  Arrow as RadixTooltipArrow,
  Content as RadixTooltipContent,
  Provider as RadixTooltipProvider,
  Root as RadixTooltipRoot,
  Trigger as RadixTooltipTrigger,
} from "@radix-ui/react-tooltip";
import React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const TooltipProvider = RadixTooltipProvider;

const TooltipRoot = RadixTooltipRoot;

const TooltipTrigger = RadixTooltipTrigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof RadixTooltipContent>,
  React.ComponentPropsWithoutRef<typeof RadixTooltipContent>
>(({ className, children, ...rest }, ref) => {
  return (
    <RadixTooltipContent
      arrowPadding={12}
      className={cn(
        "z-10 flex max-w-80 flex-col gap-0.5 rounded-md bg-neutral-900 px-3 py-2 shadow-lg",
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
      ref={ref}
      sideOffset={4}
      {...rest}
    >
      {children}
      <RadixTooltipArrow className="fill-neutral-900" />
    </RadixTooltipContent>
  );
});

const TooltipTitle = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...rest }, ref) => {
  return (
    <Text.Root
      className={cn("text-white", className)}
      ref={ref}
      size="xs"
      weight="semibold"
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
      className={cn("text-neutral-200", className)}
      ref={ref}
      size="xs"
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
