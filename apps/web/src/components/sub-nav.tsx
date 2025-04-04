import { ScrollArea, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import React from "react";

type SubNavProps = React.HTMLAttributes<HTMLDivElement>;

const SubNavRoot = React.forwardRef<HTMLDivElement, SubNavProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-64 flex-col border-neutral-200 border-r",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

type SubNavGroupProps = React.HTMLAttributes<HTMLDivElement>;

const SubNavGroup = React.forwardRef<HTMLDivElement, SubNavGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 px-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

type SubNavLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & { icon?: LucideIcon; label: string };

const SubNavLink = React.forwardRef<HTMLAnchorElement, SubNavLinkProps>(
  ({ children, className, icon, label, ...props }, ref) => {
    const Icon = icon;

    return (
      <Link
        ref={ref}
        className={cn(
          "group/nav-link relative flex h-9 items-center gap-2 rounded-md px-2 hover:bg-neutral-50",
          "transition-colors",
          className,
        )}
        {...props}
      >
        {Icon && (
          <Icon className="size-4 shrink-0 text-neutral-400 transition-colors group-hover/link:text-neutral-500 group-data-[status=active]/nav-link:text-neutral-900" />
        )}
        <Text.Root
          weight="medium"
          size="sm"
          className="text-neutral-500 transition-colors group-hover/nav-link:text-neutral-600 group-data-[status=active]/nav-link:text-neutral-900"
        >
          {label}
        </Text.Root>
        {children}
      </Link>
    );
  },
);

const SubNavScrollArea: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ScrollArea.Root type="scroll" className="flex-1">
      <ScrollArea.Scrollbar orientation="vertical" className="w-4 p-1">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Viewport className="flex-1 py-4">
        {children}
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};

export {
  SubNavRoot as Root,
  SubNavGroup as Group,
  SubNavLink as Link,
  SubNavScrollArea as ScrollArea,
};
