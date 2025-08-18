import { ScrollArea } from "@base-ui-components/react/scroll-area";
import type React from "react";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";

const ScrollAreaRoot = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollArea.Root>) => (
  <ScrollArea.Root
    className={cn("relative flex flex-1", className)}
    {...props}
  />
);

const ScrollAreaViewport = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollArea.Viewport>) => (
  <ScrollArea.Viewport
    className={cn("rounded-[inherit] outline-0", className)}
    {...props}
  />
);

const scrollBarVariants = tv({
  slots: {
    root: "group/scrollbar flex touch-none select-none opacity-0 transition-opacity data-[scrolling]:opacity-100",
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

const ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  size,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollArea.Scrollbar> &
  VariantProps<typeof scrollBarVariants>) => {
  const { root } = scrollBarVariants({ size, orientation });

  return (
    <ScrollArea.Scrollbar
      className={(state) =>
        root({
          className:
            typeof className === "function" ? className(state) : className,
        })
      }
      orientation={orientation}
      {...props}
    />
  );
};

const ScrollAreaThumb = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollArea.Thumb>) => (
  <ScrollArea.Thumb
    className={cn(
      "rounded-full bg-neutral-200",
      // vertical
      "group-data-[orientation=vertical]/scrollbar:!w-full",
      // horizontal
      "group-data-[orientation=horizontal]/scrollbar:!h-full",
      className
    )}
    {...props}
  />
);

const ScrollAreaCorner = ScrollArea.Corner;

export {
  ScrollAreaRoot as Root,
  ScrollAreaViewport as Viewport,
  ScrollAreaScrollbar as Scrollbar,
  ScrollAreaThumb as Thumb,
  ScrollAreaCorner as Corner,
};
