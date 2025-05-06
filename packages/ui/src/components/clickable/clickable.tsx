import { Slot } from "@radix-ui/react-slot";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import type { AsChildProp } from "../../types";
import { tv } from "../../utils";

export const clickableVariants = tv({
  slots: {
    root: [
      // base
      "group/clickable-root flex overflow-hidden select-none rounded-md",
      // hover
      "transition-[background-color,border-color]",
      // focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-transparent focus-visible:ring-accent-500",
      // active
      "active:shadow-none active:inset-shadow-transparent",
    ],
    icon: [
      // base
      "flex size-4 shrink-0 items-center justify-center [&>svg]:w-full [&>svg]:h-full",
      // hover
      "transition-colors",
    ],
  },
  variants: {
    color: {
      neutral: {},
      accent: {},
      danger: {},
      warning: {},
      success: {},
    },
    variant: {
      filled: {
        root: ["border shadow-xs inset-shadow-default"],
      },
      secondary: {
        root: ["border shadow-xs inset-shadow-default bg-white"],
      },
      tertiary: {
        root: ["border border-transparent"],
      },
    },
    loading: {
      true: {
        root: ["pointer-events-none"],
        content: ["opacity-0"],
      },
    },
    disabled: {
      true: {
        root: ["cursor-not-allowed"],
      },
    },
  },
  compoundVariants: [
    {
      color: "neutral",
      variant: "filled",
      class: {
        root: [
          "bg-neutral-900 text-white border-neutral-900",
          // hover
          "hover:bg-neutral-950 hover:border-neutral-950",
          // focus
          "focus-visible:bg-neutral-950 focus-visible:border-neutral-950",
        ],
        icon: [
          "text-neutral-200",
          // hover
          "group-hover/clickable-root:text-neutral-100",
          // focus
          "group-focus-visible/clickable-root:text-neutral-100",
        ],
      },
    },
    {
      color: "accent",
      variant: "filled",
      class: {
        root: [
          "bg-accent-500 text-white border-accent-500",
          // hover
          "hover:bg-accent-600 hover:border-accent-600",
          // focus
          "focus-visible:border-accent-600 focus-visible:bg-accent-600",
        ],
        icon: [
          "text-accent-200",
          // hover
          "group-hover/clickable-root:text-accent-100",
          // focus
          "group-focus-visible/clickable-root:text-accent-100",
        ],
      },
    },
    {
      color: "danger",
      variant: "filled",
      class: {
        root: [
          "bg-danger-500 text-white border-danger-500",
          // hover
          "hover:bg-danger-600 hover:border-danger-600",
          // focus
          "focus-visible:bg-danger-600 focus-visible:border-danger-600",
        ],
        icon: [
          "text-danger-200",
          // hover
          "group-hover/clickable-root:text-danger-100",
          // focus
          "group-focus-visible/clickable-root:text-danger-100",
        ],
      },
    },
    {
      color: "warning",
      variant: "filled",
      class: {
        root: [
          "bg-warning-500 text-white border-warning-500",
          // hover
          "hover:bg-warning-600 hover:border-warning-600",
          // focus
          "focus-visible:bg-warning-600 focus-visible:border-warning-600",
        ],
        icon: [
          "text-warning-200",
          // hover
          "group-hover/clickable-root:text-warning-100",
          // focus
          "group-focus-visible/clickable-root:text-warning-100",
        ],
      },
    },
    {
      color: "success",
      variant: "filled",
      class: {
        root: [
          "bg-success-500 text-white border-success-500",
          // hover
          "hover:bg-success-600 hover:border-success-600",
          // focus
          "focus-visible:bg-success-600 focus-visible:border-success-600",
        ],
        icon: [
          "text-success-200",
          // hover
          "group-hover/clickable-root:text-success-100",
          // focus
          "group-focus-visible/clickable-root:text-success-100",
        ],
      },
    },
    {
      color: "neutral",
      variant: "secondary",
      class: {
        root: [
          "bg-white text-neutral-500 border-neutral-200",
          // hover
          "hover:bg-neutral-50 hover:text-neutral-600 hover:border-neutral-300",
          // focus
          "focus-visible:bg-neutral-50 focus-visible:text-neutral-600 focus-visible:border-neutral-200",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/clickable-root:text-neutral-500",
          // focus
          "group-focus-visible/clickable-root:text-neutral-500",
        ],
      },
    },
    {
      color: "accent",
      variant: "secondary",
      class: {
        root: [
          "bg-white text-accent-500 border-accent-200",
          // hover
          "hover:bg-accent-50 hover:text-accent-600 hover:border-accent-300",
          // focus
          "focus-visible:bg-accent-50 focus-visible:text-accent-600 focus-visible:border-accent-300",
        ],
        icon: [
          "text-accent-400",
          // hover
          "group-hover/clickable-root:text-accent-500",
          // focus
          "group-focus-visible/clickable-root:text-accent-500",
        ],
      },
    },
    {
      color: "danger",
      variant: "secondary",
      class: {
        root: [
          "bg-white text-danger-500 border-danger-200",
          // hover
          "hover:bg-danger-50 hover:text-danger-600 hover:border-danger-300",
          // focus
          "focus-visible:bg-danger-50 focus-visible:text-danger-600 focus-visible:border-danger-300",
        ],
        icon: [
          "text-danger-400",
          // hover
          "group-hover/clickable-root:text-danger-500",
          // focus
          "group-focus-visible/clickable-root:text-danger-500",
        ],
      },
    },
    {
      color: "warning",
      variant: "secondary",
      class: {
        root: [
          "bg-white text-warning-500 border-warning-200",
          // hover
          "hover:bg-warning-50 hover:text-warning-600 hover:border-warning-300",
          // focus
          "focus-visible:bg-warning-50 focus-visible:text-warning-600 focus-visible:border-warning-300",
        ],
        icon: [
          "text-warning-400",
          // hover
          "group-hover/clickable-root:text-warning-500",
          // focus
          "group-focus-visible/clickable-root:text-warning-500",
        ],
      },
    },
    {
      color: "success",
      variant: "secondary",
      class: {
        root: [
          "bg-white text-success-500 border-success-200",
          // hover
          "hover:bg-success-50 hover:text-success-600 hover:border-success-300",
          // focus
          "focus-visible:bg-success-50 focus-visible:text-success-600 focus-visible:border-success-300",
        ],
        icon: [
          "text-success-400",
          // hover
          "group-hover/clickable-root:text-success-500",
          // focus
          "group-focus-visible/clickable-root:text-success-500",
        ],
      },
    },

    {
      color: "neutral",
      variant: "tertiary",
      class: {
        root: [
          "text-neutral-500",
          // hover
          "hover:bg-neutral-50 hover:border-neutral-50 hover:text-neutral-600",
          // focus
          "focus-visible:bg-neutral-50 focus-visible:border-neutral-50 focus-visible:text-neutral-600",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/clickable-root:text-neutral-500",
          // focus
          "group-focus-visible/clickable-root:text-neutral-500",
        ],
      },
    },
    {
      color: "accent",
      variant: "tertiary",
      class: {
        root: [
          "text-accent-500",
          // hover
          "hover:bg-accent-50 hover:border-accent-50 hover:text-accent-600",
          // focus
          "focus-visible:bg-accent-50 focus-visible:border-accent-50 focus-visible:text-accent-600",
        ],
        icon: [
          "text-accent-400",
          // hover
          "group-hover/clickable-root:text-accent-500",
          // focus
          "group-focus-visible/clickable-root:text-accent-500",
        ],
      },
    },
    {
      color: "danger",
      variant: "tertiary",
      class: {
        root: [
          "text-danger-500",
          // hover
          "hover:bg-danger-50 hover:border-danger-50 hover:text-danger-600",
          // focus
          "focus-visible:bg-danger-50 focus-visible:border-danger-50 focus-visible:text-danger-600",
        ],
        icon: [
          "text-danger-400",
          // hover
          "group-hover/clickable-root:text-danger-500",
          // focus
          "group-focus-visible/clickable-root:text-danger-500",
        ],
      },
    },
    {
      color: "warning",
      variant: "tertiary",
      class: {
        root: [
          "text-warning-500",
          // hover
          "hover:bg-warning-50 hover:border-warning-50 hover:text-warning-600",
          // focus
          "focus-visible:bg-warning-50 focus-visible:border-warning-50 focus-visible:text-warning-600",
        ],
        icon: [
          "text-warning-400",
          // hover
          "group-hover/clickable-root:text-warning-500",
          // focus
          "group-focus-visible/clickable-root:text-warning-500",
        ],
      },
    },
    {
      color: "success",
      variant: "tertiary",
      class: {
        root: [
          "text-success-500",
          // hover
          "hover:bg-success-50 hover:border-success-50 hover:text-success-600",
          // focus
          "focus-visible:bg-success-50 focus-visible:border-success-50 focus-visible:text-success-600",
        ],
        icon: [
          "text-success-400",
          // hover
          "group-hover/clickable-root:text-success-500",
          // focus
          "group-focus-visible/clickable-root:text-success-500",
        ],
      },
    },
    {
      disabled: true,
      variant: "filled",
      class: {
        root: [
          "bg-neutral-50 border-neutral-200 text-neutral-400 shadow-none inset-shadow-transparent",
          // hover
          "hover:bg-neutral-50 hover:border-neutral-200 hover:text-neutral-400",
          // focus
          "focus-visible:bg-neutral-50 focus-visible:border-neutral-200 focus-visible:text-neutral-400",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/clickable-root:text-neutral-400",
          // focus
          "group-focus-visible/clickable-root:text-neutral-400",
        ],
      },
    },
    {
      disabled: true,
      variant: "secondary",
      class: {
        root: [
          "bg-neutral-50 border-neutral-50 text-neutral-400 shadow-none inset-shadow-transparent",
          // hover
          "hover:bg-neutral-50 hover:border-neutral-50 hover:text-neutral-400",
          // focus
          "focus-visible:bg-neutral-50 focus-visible:border-neutral-50 focus-visible:text-neutral-400",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/clickable-root:text-neutral-400",
          // focus
          "group-focus-visible/clickable-root:text-neutral-400",
        ],
      },
    },
    {
      disabled: true,
      variant: "tertiary",
      class: {
        root: [
          "text-neutral-400 shadow-none inset-shadow-transparent",
          // hover
          "hover:bg-transparent hover:border-transparent hover:text-neutral-400",
          // focus
          "focus-visible:bg-transparent focus-visible:border-transparent focus-visible:text-neutral-400",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/clickable-root:text-neutral-400",
          // focus
          "group-focus-visible/clickable-root:text-neutral-400",
        ],
      },
    },
  ],
  defaultVariants: {
    color: "neutral",
    variant: "filled",
  },
});

