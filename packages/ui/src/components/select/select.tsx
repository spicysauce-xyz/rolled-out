import { mergeProps } from "@base-ui-components/react/merge-props";
import { Select } from "@base-ui-components/react/select";
import { useRender } from "@base-ui-components/react/use-render";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import type React from "react";
import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area";

const SelectRoot = Select.Root;

const SelectGroup = Select.Group;

const SelectValue = Select.Value;

const SelectItemText = Select.ItemText;

const SelectTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof Select.Trigger>) => (
  <Select.Trigger className={cn("group/select-trigger", className)} {...props}>
    {children}
  </Select.Trigger>
);

const SelectIcon = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Select.Icon>) => (
  <Select.Icon
    className={cn("shrink-0", className)}
    render={<ChevronsUpDown className="h-4 w-4" />}
    {...props}
  />
);

const SelectContent = ({
  className,
  children,
  sideOffset = 4,
  side = "bottom",
  align = "start",
  alignOffset = 0,
  ...props
}: React.ComponentPropsWithRef<typeof Select.Popup> &
  Pick<
    React.ComponentPropsWithoutRef<typeof Select.Positioner>,
    "sideOffset" | "side" | "align" | "alignOffset"
  >) => (
  <Select.Portal>
    <Select.Backdrop />
    <Select.Positioner
      align={align}
      alignItemWithTrigger={false}
      alignOffset={alignOffset}
      className="z-50 flex max-h-[var(--available-height)] min-w-[var(--anchor-width)]"
      side={side}
      sideOffset={sideOffset}
    >
      <Select.Popup
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
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
);

const SelectItem = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof Select.Item>) => (
  <Select.Item
    {...props}
    className={cn(
      "group/select-item relative mx-2 flex h-9 select-none scroll-m-2 items-center justify-start rounded-md px-2 pr-10 outline-none transition-colors data-[highlighted]:bg-neutral-100",
      className
    )}
  >
    <div className="flex items-center gap-2 font-weight-500 text-md text-neutral-900">
      {children}
      <Select.ItemIndicator className="absolute right-2">
        <CheckIcon className="h-4 w-4" />
      </Select.ItemIndicator>
    </div>
  </Select.Item>
);

type SelectItemIconProps = useRender.ComponentProps<"svg">;

const SelectItemIcon: React.FC<SelectItemIconProps> = ({
  className,
  render = <div />,
  ...props
}) => {
  const defaultProps: useRender.ElementProps<"svg"> = {
    className:
      "size-4 transition-colors stroke-neutral-400 group-data-[highlighted]/select-item:stroke-neutral-500",
  };

  const element = useRender({
    render,
    props: mergeProps<"svg">(defaultProps, props),
  });

  return element;
};

const SelectSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Select.Separator>) => (
  <Select.Separator
    className={cn("my-2 h-px bg-neutral-200", className)}
    {...props}
  />
);

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
