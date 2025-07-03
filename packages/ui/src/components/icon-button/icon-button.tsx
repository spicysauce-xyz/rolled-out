import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import type { AsChildProp } from "../../types";
import { tv } from "../../utils";

export const iconButtonVariants = tv({
  slots: {
    root: [
      // base
      "group/button-root relative inline-flex select-none overflow-hidden",
      // hover
      "transition-[background-color,border-color]",
      // focus
      "ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
      // active
      "active:inset-shadow-transparent active:shadow-none",
    ],
    content: [
      "flex flex-1 items-center justify-center gap-2 whitespace-nowrap",
    ],
    icon: [
      // base
      "flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full",
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
        root: ["inset-shadow-default border shadow-xs"],
      },
      secondary: {
        root: ["inset-shadow-default border bg-white shadow-xs"],
      },
      tertiary: {
        root: ["border border-transparent"],
      },
    },
    size: {
      sm: {
        root: ["size-9 rounded-md"],
        content: [""],
        icon: ["size-4"],
      },
      md: {
        root: ["size-10 rounded-md"],
        content: [""],
        icon: ["size-4"],
      },
      lg: {
        root: ["size-11 rounded-md"],
        content: [""],
        icon: ["size-4"],
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
          "border-neutral-900 bg-neutral-900",
          // hover
          "hover:border-neutral-950 hover:bg-neutral-950",
          // focus
          "focus-visible:border-neutral-950 focus-visible:bg-neutral-950",
        ],
        icon: [
          "text-neutral-200",
          // hover
          "group-hover/button-root:text-neutral-100",
          // focus
          "group-focus-visible/button-root:text-neutral-100",
        ],
      },
    },
    {
      color: "accent",
      variant: "filled",
      class: {
        root: [
          "border-accent-500 bg-accent-500",
          // hover
          "hover:border-accent-600 hover:bg-accent-600",
          // focus
          "focus-visible:border-accent-600 focus-visible:bg-accent-600",
        ],
        icon: [
          "text-accent-200",
          // hover
          "group-hover/button-root:text-accent-100",
          // focus
          "group-focus-visible/button-root:text-accent-100",
        ],
      },
    },
    {
      color: "danger",
      variant: "filled",
      class: {
        root: [
          "border-danger-500 bg-danger-500",
          // hover
          "hover:border-danger-600 hover:bg-danger-600",
          // focus
          "focus-visible:border-danger-600 focus-visible:bg-danger-600",
        ],
        icon: [
          "text-danger-200",
          // hover
          "group-hover/button-root:text-danger-100",
          // focus
          "group-focus-visible/button-root:text-danger-100",
        ],
      },
    },
    {
      color: "warning",
      variant: "filled",
      class: {
        root: [
          "border-warning-500 bg-warning-500",
          // hover
          "hover:border-warning-600 hover:bg-warning-600",
          // focus
          "focus-visible:border-warning-600 focus-visible:bg-warning-600",
        ],
        icon: [
          "text-warning-200",
          // hover
          "group-hover/button-root:text-warning-100",
          // focus
          "group-focus-visible/button-root:text-warning-100",
        ],
      },
    },
    {
      color: "success",
      variant: "filled",
      class: {
        root: [
          "border-success-500 bg-success-500",
          // hover
          "hover:border-success-600 hover:bg-success-600",
          // focus
          "focus-visible:border-success-600 focus-visible:bg-success-600",
        ],
        icon: [
          "text-success-200",
          // hover
          "group-hover/button-root:text-success-100",
          // focus
          "group-focus-visible/button-root:text-success-100",
        ],
      },
    },
    {
      color: "neutral",
      variant: "secondary",
      class: {
        root: [
          "border-neutral-200 bg-white",
          // hover
          "hover:border-neutral-300 hover:bg-neutral-50",
          // focus
          "focus-visible:border-neutral-300 focus-visible:bg-neutral-50",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/button-root:text-neutral-500",
          // focus
          "group-focus-visible/button-root:text-neutral-500",
        ],
      },
    },
    {
      color: "accent",
      variant: "secondary",
      class: {
        root: [
          "border-accent-200 bg-white",
          // hover
          "hover:border-accent-300 hover:bg-accent-50",
          // focus
          "focus-visible:border-accent-300 focus-visible:bg-accent-50",
        ],
        icon: [
          "text-accent-400",
          // hover
          "group-hover/button-root:text-accent-500",
          // focus
          "group-focus-visible/button-root:text-accent-500",
        ],
      },
    },
    {
      color: "danger",
      variant: "secondary",
      class: {
        root: [
          "border-danger-200 bg-white",
          // hover
          "hover:border-danger-300 hover:bg-danger-50",
          // focus
          "focus-visible:border-danger-300 focus-visible:bg-danger-50",
        ],
        icon: [
          "text-danger-400",
          // hover
          "group-hover/button-root:text-danger-500",
          // focus
          "group-focus-visible/button-root:text-danger-500",
        ],
      },
    },
    {
      color: "warning",
      variant: "secondary",
      class: {
        root: [
          "border-warning-200 bg-white",
          // hover
          "hover:border-warning-300 hover:bg-warning-50",
          // focus
          "focus-visible:border-warning-300 focus-visible:bg-warning-50",
        ],
        icon: [
          "text-warning-400",
          // hover
          "group-hover/button-root:text-warning-500",
          // focus
          "group-focus-visible/button-root:text-warning-500",
        ],
      },
    },
    {
      color: "success",
      variant: "secondary",
      class: {
        root: [
          "border-success-200 bg-white",
          // hover
          "hover:border-success-300 hover:bg-success-50",
          // focus
          "focus-visible:border-success-300 focus-visible:bg-success-50",
        ],
        icon: [
          "text-success-400",
          // hover
          "group-hover/button-root:text-success-500",
          // focus
          "group-focus-visible/button-root:text-success-500",
        ],
      },
    },

    {
      color: "neutral",
      variant: "tertiary",
      class: {
        root: [
          // hover
          "hover:border-neutral-50 hover:bg-neutral-50",
          // focus
          "focus-visible:border-neutral-50 focus-visible:bg-neutral-50",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/button-root:text-neutral-500",
          // focus
          "group-focus-visible/button-root:text-neutral-500",
        ],
      },
    },
    {
      color: "accent",
      variant: "tertiary",
      class: {
        root: [
          // hover
          "hover:border-accent-50 hover:bg-accent-50",
          // focus
          "focus-visible:border-accent-50 focus-visible:bg-accent-50",
        ],
        icon: [
          "text-accent-400",
          // hover
          "group-hover/button-root:text-accent-500",
          // focus
          "group-focus-visible/button-root:text-accent-500",
        ],
      },
    },
    {
      color: "danger",
      variant: "tertiary",
      class: {
        root: [
          // hover
          "hover:border-danger-50 hover:bg-danger-50",
          // focus
          "focus-visible:border-danger-50 focus-visible:bg-danger-50",
        ],
        icon: [
          "text-danger-400",
          // hover
          "group-hover/button-root:text-danger-500",
          // focus
          "group-focus-visible/button-root:text-danger-500",
        ],
      },
    },
    {
      color: "warning",
      variant: "tertiary",
      class: {
        root: [
          // hover
          "hover:border-warning-50 hover:bg-warning-50",
          // focus
          "focus-visible:border-warning-50 focus-visible:bg-warning-50",
        ],
        icon: [
          "text-warning-400",
          // hover
          "group-hover/button-root:text-warning-500",
          // focus
          "group-focus-visible/button-root:text-warning-500",
        ],
      },
    },
    {
      color: "success",
      variant: "tertiary",
      class: {
        root: [
          // hover
          "hover:border-success-50 hover:bg-success-50",
          // focus
          "focus-visible:border-success-50 focus-visible:bg-success-50",
        ],
        icon: [
          "text-success-400",
          // hover
          "group-hover/button-root:text-success-500",
          // focus
          "group-focus-visible/button-root:text-success-500",
        ],
      },
    },
    {
      disabled: true,
      loading: false,
      variant: "filled",
      class: {
        root: [
          "inset-shadow-transparent border-neutral-200 bg-neutral-50 shadow-none",
          // hover
          "hover:border-neutral-200 hover:bg-neutral-50",
          // focus
          "focus-visible:border-neutral-200 focus-visible:bg-neutral-50",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/button-root:text-neutral-400",
          // focus
          "group-focus-visible/button-root:text-neutral-400",
        ],
      },
    },
    {
      disabled: true,
      loading: false,
      variant: "secondary",
      class: {
        root: [
          "inset-shadow-transparent border-neutral-50 bg-neutral-50 shadow-none",
          // hover
          "hover:border-neutral-50 hover:bg-neutral-50",
          // focus
          "focus-visible:border-neutral-50 focus-visible:bg-neutral-50",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/button-root:text-neutral-400",
          // focus
          "group-focus-visible/button-root:text-neutral-400",
        ],
      },
    },
    {
      disabled: true,
      loading: false,
      variant: "tertiary",
      class: {
        root: [
          "inset-shadow-transparent shadow-none",
          // hover
          "hover:border-transparent hover:bg-transparent",
          // focus
          "focus-visible:border-transparent focus-visible:bg-transparent",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/button-root:text-neutral-400",
          // focus
          "group-focus-visible/button-root:text-neutral-400",
        ],
      },
    },
  ],
  defaultVariants: {
    color: "neutral",
    variant: "filled",
    size: "md",
  },
});

