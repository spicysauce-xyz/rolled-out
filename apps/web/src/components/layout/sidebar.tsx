import { ScrollArea, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { CircleIcon, ExternalLinkIcon, type LucideIcon } from "lucide-react";
import React from "react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarRoot = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col border-neutral-100 border-r",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 px-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const SidebarFill = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("min-h-4 flex-1", className)} {...props}>
      {children}
    </div>
  );
});

type SidebarNavLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & { icon?: LucideIcon; label: string };

const SidebarNavLink = React.forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ children, className, icon, label, ...props }, ref) => {
    const Icon = icon ?? CircleIcon;

    return (
      <Link
        ref={ref}
        className={cn(
          "group/nav-link relative flex h-9 items-center gap-2 rounded-md px-2",
          // transition
          "transition-colors",
          // hover
          "hover:bg-neutral-100",
          // focus
          "focus-visible:bg-neutral-100 focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        <Icon className="size-4 shrink-0 text-neutral-400 transition-colors group-hover/nav-link:text-neutral-500 group-focus-visible/nav-link:text-neutral-500 group-data-[status=active]/nav-link:text-neutral-900" />
        <Text.Root
          weight="medium"
          size="sm"
          className="text-neutral-500 transition-colors group-hover/nav-link:text-neutral-600 group-focus-visible/nav-link:text-neutral-600 group-data-[status=active]/nav-link:text-neutral-900"
        >
          {label}
        </Text.Root>
        {children}
      </Link>
    );
  },
);

type SidebarLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & { icon?: LucideIcon; label: string };

const SidebarLink = React.forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ children, className, icon, label, ...props }, ref) => {
    const Icon = icon ?? CircleIcon;

    return (
      <a
        ref={ref}
        className={cn(
          "group/link relative flex h-9 items-center gap-2 rounded-md px-2",
          // focus
          "focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        <Icon className="size-4 shrink-0 text-neutral-400 transition-colors group-hover/link:text-neutral-500 group-focus-visible/link:text-neutral-500" />
        <Text.Root
          weight="medium"
          size="sm"
          className="text-neutral-500 transition-colors group-hover/link:text-neutral-600 group-focus-visible/link:text-neutral-600"
        >
          {label}
        </Text.Root>
        {children}
        <ExternalLinkIcon className="ml-auto size-4 text-neutral-400 transition-colors group-hover/link:text-neutral-500 group-focus-visible/link:text-neutral-500" />
      </a>
    );
  },
);

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-neutral-100 border-b p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-neutral-100 border-t p-4", className)}
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

export {
  SidebarRoot as Root,
  SidebarGroup as Group,
  SidebarFill as Fill,
  SidebarNavLink as NavLink,
  SidebarLink as Link,
  SidebarHeader as Header,
  SidebarFooter as Footer,
  SidebarScrollArea as ScrollArea,
};
