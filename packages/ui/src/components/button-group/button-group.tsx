import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";

export const buttonGroupVariants = tv({
  slots: {
    root: [
      // base
      "flex items-center divide-x divide-neutral-200 rounded-md border border-neutral-200 bg-white shadow-xs",
      // transition
      "transition-[background-color,border-color]",
      // hover
      "hover:divide-neutral-300 hover:border-neutral-300",
      // focus
      "has-focus-visible:divide-neutral-300 has-focus-visible:border-neutral-300 has-focus-visible:ring-2 has-focus-visible:ring-accent-500 has-focus-visible:ring-offset-2",
    ],
    item: [
      // base
      "group/button-root relative inset-shadow-default inline-flex h-full select-none items-center gap-2 overflow-hidden font-weight-500 text-md text-neutral-600",
      // transition
      "transition-[background-color,border-color]",
      // hover
      "hover:bg-neutral-100 hover:text-neutral-700",
      // focus
      "focus-visible:bg-neutral-100 focus-visible:text-neutral-700 focus-visible:outline-none",
      // misc
      "first:rounded-l-[inherit] last:rounded-r-[inherit]",
    ],
    icon: [
      // base
      "size-4 shrink-0 items-center justify-center text-neutral-400",
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
        root: ["h-8"],
        item: ["px-2"],
      },
      md: {
        root: ["h-9"],
        item: ["px-2.5"],
      },
      lg: {
        root: ["h-10"],
        item: ["px-3"],
      },
    },
    active: {
      true: {
        item: [
          // bg
          "bg-neutral-100 text-neutral-900 hover:text-neutral-900 focus-visible:text-neutral-900",
        ],
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
        item: [
          "cursor-not-allowed text-neutral-400 hover:bg-white hover:text-neutral-400 focus-visible:bg-white focus-visible:text-neutral-400",
        ],
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
  React.ComponentPropsWithRef<"div">;

const ButtonGroupRoot = ({
  children,
  className,
  size,
  ...rest
}: ButtonGroupRootProps) => {
  const { root } = buttonGroupVariants({
    size,
  });

  return (
    <ButtonGroupContext.Provider value={{ size }}>
      <div {...rest} className={root({ class: className })}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
};

const ButtonGroupItemContext = React.createContext<{
  isActive?: boolean;
  isDisabled?: boolean;
}>({});

const useButtonGroupItemContext = () =>
  React.useContext(ButtonGroupItemContext);

type ButtonGroupItemProps = Omit<
  useRender.ComponentProps<"button">,
  "disabled"
> & {
  isActive?: boolean;
  isDisabled?: boolean;
};

const ButtonGroupItem = ({
  render = <button type="button" />,
  isActive,
  isDisabled,
  className,
  onClick,
  ...props
}: ButtonGroupItemProps) => {
  const { size } = useButtonGroupContext();

  const { item } = buttonGroupVariants({
    active: isActive,
    disabled: isDisabled,
    size,
  });

  const defaultProps: useRender.ElementProps<"button"> = {
    disabled: isDisabled,
    className: item({ class: className }),
    type: "button",
    onClick: (...args) => {
      if (isDisabled) {
        return;
      }

      onClick?.(...args);
    },
  };

  const element = useRender({
    render,
    props: mergeProps<"button">(defaultProps, props),
  });

  return (
    <ButtonGroupItemContext.Provider
      value={{
        isActive,
        isDisabled,
      }}
    >
      {element}
    </ButtonGroupItemContext.Provider>
  );
};

export type ButtonGroupItemIconProps = useRender.ComponentProps<"svg">;

const ButtonGroupItemIcon: React.FC<ButtonGroupItemIconProps> = ({
  className,
  render = <svg />,
  ...props
}) => {
  const { isActive, isDisabled } = useButtonGroupItemContext();

  const { icon } = buttonGroupVariants({
    active: isActive,
    disabled: isDisabled,
  });

  const defaultProps: useRender.ElementProps<"svg"> = {
    className: icon({ class: className }),
  };

  const element = useRender({
    render,
    props: mergeProps<"svg">(defaultProps, props),
  });

  return element;
};

export {
  ButtonGroupRoot as Root,
  ButtonGroupItem as Item,
  ButtonGroupItemIcon as Icon,
};
