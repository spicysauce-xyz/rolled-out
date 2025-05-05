import { Slot } from "@radix-ui/react-slot";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import type { AsChildProp } from "../../types";
import { tv } from "../../utils";

export const buttonGroupVariants = tv({
  slots: {
    root: [
      // base
      "bg-white border border-neutral-200 rounded-md shadow-xs divide-x divide-neutral-200 flex items-center",
      // transition
      "transition-[background-color,border-color]",
      // hover
      "hover:border-neutral-300 hover:divide-neutral-300",
      // focus
      "has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-focus-visible:ring-accent-500 has-focus-visible:border-neutral-300 has-focus-visible:divide-neutral-300",
    ],
    item: [
      // base
      "group/button-root items-center gap-2 h-full inline-flex relative overflow-hidden select-none inset-shadow-default text-neutral-500",
      // transition
      "transition-[background-color,border-color]",
      // hover
      "hover:bg-neutral-50 hover:text-neutral-600",
      // focus
      "focus-visible:outline-none focus-visible:bg-neutral-50 focus-visible:text-neutral-600",
      // misc
      "first:rounded-l-[inherit] last:rounded-r-[inherit]",
    ],
    icon: [
      // base
      "flex shrink-0 items-center justify-center [&>svg]:w-full [&>svg]:h-full text-neutral-400",
      // transition
      "transition-colors",
      // hover
      "group-hover/button-root:text-neutral-500",
      // focus
      "group-focus-visible/button-root:text-neutral-500",
    ],
  },
  variants: {
    size: {
      sm: {
        root: ["h-9"],
        item: ["font-weight-500 text-sm px-3"],
        icon: ["size-4"],
      },
      md: {
        root: ["h-10"],
        item: ["font-weight-500 text-sm px-4"],
        icon: ["size-4"],
      },
      lg: {
        root: ["h-11"],
        item: ["font-weight-500 text-md px-4.5"],
        icon: ["size-4"],
      },
    },
    active: {
      true: {
        item: ["bg-neutral-50 text-neutral-900"],
        icon: [
          // base
          "text-neutral-900",
          // hover
          "group-hover/button-root:text-neutral-900",
          // focus
          "group-focus-visible/button-root:text-neutral-900",
        ],
      },
    },
    disabled: {
      true: {
        item: ["cursor-not-allowed text-neutral-400 hover:bg-white"],
        icon: [
          // base
          "text-neutral-400",
          // hover
          "group-hover/button-root:text-neutral-400",
          // focus
          "group-focus-visible/button-root:text-neutral-400",
        ],
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ButtonGroupSharedProps = VariantProps<typeof buttonGroupVariants>;

const ButtonGroupContext = React.createContext<
  Pick<ButtonGroupSharedProps, "size">
>({});
const useButtonGroupContext = () => React.useContext(ButtonGroupContext);

type ButtonGroupRootProps = Pick<ButtonGroupSharedProps, "size"> &
  Omit<React.HTMLAttributes<HTMLDivElement>, "disabled">;

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ children, className, size, ...rest }, forwardedRef) => {
    const { root } = buttonGroupVariants({
      size,
    });

    return (
      <ButtonGroupContext.Provider value={{ size }}>
        <div
          ref={forwardedRef}
          {...rest}
          className={root({ class: className })}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  },
);

const ButtonGroupItemContext = React.createContext<{
  isActive?: boolean;
  isDisabled?: boolean;
}>({});

const useButtonGroupItemContext = () =>
  React.useContext(ButtonGroupItemContext);

type ButtonGroupItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> &
  AsChildProp & {
    isActive?: boolean;
    isDisabled?: boolean;
  };

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(
  (
    { children, asChild, className, isActive, isDisabled, ...rest },
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button";
    const { size } = useButtonGroupContext();
    const { item } = buttonGroupVariants({
      size,
      active: isActive,
      disabled: isDisabled,
    });

    return (
      <ButtonGroupItemContext.Provider value={{ isActive, isDisabled }}>
        <Component
          ref={forwardedRef}
          {...rest}
          disabled={isDisabled}
          onClick={(...args) => {
            if (isDisabled) return;
            rest.onClick?.(...args);
          }}
          className={item({ class: className })}
        >
          {children}
        </Component>
      </ButtonGroupItemContext.Provider>
    );
  },
);

type ButtonIconProps = React.HTMLAttributes<HTMLDivElement> & AsChildProp;

const ButtonGroupItemIcon = React.forwardRef<HTMLDivElement, ButtonIconProps>(
  ({ children, className, asChild, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    const { size } = useButtonGroupContext();
    const { isActive, isDisabled } = useButtonGroupItemContext();
    const { icon } = buttonGroupVariants({
      size,
      active: isActive,
      disabled: isDisabled,
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

export {
  ButtonGroupRoot as Root,
  ButtonGroupItem as Item,
  ButtonGroupItemIcon as Icon,
};
