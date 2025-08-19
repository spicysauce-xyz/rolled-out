import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { config } from "@lib/config";
import { ScrollArea, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { CircleIcon, type LucideIcon, ScrollTextIcon } from "lucide-react";
// @ts-expect-error https://github.com/lucide-icons/lucide/issues/2867
import { DynamicIcon, type IconName } from "lucide-react/dynamic.mjs";
import React from "react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarRoot = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-full flex-col border-neutral-100 border-r",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, label, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col gap-1 px-2", className)}
        ref={ref}
        {...props}
      >
        {label && (
          <div className="flex h-9 items-center px-2">
            <Text.Root className="text-neutral-500 uppercase" size="sm">
              {label}
            </Text.Root>
          </div>
        )}
        {children}
      </div>
    );
  }
);

const SidebarFill = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div className={cn("min-h-4 flex-1", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});

type SidebarButtonProps = useRender.ComponentProps<"button"> & {
  icon?: LucideIcon;
  iconName?: IconName;
  label: string;
  isDisabled?: boolean;
};

const SidebarButton = ({
  render = <button type="button" />,
  icon,
  iconName,
  isDisabled,
  label,
  onClick,
  children,
  className,
  ...props
}: SidebarButtonProps) => {
  let iconNode: React.ReactNode;

  if (icon) {
    const Icon = icon;
    iconNode = <Icon />;
  } else if (iconName) {
    iconNode = <DynamicIcon name={iconName} />;
  } else {
    iconNode = <CircleIcon />;
  }

  const defaultProps: useRender.ElementProps<"button"> = {
    children: (
      <>
        {iconNode}
        {label}
        {children}
      </>
    ),
    disabled: isDisabled,
    className: cn(
      [
        // base
        "group/sidebar-button flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 font-[450] text-md text-neutral-900 transition-[background-color,border-color,color] [&>svg]:size-4 [&>svg]:stroke-neutral-600 [&>svg]:transition-colors",
        // hover
        "hover:border-neutral-100 hover:bg-neutral-100 hover:text-neutral-900 hover:[&>svg]:stroke-neutral-900",
        // focus
        "ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        // disabled
        "disabled:cursor-not-allowed disabled:border-transparent disabled:text-neutral-400 disabled:[&>svg]:stroke-neutral-400",
        // aria-disabled
        "aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-transparent aria-disabled:text-neutral-400 aria-disabled:[&>svg]:stroke-neutral-400",
      ],
      className
    ),
    type: "button",
    onClick: (...args) => {
      if (isDisabled) {
        return;
      }

      onClick?.(...args);
    },
  };

  const element = useRender({
    render,
    props: mergeProps<"button">(defaultProps, props),
  });

  return element;
};

const SidebarHeader = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-neutral-100 border-b p-2",
        className
      )}
      {...props}
    />
  );
};

const SidebarLogo = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <ScrollTextIcon className="size-4 stroke-2 stroke-neutral-900" />
      <Text.Root weight="medium">Rolled Out</Text.Root>
    </div>
  );
};

const SidebarVersion = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Text.Root>) => {
  return (
    <Text.Root color="muted" {...props}>
      <a
        href={`https://github.com/spicysauce-xyz/rolled-out/releases/tag/${config.version}`}
        rel="noreferrer"
        target="_blank"
      >
        v{config.version}
      </a>
    </Text.Root>
  );
};

const SidebarFooter = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={cn("flex border-neutral-100 border-t p-2", className)}
      {...props}
    />
  );
};

const SidebarScrollArea = ({
  children,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollArea.Root>) => {
  return (
    <ScrollArea.Root className="flex-1 overflow-hidden" {...props}>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Viewport className="flex w-full flex-col py-4">
        {children}
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};

export const Sidebar = {
  Root: SidebarRoot,
  Group: SidebarGroup,
  Fill: SidebarFill,
  Button: SidebarButton,
  Header: SidebarHeader,
  Logo: SidebarLogo,
  Version: SidebarVersion,
  Footer: SidebarFooter,
  ScrollArea: SidebarScrollArea,
};
