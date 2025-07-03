import {
  CheckboxItem as RadixDropdownMenuCheckboxItem,
  Content as RadixDropdownMenuContent,
  Group as RadixDropdownMenuGroup,
  Item as RadixDropdownMenuItem,
  ItemIndicator as RadixDropdownMenuItemIndicator,
  Portal as RadixDropdownMenuPortal,
  RadioGroup as RadixDropdownMenuRadioGroup,
  RadioItem as RadixDropdownMenuRadioItem,
  Root as RadixDropdownMenuRoot,
  Separator as RadixDropdownMenuSeparator,
  Sub as RadixDropdownMenuSub,
  SubContent as RadixDropdownMenuSubContent,
  SubTrigger as RadixDropdownMenuSubTrigger,
  Trigger as RadixDropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRight } from "lucide-react";
import React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const DropdownMenuRoot = RadixDropdownMenuRoot;

const DropdownMenuTrigger = RadixDropdownMenuTrigger;

const DropdownMenuGroup = RadixDropdownMenuGroup;

const DropdownMenuPortal = RadixDropdownMenuPortal;

const DropdownMenuSub = RadixDropdownMenuSub;

const DropdownMenuRadioGroup = RadixDropdownMenuRadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuSubTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuSubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <Text.Root asChild size="sm" weight="medium">
    <RadixDropdownMenuSubTrigger
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
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <div className="ml-auto pl-4">
        <DropdownMenuItemIcon>
          <ChevronRight />
        </DropdownMenuItemIcon>
      </div>
    </RadixDropdownMenuSubTrigger>
  </Text.Root>
));

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuSubContent>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuSubContent>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenuPortal>
    <RadixDropdownMenuSubContent
      alignOffset={-8}
      arrowPadding={12}
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
        className
      )}
      hideWhenDetached
      ref={ref}
      sideOffset={16}
      {...props}
    />
  </RadixDropdownMenuPortal>
));

// TODO: fix overflow scroll issue
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuContent>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenuPortal>
    <RadixDropdownMenuContent
      arrowPadding={12}
      className={cn(
        "z-50 flex max-h-[var(--radix-dropdown-menu-content-available-height)] flex-col gap-px rounded-xl border border-neutral-100 bg-white py-2 shadow-xl",
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
      sideOffset={8}
      {...props}
    />
  </RadixDropdownMenuPortal>
));

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuItem> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Text.Root asChild size="sm" weight="medium">
    <RadixDropdownMenuItem
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
        className
      )}
      ref={ref}
      {...props}
    />
  </Text.Root>
));

const DropdownMenuItemIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "size-4 shrink-0 text-neutral-400 [&_svg]:h-full [&_svg]:w-full",
      // transition
      "transition-colors",
      // hover
      "group-hover/dropdown-item:text-neutral-500",
      // focus
      "group-focus-within/dropdown-item:text-neutral-500",
      className
    )}
    ref={ref}
    {...props}
  />
));

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuCheckboxItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuCheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <Text.Root asChild size="sm" weight="medium">
    <RadixDropdownMenuCheckboxItem
      checked={checked}
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
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="relative flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-neutral-200 transition-all group-hover/dropdown-item:border-neutral-300 group-data-[state=checked]/dropdown-item:border-accent-500 group-data-[state=checked]/dropdown-item:hover:border-accent-500">
        <RadixDropdownMenuItemIndicator
          className="group/indicator absolute inset-0 flex items-center justify-center data-[state=checked]:bg-accent-500 data-[state=checked]:text-white"
          forceMount
        >
          <CheckIcon className="size-3 transition-opacity group-data-[state=unchecked]/indicator:opacity-0" />
        </RadixDropdownMenuItemIndicator>
      </div>
      {children}
    </RadixDropdownMenuCheckboxItem>
  </Text.Root>
));

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuRadioItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuRadioItem>
>(({ className, children, ...props }, ref) => (
  <Text.Root asChild size="sm" weight="medium">
    <RadixDropdownMenuRadioItem
      className={cn(
        // base
        "group/dropdown-radio-item relative mx-2 flex h-9 cursor-default select-none items-center gap-2 rounded-sm p-2 pr-10 outline-none",
        // transition
        "transition-colors",
        // hover
        "hover:bg-neutral-50",
        // focus
        "focus:bg-neutral-50",
        // disabled
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center rounded-full border border-neutral-200 transition-all group-hover/dropdown-radio-item:border-neutral-300 has-[[data-state=checked]]:border-accent-500 data-[state=checked]:border-accent-500">
        <RadixDropdownMenuItemIndicator asChild>
          <div className="size-2 rounded-full bg-accent-500" />
        </RadixDropdownMenuItemIndicator>
      </span>
      {children}
    </RadixDropdownMenuRadioItem>
  </Text.Root>
));

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenuSeparator
    className={cn("my-2 h-px shrink-0 bg-neutral-100", className)}
    ref={ref}
    {...props}
  />
));

const DropdownMenuShortcut = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <Text.Root
    className={cn(
      "ml-auto text-neutral-400",
      // transition
      "transition-colors",
      // hover
      "group-hover/dropdown-item:text-neutral-500",
      // focus
      "group-focus-within/dropdown-item:text-neutral-500",
      className
    )}
    ref={ref}
    size="xs"
    weight="medium"
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
