import { Slot } from "@radix-ui/react-slot";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import type { AsChildProp } from "../../types";
import { tv } from "../../utils";

export const textVariants = tv({
  slots: {
    root: ["tracking-tight"],
  },
  variants: {
    variant: {
      text: {},
      display: {},
    },
    size: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
    },
    weight: {
      normal: { root: ["font-weight-400"] },
      medium: { root: ["font-weight-500"] },
      semibold: { root: ["font-weight-600"] },
    },
    color: {
      neutral: { root: ["text-neutral-900"] },
      muted: { root: ["text-neutral-500"] },
      accent: { root: ["text-accent-500"] },
      danger: { root: ["text-danger-500"] },
      warning: { root: ["text-warning-500"] },
      success: { root: ["text-success-500"] },
    },
  },
  compoundVariants: [
    {
      variant: "text",
      size: "xs",
      class: { root: ["text-xs"] },
    },
    {
      variant: "text",
      size: "sm",
      class: { root: ["text-sm"] },
    },
    {
      variant: "text",
      size: "md",
      class: { root: ["text-md"] },
    },
    {
      variant: "text",
      size: "lg",
      class: { root: ["text-lg"] },
    },
    {
      variant: "display",
      size: "xs",
      class: { root: ["text-display-xs"] },
    },
    {
      variant: "display",
      size: "sm",
      class: { root: ["text-display-sm"] },
    },
    {
      variant: "display",
      size: "md",
      class: { root: ["text-display-md"] },
    },
    {
      variant: "display",
      size: "lg",
      class: { root: ["text-display-lg"] },
    },
  ],
  defaultVariants: {
    variant: "text",
    size: "md",
    weight: "normal",
    color: "neutral",
  },
});

type TextSharedProps = VariantProps<typeof textVariants>;

type TextProps = React.HTMLAttributes<HTMLParagraphElement> &
  TextSharedProps &
  AsChildProp;

const TextRoot = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    { children, className, asChild, size, weight, variant, color, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "p";
    const { root } = textVariants({ size, weight, variant, color });

    return (
      <Comp ref={ref} {...props} className={root({ className })}>
        {children}
      </Comp>
    );
  }
);

export { TextRoot as Root };
