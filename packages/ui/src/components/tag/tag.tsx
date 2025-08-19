import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "tailwind-variants";
import { cn, tv } from "../../utils";

export const tagVariants = tv({
  slots: {
    root: [
      "flex items-center justify-center rounded-md px-2.5 font-[450] text-md transition-colors",
    ],
  },
  variants: {
    size: {
      sm: {
        root: "h-8 px-2",
      },
      md: {
        root: "h-9 px-2.5",
      },
      lg: {
        root: "h-10 px-3",
      },
    },
    color: {
      1: {
        root: "bg-misc-1-50 text-misc-1-500",
      },
      2: {
        root: "bg-misc-2-50 text-misc-2-500",
      },
      3: {
        root: "bg-misc-3-50 text-misc-3-500",
      },
      4: {
        root: "bg-misc-4-50 text-misc-4-500",
      },
      5: {
        root: "bg-misc-5-50 text-misc-5-500",
      },
      6: {
        root: "bg-misc-6-50 text-misc-6-500",
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
  defaultVariants: {
    size: "md",
  },
});

export const getTagColor = (tag: string) => {
  return ((tag.length % 6) + 1) as VariantProps<typeof tagVariants>["color"];
};

interface TagRootProps extends useRender.ComponentProps<"div"> {
  className?: string;
  children: string;
  isInteractive?: boolean;
  size?: VariantProps<typeof tagVariants>["size"];
}

const TagRoot = ({
  render = <div />,
  isInteractive,
  className,
  size,
  ...props
}: TagRootProps) => {
  const color = getTagColor(props.children);

  const { root } = tagVariants({
    color,
    isInteractive,
    size,
  });

  const defaultProps = {
    className: cn(
      root({
        className,
      })
    ),
  };

  const element = useRender({
    render,
    props: mergeProps(defaultProps, props),
  });

  return element;
};

export { TagRoot as Root };