type IconButtonSharedProps = VariantProps<typeof iconButtonVariants>;

const IconButtonContext = React.createContext<IconButtonSharedProps>({});
const useIconButtonContext = () => React.useContext(IconButtonContext);

type IconButtonRootProps = IconButtonSharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> &
  AsChildProp & {
    isLoading?: boolean;
    isDisabled?: boolean;
  };

const IconButtonRoot = React.forwardRef<HTMLButtonElement, IconButtonRootProps>(
  (
    {
      children,
      color,
      variant,
      size,
      asChild,
      className,
      isLoading,
      isDisabled,
      ...rest
    },
    forwardedRef
  ) => {
    const Component = asChild ? Slot : "button";
    const { root, content } = iconButtonVariants({
      color,
      variant,
      size,
      loading: isLoading,
      disabled: isDisabled,
    });

    return (
      <IconButtonContext.Provider
        value={{
          color,
          variant,
          size,
          loading: isLoading,
          disabled: isDisabled,
        }}
      >
        <Component
          ref={forwardedRef}
          {...rest}
          className={root({ class: className })}
          disabled={isDisabled || isLoading}
          onClick={(...args) => {
            if (isDisabled || isLoading) {
              return;
            }
            rest.onClick?.(...args);
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconButtonIcon className="animate-spin">
                <Loader2 />
              </IconButtonIcon>
            </div>
          )}
          <div className={content()}>{children}</div>
        </Component>
      </IconButtonContext.Provider>
    );
  }
);

type IconButtonIconProps = React.HTMLAttributes<HTMLDivElement> & AsChildProp;

const IconButtonIcon = React.forwardRef<HTMLDivElement, IconButtonIconProps>(
  ({ children, className, asChild, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    const { color, variant, size, loading, disabled } = useIconButtonContext();
    const { icon } = iconButtonVariants({
      color,
      variant,
      size,
      loading,
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
  }
);

export { IconButtonRoot as Root, IconButtonIcon as Icon };
