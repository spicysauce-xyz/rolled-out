import {
  Fallback as RadixAvatarFallback,
  Image as RadixAvatarImage,
  Root as RadixAvatarRoot,
} from "@radix-ui/react-avatar";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";
import { Text } from "../text";

const avatarVariants = tv({
  slots: {
    root: "relative flex shrink-0 overflow-clip rounded-md bg-neutral-100",
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

type AvatarProps = React.ComponentPropsWithoutRef<typeof RadixAvatarRoot> &
  AvatarSharedProps;

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof RadixAvatarRoot>,
  AvatarProps
>(({ className, size, ...props }, ref) => {
  const { root } = avatarVariants({ size });

  return (
    <RadixAvatarRoot ref={ref} {...props} className={root({ className })} />
  );
});

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof RadixAvatarImage>,
  React.ComponentPropsWithoutRef<typeof RadixAvatarImage>
>(({ className, ...props }, ref) => (
  <RadixAvatarImage
    className={cn(
      "fade-in-0 aspect-square h-full w-full animate-in rounded-[inherit] object-cover object-center transition-opacity",
      className
    )}
    ref={ref}
    {...props}
  />
));

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof RadixAvatarFallback>,
  React.ComponentPropsWithoutRef<typeof RadixAvatarFallback>
>(({ className, ...props }, ref) => (
  <Text.Root asChild size="sm" weight="medium">
    <RadixAvatarFallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-[inherit] border border-neutral-100 bg-neutral-50 uppercase",
        className
      )}
      ref={ref}
      {...props}
    />
  </Text.Root>
));

export { AvatarRoot as Root, AvatarImage as Image, AvatarFallback as Fallback };
