import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";
import { Text } from "../text";

const avatarVariants = tv({
  slots: {
    root: "relative flex shrink-0 overflow-hidden",
  },
  variants: {
    size: {
      sm: {
        root: "size-9",
      },
      md: {
        root: "size-10",
      },
      lg: {
        root: "size-11",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type AvatarSharedProps = VariantProps<typeof avatarVariants>;

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
  AvatarSharedProps;

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => {
  const { root } = avatarVariants({ size });

  return (
    <AvatarPrimitive.Root
      ref={ref}
      {...props}
      className={root({ className })}
    />
  );
});

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "fade-in-0 aspect-square h-full w-full animate-in rounded-md object-cover object-center transition-opacity",
      className,
    )}
    {...props}
  />
));

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <Text.Root asChild weight="medium" size="sm">
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-md border border-neutral-100 bg-neutral-50",
        className,
      )}
      {...props}
    />
  </Text.Root>
));

export { AvatarRoot as Root, AvatarImage as Image, AvatarFallback as Fallback };
