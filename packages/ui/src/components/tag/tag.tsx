import { forwardRef } from "react";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";
import { Text } from "../text";

export const tagVariants = tv({
  slots: {
    root: [
      "flex items-center justify-center rounded-md px-3 h-10 transition-colors",
    ],
    text: ["text-inherit"],
  },
  variants: {
    color: {
      1: {
        root: "bg-misc-1-50",
        text: "text-misc-1-500",
      },
      2: {
        root: "bg-misc-2-50",
        text: "text-misc-2-500",
      },
      3: {
        root: "bg-misc-3-50",
        text: "text-misc-3-500",
      },
      4: {
        root: "bg-misc-4-50",
        text: "text-misc-4-500",
      },
      5: {
        root: "bg-misc-5-50",
        text: "text-misc-5-500",
      },
      6: {
        root: "bg-misc-6-50",
        text: "text-misc-6-500",
      },
    },
    isInteractive: {
      true: {},
    },
  },
  compoundVariants: [
    {
      color: 1,
      isInteractive: true,
      className: { root: "hover:bg-misc-1-100 focus-visible:bg-misc-1-100" },
    },
    {
      color: 2,
      isInteractive: true,
      className: { root: "hover:bg-misc-2-100 focus-visible:bg-misc-2-100" },
    },
    {
      color: 3,
      isInteractive: true,
      className: { root: "hover:bg-misc-3-100 focus-visible:bg-misc-3-100" },
    },
    {
      color: 4,
      isInteractive: true,
      className: { root: "hover:bg-misc-4-100 focus-visible:bg-misc-4-100" },
    },
    {
      color: 5,
      isInteractive: true,
      className: { root: "hover:bg-misc-5-100 focus-visible:bg-misc-5-100" },
    },
    {
      color: 6,
      isInteractive: true,
      className: { root: "hover:bg-misc-6-100 focus-visible:bg-misc-6-100" },
    },
  ],
});

export const getTagColor = (tag: string) => {
  return ((tag.length % 6) + 1) as VariantProps<typeof tagVariants>["color"];
};

const TagRoot = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: string;
    isInteractive?: boolean;
  }
>(({ className, children, isInteractive, ...props }, ref) => {
  const color = getTagColor(children);

  const { root, text } = tagVariants({ color, isInteractive });

  return (
    <div ref={ref} className={cn(root({ className }))} {...props}>
      <Text.Root size="sm" weight="medium" className={text()}>
        {children}
      </Text.Root>
    </div>
  );
});

export { TagRoot as Root };
