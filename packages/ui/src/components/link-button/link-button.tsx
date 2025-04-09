import { Slot } from "@radix-ui/react-slot";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import type { AsChildProp } from "../../types";
import { tv } from "../../utils";

export const linkButtonVariants = tv({
  slots: {
    root: [
      // base
      "group/link-button-root inline-flex relative overflow-hidden select-none font-weight-500",
      // hover
      "transition-all",
      // focus
      "focus-visible:outline-none ring-2 ring-transparent",
    ],
    content: ["flex flex-1 gap-2 items-center whitespace-nowrap"],
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
      muted: {},
      danger: {},
      warning: {},
      success: {},
    },
    size: {
      sm: {
        content: ["text-sm"],
      },
      md: {
        content: ["text-md"],
      },
      lg: {
        content: ["text-lg"],
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
      class: {
        root: [
          "text-neutral-800",
          // hover
          "hover:text-neutral-900",
          // focus
          "focus-visible:text-neutral-900 focus-visible:ring-neutral-300",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/link-button-root:text-neutral-500",
          // focus
          "group-focus-visible/link-button-root:text-neutral-500",
        ],
      },
    },
    {
      color: "accent",
      class: {
        root: [
          "text-accent-500",
          // hover
          "hover:text-accent-600",
          // focus
          "focus-visible:text-accent-600 focus-visible:ring-accent-300",
        ],
        icon: [
          "text-accent-400",
          // hover
          "group-hover/link-button-root:text-accent-500",
          // focus
          "group-focus-visible/link-button-root:text-accent-500",
        ],
      },
    },
    {
      color: "muted",
      class: {
        root: [
          "text-neutral-500",
          // hover
          "hover:text-neutral-600",
          // focus
          "focus-visible:text-neutral-600 focus-visible:ring-neutral-300",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/link-button-root:text-neutral-500",
          // focus
          "group-focus-visible/link-button-root:text-neutral-500",
        ],
      },
    },
    {
      color: "danger",
      class: {
        root: [
          "text-danger-500",
          // hover
          "hover:text-danger-600",
          // focus
          "focus-visible:text-danger-600 focus-visible:ring-danger-300",
        ],
        icon: [
          "text-danger-400",
          // hover
          "group-hover/link-button-root:text-danger-500",
          // focus
          "group-focus-visible/link-button-root:text-danger-500",
        ],
      },
    },
    {
      color: "warning",
      class: {
        root: [
          "text-warning-500",
          // hover
          "hover:text-warning-600",
          // focus
          "focus-visible:text-warning-600 focus-visible:ring-warning-300",
        ],
        icon: [
          "text-warning-400",
          // hover
          "group-hover/link-button-root:text-warning-500",
          // focus
          "group-focus-visible/link-button-root:text-warning-500",
        ],
      },
    },
    {
      color: "success",
      class: {
        root: [
          "text-success-500",
          // hover
          "hover:text-success-600",
          // focus
          "focus-visible:text-success-600 focus-visible:ring-success-300",
        ],
        icon: [
          "text-success-400",
          // hover
          "group-hover/link-button-root:text-success-500",
          // focus
          "group-focus-visible/link-button-root:text-success-500",
        ],
      },
    },
    {
      disabled: true,
      class: {
        root: [
          "text-neutral-400",
          // hover
          "hover:text-neutral-400",
          // focus
          "focus-visible:text-neutral-400",
        ],
        icon: [
          "text-neutral-400",
          // hover
          "group-hover/link-button-root:text-neutral-400",
          // focus
          "group-focus-visible/link-button-root:text-neutral-400",
        ],
      },
    },
  ],
  defaultVariants: {
    color: "neutral",
    size: "sm",
  },
});

type LinkButtonSharedProps = VariantProps<typeof linkButtonVariants>;

const LinkButtonContext = React.createContext<LinkButtonSharedProps>({});
const useLinkButtonContext = () => React.useContext(LinkButtonContext);

export type LinkButtonRootProps = Omit<LinkButtonSharedProps, "disabled"> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> &
  AsChildProp & {
    isDisabled?: boolean;
  };

const LinkButtonRoot = React.forwardRef<HTMLButtonElement, LinkButtonRootProps>(
  (
    { children, color, size, asChild, className, isDisabled, ...rest },
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button";
    const { root, content } = linkButtonVariants({
      color,
      size,
      disabled: isDisabled,
    });

    return (
      <LinkButtonContext.Provider
        value={{
          color,
          size,
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
          <div className={content()}>{children}</div>
        </Component>
      </LinkButtonContext.Provider>
    );
  },
);

type LinkButtonIconProps = React.HTMLAttributes<HTMLDivElement> & AsChildProp;

const LinkButtonIcon = React.forwardRef<HTMLDivElement, LinkButtonIconProps>(
  ({ children, className, asChild, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    const { color, size, disabled } = useLinkButtonContext();
    const { icon } = linkButtonVariants({
      color,
      size,
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

export { LinkButtonRoot as Root, LinkButtonIcon as Icon };
