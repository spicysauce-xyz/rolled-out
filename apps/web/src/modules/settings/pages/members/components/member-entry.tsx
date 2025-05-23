import { Avatar, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import type React from "react";
import { forwardRef, useMemo } from "react";

const MemberEntryRoot = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("group flex items-start justify-between gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

const MemberEntryGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

interface MemberEntryAvatarProps
  extends React.ComponentPropsWithRef<typeof Avatar.Root> {
  name?: string;
  email?: string;
  image?: string;
}

const MemberEntryAvatar = forwardRef<
  React.ComponentRef<typeof Avatar.Root>,
  MemberEntryAvatarProps
>(({ children, name, email, image, className, ...props }, ref) => {
  const fallback = useMemo(() => {
    if (name)
      return name
        .toUpperCase()
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("");
    if (email) return email[0].toUpperCase();
    return "";
  }, [name, email]);

  return (
    <div className="relative">
      <Avatar.Root ref={ref} className={className} {...props}>
        <Avatar.Image src={image} />
        <Avatar.Fallback>{fallback}</Avatar.Fallback>
      </Avatar.Root>
      {children}
    </div>
  );
});

interface MemberEntryAvatarBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

const MemberEntryAvatarBadge = forwardRef<
  HTMLDivElement,
  MemberEntryAvatarBadgeProps
>(({ children, label, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "-right-1.5 -top-1.5 absolute flex items-center justify-center rounded-full bg-accent-500 px-0.75 text-[8px] text-white",
        className,
      )}
      {...props}
    >
      {label}
    </div>
  );
});

const MemberEntryContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    >
      {children}
    </div>
  );
});

const MemberEntryHeading = forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ children, className, ...props }, ref) => {
  return (
    <Text.Root
      size="sm"
      weight="medium"
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </Text.Root>
  );
});

const MemberEntrySubheading = forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ children, className, ...props }, ref) => {
  return (
    <Text.Root
      size="xs"
      color="muted"
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </Text.Root>
  );
});

export {
  MemberEntryRoot as Root,
  MemberEntryGroup as Group,
  MemberEntryAvatar as Avatar,
  MemberEntryAvatarBadge as AvatarBadge,
  MemberEntryContent as Content,
  MemberEntryHeading as Heading,
  MemberEntrySubheading as Subheading,
};
