import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area";

const SelectRoot = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectItemText = SelectPrimitive.ItemText;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn("group/select-trigger", className)}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
));

const SelectIcon = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Icon>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Icon ref={ref} className="shrink-0" asChild {...props}>
    <ChevronsUpDown className="h-4 w-4" />
  </SelectPrimitive.Icon>
));

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position="popper"
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
        className,
      )}
      sideOffset={8}
      {...props}
    >
      <ScrollArea.Root type="scroll">
        <SelectPrimitive.Viewport className="h-full w-full">
          <ScrollArea.Viewport>{children}</ScrollArea.Viewport>
        </SelectPrimitive.Viewport>
        <ScrollArea.Scrollbar size="sm" orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
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
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.ItemIndicator className="absolute right-2">
      <Check className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));

const SelectItemIcon = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "size-4 shrink-0 text-neutral-400 [&_svg]:h-full [&_svg]:w-full",
      // transition
      "transition-colors",
      // hover
      "group-hover/select-item:text-neutral-500",
      // focus
      "group-focus-within/select-item:text-neutral-500",
      className,
    )}
    {...props}
  />
));

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("my-2 h-px bg-neutral-200", className)}
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
