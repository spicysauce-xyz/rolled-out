import {
  Corner as RadixScrollAreaCorner,
  Root as RadixScrollAreaRoot,
  Scrollbar as RadixScrollAreaScrollbar,
  Thumb as RadixScrollAreaThumb,
  Viewport as RadixScrollAreaViewport,
} from "@radix-ui/react-scroll-area";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";

const ScrollAreaRoot = React.forwardRef<
  React.ComponentRef<typeof RadixScrollAreaRoot>,
  React.ComponentPropsWithoutRef<typeof RadixScrollAreaRoot>
>(({ className, children, ...props }, ref) => (
  <RadixScrollAreaRoot
    className={cn("relative flex flex-1 overflow-hidden", className)}
    ref={ref}
    {...props}
  >
    {children}
  </RadixScrollAreaRoot>
));

const ScrollAreaViewport = React.forwardRef<
  React.ComponentRef<typeof RadixScrollAreaViewport>,
  React.ComponentPropsWithoutRef<typeof RadixScrollAreaViewport>
>(({ className, children, ...props }, ref) => (
  <RadixScrollAreaViewport
    className={cn(
      "[&>div]:!flex w-full rounded-[inherit] outline-0 [&>div]:min-h-full [&>div]:min-w-full [&>div]:flex-col",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </RadixScrollAreaViewport>
));

const scrollBarVariants = tv({
  slots: {
    root: "group/scrollbar flex touch-none select-none transition-colors",
  },
  variants: {
    size: {
      sm: {},
      md: {},
    },
    orientation: {
      vertical: {},
      horizontal: {},
    },
  },
  compoundVariants: [
    {
      size: "sm",
      orientation: "horizontal",
      className: { root: "h-2 p-0.5" },
    },
    {
      size: "md",
      orientation: "horizontal",
      className: { root: "h-4 p-1" },
    },
    {
      size: "sm",
      orientation: "vertical",
      className: { root: "w-2 p-0.5" },
    },
    {
      size: "md",
      orientation: "vertical",
      className: { root: "w-4 p-1" },
    },
  ],
  defaultVariants: {
    size: "md",
    orientation: "vertical",
  },
});

const ScrollAreaScrollbar = React.forwardRef<
  React.ComponentRef<typeof RadixScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof RadixScrollAreaScrollbar> &
    VariantProps<typeof scrollBarVariants>
>(({ className, orientation = "vertical", size, ...props }, ref) => {
  const { root } = scrollBarVariants({ size, orientation });

  return (
    <RadixScrollAreaScrollbar
      className={root({ className })}
      orientation={orientation}
      ref={ref}
      {...props}
    />
  );
});

const ScrollAreaThumb = React.forwardRef<
  React.ComponentRef<typeof RadixScrollAreaThumb>,
  React.ComponentPropsWithoutRef<typeof RadixScrollAreaThumb>
>(({ className, ...props }, ref) => (
  <RadixScrollAreaThumb
    className={cn(
      "rounded-full bg-neutral-200",
      // vertical
      "group-data-[orientation=vertical]/scrollbar:!w-full",
      // horizontal
      "group-data-[orientation=horizontal]/scrollbar:!h-full",
      className
    )}
    ref={ref}
    {...props}
  />
));

const ScrollAreaCorner = RadixScrollAreaCorner;

export {
  ScrollAreaRoot as Root,
  ScrollAreaViewport as Viewport,
  ScrollAreaScrollbar as Scrollbar,
  ScrollAreaThumb as Thumb,
  ScrollAreaCorner as Corner,
};
