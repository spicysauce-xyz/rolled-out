import { config } from "@lib/config";
import { Clickable, ScrollArea, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import {
  CircleIcon,
  ExternalLinkIcon,
  type LucideIcon,
  ScrollTextIcon,
} from "lucide-react";
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
            <Text.Root className="text-neutral-400" size="sm" weight="medium">
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

type SidebarNavLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & {
    icon?: LucideIcon;
    iconName?: IconName;
    label: string;
  };

const SidebarNavLink = React.forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ children, className, icon, iconName, label, ...props }, ref) => {
    let iconNode: React.ReactNode;

    if (icon) {
      const Icon = icon;
      iconNode = <Icon />;
    } else if (iconName) {
      iconNode = <DynamicIcon name={iconName} />;
    } else {
      iconNode = <CircleIcon />;
    }

    return (
      <Clickable.Root
        asChild
        className="flex h-9 items-center border-0 px-2 hover:bg-neutral-100 focus-visible:bg-neutral-100"
        variant="tertiary"
      >
        <Link ref={ref} {...props}>
          <Clickable.Icon className="mr-2 group-data-[status=active]/clickable-root:text-neutral-900">
            {iconNode}
          </Clickable.Icon>
          <Text.Root
            className="text-inherit transition-colors group-data-[status=active]/clickable-root:text-neutral-900"
            size="sm"
            weight="medium"
          >
            {label}
          </Text.Root>
          {children}
        </Link>
      </Clickable.Root>
    );
  }
);

const SidebarButton = React.forwardRef<
  React.ComponentRef<typeof Clickable.Root>,
  React.ComponentPropsWithoutRef<typeof Clickable.Root> & {
    icon?: LucideIcon;
    label: string;
  }
>(({ children, className, icon, label, ...props }, ref) => {
  const Icon = icon ?? CircleIcon;

  return (
    <Clickable.Root
      className="flex h-9 items-center border-0 px-2 hover:bg-neutral-100 focus-visible:bg-neutral-100"
      ref={ref}
      variant="tertiary"
      {...props}
    >
      <Clickable.Icon className="mr-2 group-data-[status=active]/clickable-root:text-neutral-900">
        <Icon />
      </Clickable.Icon>
      <Text.Root
        className="text-inherit transition-colors group-data-[status=active]/clickable-root:text-neutral-900"
        size="sm"
        weight="medium"
      >
        {label}
      </Text.Root>
      {children}
    </Clickable.Root>
  );
});

type SidebarLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & { icon?: LucideIcon; label: string };

const SidebarLink = React.forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ children, className, icon, label, ...props }, ref) => {
    const Icon = icon ?? CircleIcon;

    return (
      <Clickable.Root
        asChild
        className="flex h-9 items-center border-0 px-2"
        variant="tertiary"
      >
        <a ref={ref} {...props}>
          <Clickable.Icon className="mr-2">
            <Icon />
          </Clickable.Icon>
          <Text.Root
            className="text-inherit transition-colors"
            size="sm"
            weight="medium"
          >
            {label}
          </Text.Root>
          {children}
          <Clickable.Icon className="ml-auto">
            <ExternalLinkIcon />
          </Clickable.Icon>
        </a>
      </Clickable.Root>
    );
  }
);

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-neutral-100 border-b p-4",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarLogo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      ref={ref}
      {...props}
    >
      <ScrollTextIcon className="size-4 stroke-2 stroke-neutral-900" />
      <Text.Root size="sm" weight="medium">
        Rolled Out
      </Text.Root>
    </div>
  );
});

const SidebarVersion = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ children, className, ...props }, ref) => {
  return (
    <Text.Root color="muted" ref={ref} size="xs" {...props} asChild>
      <a
        href={`https://github.com/spicysauce-xyz/rolled-out/releases/tag/${config.version}`}
        rel="noreferrer"
        target="_blank"
      >
        v{config.version}
      </a>
    </Text.Root>
  );
});

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn("border-neutral-100 border-t p-4", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarScrollArea: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ScrollArea.Root type="scroll">
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Viewport className="py-4">{children}</ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};

export const Sidebar = {
  Root: SidebarRoot,
  Group: SidebarGroup,
  Fill: SidebarFill,
  NavLink: SidebarNavLink,
  Link: SidebarLink,
  Button: SidebarButton,
  Header: SidebarHeader,
  Logo: SidebarLogo,
  Version: SidebarVersion,
  Footer: SidebarFooter,
  ScrollArea: SidebarScrollArea,
};
