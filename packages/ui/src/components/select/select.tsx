import {
  Content as RadixSelectContent,
  Group as RadixSelectGroup,
  Icon as RadixSelectIcon,
  Item as RadixSelectItem,
  ItemIndicator as RadixSelectItemIndicator,
  ItemText as RadixSelectItemText,
  Portal as RadixSelectPortal,
  Root as RadixSelectRoot,
  Separator as RadixSelectSeparator,
  Trigger as RadixSelectTrigger,
  Value as RadixSelectValue,
  Viewport as RadixSelectViewport,
} from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area";

const SelectRoot = RadixSelectRoot;

const SelectGroup = RadixSelectGroup;

const SelectValue = RadixSelectValue;

const SelectItemText = RadixSelectItemText;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixSelectTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixSelectTrigger>
>(({ className, children, ...props }, ref) => (
  <RadixSelectTrigger
    className={cn("group/select-trigger", className)}
    ref={ref}
    {...props}
  >
    {children}
  </RadixSelectTrigger>
));

const SelectIcon = React.forwardRef<
  React.ElementRef<typeof RadixSelectIcon>,
  React.ComponentPropsWithoutRef<typeof RadixSelectIcon>
>(({ className, ...props }, ref) => (
  <RadixSelectIcon asChild className="shrink-0" ref={ref} {...props}>
    <ChevronsUpDown className="h-4 w-4" />
  </RadixSelectIcon>
));

const SelectContent = React.forwardRef<
  React.ElementRef<typeof RadixSelectContent>,
  React.ComponentPropsWithoutRef<typeof RadixSelectContent>
>(({ className, children, ...props }, ref) => (
  <RadixSelectPortal>
    <RadixSelectContent
      className={cn(
        "relative z-50 h-full max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] flex-col gap-px rounded-xl border border-neutral-200 bg-white py-2 shadow-xl",
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
      position="popper"
      ref={ref}
      sideOffset={8}
      {...props}
    >
      <ScrollArea.Root type="scroll">
        <RadixSelectViewport className="h-full w-full">
          <ScrollArea.Viewport>{children}</ScrollArea.Viewport>
        </RadixSelectViewport>
        <ScrollArea.Scrollbar orientation="vertical" size="sm">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </RadixSelectContent>
  </RadixSelectPortal>
));

const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixSelectItem>,
  React.ComponentPropsWithoutRef<typeof RadixSelectItem>
>(({ className, children, ...props }, ref) => (
  <RadixSelectItem
    className={cn(
      // base
      "group/select-item relative mx-2 flex h-9 cursor-default select-none items-center gap-2 rounded-sm p-2 pr-10 outline-none",
      // transition
      "transition-colors",
      // hover
      "data-[state=unchecked]:hover:bg-neutral-50",
      // focus
      "focus:bg-neutral-50",
      // disabled
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
    <RadixSelectItemIndicator className="absolute right-2">
      <Check className="h-4 w-4" />
    </RadixSelectItemIndicator>
  </RadixSelectItem>
));

const SelectItemIcon = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "size-4 shrink-0 text-neutral-400 [&_svg]:h-full [&_svg]:w-full",
      // transition
      "transition-colors",
      // hover
      "group-hover/select-item:text-neutral-500",
      // focus
      "group-focus-within/select-item:text-neutral-500",
      className
    )}
    ref={ref}
    {...props}
  />
));

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof RadixSelectSeparator>,
  React.ComponentPropsWithoutRef<typeof RadixSelectSeparator>
>(({ className, ...props }, ref) => (
  <RadixSelectSeparator
    className={cn("my-2 h-px bg-neutral-200", className)}
    ref={ref}
    {...props}
  />
));

export {
  SelectRoot as Root,
  SelectGroup as Group,
  SelectValue as Value,
  SelectTrigger as Trigger,
  SelectContent as Content,
  SelectItem as Item,
  SelectItemIcon as ItemIcon,
  SelectItemText as ItemText,
  SelectSeparator as Separator,
  SelectIcon as Icon,
};