type ClickableSharedProps = VariantProps<typeof clickableVariants>;

const ClickableContext = React.createContext<ClickableSharedProps>({});
const useClickableContext = () => React.useContext(ClickableContext);

export type ClickableRootProps = Omit<ClickableSharedProps, "disabled"> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> &
  AsChildProp & {
    isDisabled?: boolean;
  };

const ClickableRoot = React.forwardRef<HTMLButtonElement, ClickableRootProps>(
  (
    { children, color, variant, asChild, className, isDisabled, ...rest },
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button";
    const { root } = clickableVariants({
      color,
      variant,
      disabled: isDisabled,
    });

    return (
      <ClickableContext.Provider
        value={{
          color,
          variant,
          disabled: isDisabled,
        }}
      >
        <Component
          ref={forwardedRef}
          {...rest}
          disabled={isDisabled}
          onClick={(...args) => {
            if (isDisabled) return;
            rest.onClick?.(...args);
          }}
          className={root({ class: className })}
        >
          {children}
        </Component>
      </ClickableContext.Provider>
    );
  },
);

type ClickableIconProps = React.HTMLAttributes<HTMLDivElement> & AsChildProp;

const ClickableIcon = React.forwardRef<HTMLDivElement, ClickableIconProps>(
  ({ children, className, asChild, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    const { color, variant, disabled } = useClickableContext();
    const { icon } = clickableVariants({
      color,
      variant,
      disabled,
    });

    return (
      <Component
        ref={forwardedRef}
        {...rest}
        className={icon({ class: className })}
      >
        {children}
      </Component>
    );
  },
);

export { ClickableRoot as Root, ClickableIcon as Icon };
