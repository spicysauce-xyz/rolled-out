import { Avatar } from "@base-ui-components/react/avatar";
import type React from "react";
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
        root: "size-8",
      },
      md: {
        root: "size-9",
      },
      lg: {
        root: "size-10",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type AvatarSharedProps = VariantProps<typeof avatarVariants>;

type AvatarProps = React.ComponentPropsWithRef<typeof Avatar.Root> &
  AvatarSharedProps;

const AvatarRoot: React.FC<AvatarProps> = ({ className, size, ...props }) => {
  const { root } = avatarVariants({ size });

  return (
    <Avatar.Root
      {...props}
      className={(state) =>
        root({
          className:
            typeof className === "function" ? className(state) : className,
        })
      }
    />
  );
};

const AvatarImage: React.FC<
  React.ComponentPropsWithRef<typeof Avatar.Image>
> = ({ className, ...props }) => (
  <Avatar.Image
    className={cn(
      "aspect-square h-full w-full rounded-[inherit] object-cover object-center transition-opacity",
      className
    )}
    {...props}
  />
);

const AvatarFallback: React.FC<
  React.ComponentPropsWithRef<typeof Avatar.Fallback>
> = ({ className, ...props }) => (
  <Avatar.Fallback
    className={cn(
      "flex h-full w-full items-center justify-center rounded-[inherit] border border-neutral-200 bg-neutral-100 text-neutral-900 text-sm uppercase transition-colors",
      className
    )}
    render={<Text.Root className="text-white" />}
    {...props}
  />
);

export { AvatarRoot as Root, AvatarImage as Image, AvatarFallback as Fallback };
