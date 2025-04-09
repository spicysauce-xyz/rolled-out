import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const DropdownMenuRoot = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <Text.Root weight="medium" size="sm" asChild>
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        // base
        "group/dropdown-item relative mx-2 flex h-9 cursor-default select-none items-center gap-2 rounded-sm p-2 outline-none",
        // transition
        "transition-colors",
        // hover
        "hover:bg-neutral-50",
        // focus
        "focus:bg-neutral-50",
        // disabled
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <div className="ml-auto pl-4">
        <DropdownMenuItemIcon>
          <ChevronRight />
        </DropdownMenuItemIcon>
      </div>
    </DropdownMenuPrimitive.SubTrigger>
  </Text.Root>
));

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={16}
      arrowPadding={12}
      alignOffset={-8}
      hideWhenDetached
      className={cn(
        "z-50 flex max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-48 flex-col gap-px rounded-xl border border-neutral-100 bg-white py-2 shadow-xl",
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
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

// TODO: fix overflow scroll issue
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={8}
      arrowPadding={12}
      collisionPadding={8}
      hideWhenDetached
      className={cn(
        "z-50 flex max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-48 flex-col gap-px rounded-xl border border-neutral-100 bg-white py-2 shadow-xl",
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
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Text.Root weight="medium" size="sm" asChild>
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        // base
        "group/dropdown-item relative mx-2 flex h-9 cursor-default select-none items-center gap-2 rounded-sm p-2 outline-none",
        // transition
        "transition-colors",
        // hover
        "hover:bg-neutral-50",
        // focus
        "focus:bg-neutral-50",
        // disabled
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </Text.Root>
));

const DropdownMenuItemIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "size-4 shrink-0 text-neutral-400 [&_svg]:h-full [&_svg]:w-full",
      // transition
      "transition-colors",
      // hover
      "group-hover/dropdown-item:text-neutral-500",
      // focus
      "group-focus-within/dropdown-item:text-neutral-500",
      className,
    )}
    {...props}
  />
));

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("my-2 h-px shrink-0 bg-neutral-100", className)}
    {...props}
  />
));

const DropdownMenuShortcut = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <Text.Root
    ref={ref}
    size="xs"
    weight="medium"
    className={cn(
      "ml-auto text-neutral-400",
      // transition
      "transition-colors",
      // hover
      "group-hover/dropdown-item:text-neutral-500",
      // focus
      "group-focus-within/dropdown-item:text-neutral-500",
      className,
    )}
    {...props}
  />
));

export {
  DropdownMenuRoot as Root,
  DropdownMenuTrigger as Trigger,
  DropdownMenuContent as Content,
  DropdownMenuItem as Item,
  DropdownMenuItemIcon as ItemIcon,
  DropdownMenuCheckboxItem as CheckboxItem,
  DropdownMenuRadioItem as RadioItem,
  DropdownMenuSeparator as Separator,
  DropdownMenuShortcut as Shortcut,
  DropdownMenuGroup as Group,
  DropdownMenuPortal as Portal,
  DropdownMenuSub as Sub,
  DropdownMenuSubContent as SubContent,
  DropdownMenuSubTrigger as SubTrigger,
  DropdownMenuRadioGroup as RadioGroup,
};
