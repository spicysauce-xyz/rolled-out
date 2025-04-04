import * as ScrollAreaPrimitives from "@radix-ui/react-scroll-area";
import * as React from "react";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";

const ScrollAreaRoot = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitives.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitives.Root
    ref={ref}
    className={cn("relative flex-1 overflow-hidden", className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitives.Root>
));

const ScrollAreaViewport = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitives.Viewport>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitives.Viewport
    ref={ref}
    className={cn(
      "[&>div]:!flex h-full w-full flex-1 rounded-[inherit] [&>div]:min-h-full [&>div]:min-w-full [&>div]:flex-col",
      className,
    )}
    {...props}
  >
    {children}
  </ScrollAreaPrimitives.Viewport>
));

const scrollBarVariants = tv({
  slots: {
    root: "flex group/scrollbar touch-none select-none transition-colors",
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
  React.ComponentRef<typeof ScrollAreaPrimitives.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitives.Scrollbar> &
    VariantProps<typeof scrollBarVariants>
>(({ className, orientation = "vertical", size, ...props }, ref) => {
  const { root } = scrollBarVariants({ size, orientation });

  return (
    <ScrollAreaPrimitives.Scrollbar
      ref={ref}
      orientation={orientation}
      className={root({ className })}
      {...props}
    />
  );
});

const ScrollAreaThumb = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitives.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitives.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitives.Thumb
    ref={ref}
    className={cn(
      "rounded-full bg-neutral-200",
      // vertical
      "group-data-[orientation=vertical]/scrollbar:!w-full",
      // horizontal
      "group-data-[orientation=horizontal]/scrollbar:!h-full",
      className,
    )}
    {...props}
  />
));

const ScrollAreaCorner = ScrollAreaPrimitives.Corner;

export {
  ScrollAreaRoot as Root,
  ScrollAreaViewport as Viewport,
  ScrollAreaScrollbar as Scrollbar,
  ScrollAreaThumb as Thumb,
  ScrollAreaCorner as Corner,
};
