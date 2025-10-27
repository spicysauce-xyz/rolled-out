import { Menu } from "@base-ui-components/react/menu";
import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type React from "react";
import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area";

const DropdownMenuRoot = Menu.Root;

const DropdownMenuTrigger = Menu.Trigger;

const DropdownMenuGroup = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Menu.Group>) => (
  <Menu.Group className={cn("flex flex-col", className)} {...props} />
);

const DropdownMenuSub = Menu.SubmenuRoot;

const DropdownMenuSubTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof Menu.SubmenuTrigger>) => (
  <Menu.SubmenuTrigger
    className={cn(
      "group/dropdown-button mx-2 flex h-9 select-none scroll-m-2 items-center justify-start rounded-md px-2 outline-none transition-colors data-[highlighted]:bg-neutral-100",
      className
    )}
    {...props}
  >
    <div className="flex w-full items-center gap-2 font-weight-500 text-md text-neutral-900">
      {children}
      <div className="flex min-w-6 flex-1 justify-end">
        <DropdownMenuItemIcon render={<ChevronRightIcon />} />
      </div>
    </div>
  </Menu.SubmenuTrigger>
);

const DropdownMenuContent = ({
  className,
  children,
  sideOffset = 4,
  side = "bottom",
  align = "start",
  alignOffset = 0,
  ...props
}: React.ComponentPropsWithRef<typeof Menu.Popup> &
  Pick<
    React.ComponentPropsWithoutRef<typeof Menu.Positioner>,
    "sideOffset" | "side" | "align" | "alignOffset"
  >) => (
  <Menu.Portal>
    <Menu.Backdrop />
    <Menu.Positioner
      align={align}
      alignOffset={alignOffset}
      className="flex max-h-[var(--available-height)] min-w-40"
      side={side}
      sideOffset={sideOffset}
    >
      <Menu.Popup
        {...props}
        className={cn(
          "relative z-50 flex min-w-full flex-col gap-px rounded-xl border border-neutral-100 bg-white shadow-xl outline-none",
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
        render={ScrollArea.Root}
      >
        <ScrollArea.Viewport className="py-2">{children}</ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="py-2" orientation="vertical" size="sm">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
);

const DropdownMenuItem = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof Menu.Item>) => {
  return (
    <Menu.Item
      className={cn(
        "group/dropdown-button mx-2 flex h-9 select-none scroll-m-2 items-center justify-start rounded-md px-2 outline-none transition-colors data-[highlighted]:bg-neutral-100",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2 font-weight-500 text-md text-neutral-900">
        {children}
      </div>
    </Menu.Item>
  );
};

type DropdownMenuIconProps = useRender.ComponentProps<"svg">;

const DropdownMenuItemIcon: React.FC<DropdownMenuIconProps> = ({
  className,
  render = <div />,
  ...props
}) => {
  const defaultProps: useRender.ElementProps<"svg"> = {
    className:
      "size-4 transition-colors text-neutral-600 group-data-[highlighted]/dropdown-button:text-neutral-900",
  };

  const element = useRender({
    render,
    props: mergeProps<"svg">(defaultProps, props),
  });

  return element;
};

const DropdownMenuRadioItem: React.FC<
  React.ComponentPropsWithRef<typeof Menu.RadioItem>
> = ({ className, children, ...props }) => {
  return (
    <Menu.RadioItem
      className={cn(
        "group/dropdown-button mx-2 flex h-9 select-none scroll-m-2 items-center justify-start rounded-md px-2 outline-none transition-colors data-[highlighted]:bg-neutral-100",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2 font-weight-500 text-md text-neutral-900">
        {children}
        <div className="flex min-w-6 flex-1 justify-end">
          <Menu.RadioItemIndicator
            className="group/radio-indicator flex size-4 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all data-[checked]:border-accent-500 group-data-[highlighted]/dropdown-button:border-neutral-300"
            keepMounted
          >
            <div className="size-2 rounded-full bg-transparent transition-colors group-data-[checked]/radio-indicator:bg-accent-500" />
          </Menu.RadioItemIndicator>
        </div>
      </div>
    </Menu.RadioItem>
  );
};

const DropdownMenuRadioGroup = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Menu.RadioGroup>) => {
  return (
    <Menu.RadioGroup className={cn("flex flex-col", className)} {...props} />
  );
};

const DropdownMenuCheckboxItem: React.FC<
  React.ComponentPropsWithRef<typeof Menu.CheckboxItem>
> = ({ className, children, ...props }) => {
  return (
    <Menu.CheckboxItem
      className={cn(
        "group/dropdown-button mx-2 flex h-9 select-none scroll-m-2 items-center justify-start rounded-md px-2 outline-none transition-colors data-[highlighted]:bg-neutral-100",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2 font-weight-500 text-md text-neutral-900">
        {children}
        <div className="flex min-w-6 flex-1 justify-end">
          <Menu.CheckboxItemIndicator
            className="group/checkbox-indicator flex size-4 items-center justify-center rounded-sm border border-neutral-200 bg-white transition-all data-[checked]:border-accent-500 data-[checked]:bg-accent-500 group-data-[highlighted]/dropdown-button:border-neutral-300"
            keepMounted
          >
            <CheckIcon className="size-3 text-transparent transition-colors group-data-[checked]/checkbox-indicator:text-white" />
          </Menu.CheckboxItemIndicator>
        </div>
      </div>
    </Menu.CheckboxItem>
  );
};

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Menu.Separator>) => (
  <Menu.Separator
    className={cn("my-2 h-px shrink-0 bg-neutral-100", className)}
    {...props}
  />
);

export {
  // Root
  DropdownMenuRoot as Root,
  DropdownMenuTrigger as Trigger,
  // Content
  DropdownMenuContent as Content,
  DropdownMenuSeparator as Separator,
  // Item
  DropdownMenuGroup as Group,
  DropdownMenuItem as Item,
  DropdownMenuRadioGroup as RadioGroup,
  DropdownMenuRadioItem as RadioItem,
  DropdownMenuCheckboxItem as CheckboxItem,
  DropdownMenuItemIcon as ItemIcon,
  // Sub
  DropdownMenuSub as Sub,
  DropdownMenuSubTrigger as SubTrigger,
};
