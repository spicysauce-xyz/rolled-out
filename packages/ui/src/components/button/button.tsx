import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { Loader2 } from "lucide-react";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";
import { Transition } from "../transition";

export const buttonVariants = tv({
  slots: {
    root: [
      // base
      "group/button-root relative flex select-none overflow-hidden rounded-md",
      // transition
      "transition-[background-color,border-color,color]",
      // focus
      "ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
      // active
      "active:inset-shadow-transparent active:shadow-none",
      // icons
      "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-colors",
    ],
    content:
      "flex flex-1 items-center gap-2 whitespace-nowrap font-[450] text-md transition-opacity",
    icon: "",
  },
  variants: {
    variant: {
      filled: {
        root: "inset-shadow-default border text-white shadow-xs",
      },
      secondary: {
        root: "inset-shadow-default border border-neutral-200 bg-white text-neutral-900 shadow-xs",
        icon: "text-neutral-600",
      },
      tertiary: {
        root: "border border-transparent text-neutral-900",
        icon: "text-neutral-600",
      },
    },
    color: {
      neutral: {},
      accent: {},
      danger: {},
      warning: {},
      success: {},
    },
    size: {
      sm: {
        root: ["h-8 rounded-md px-2"],
      },
      md: {
        root: ["h-9 rounded-md px-2.5"],
      },
      lg: {
        root: ["h-10 rounded-md px-3"],
      },
    },
    disabled: {
      true: {
        root: "cursor-not-allowed",
      },
    },
    loading: {
      true: {
        root: "pointer-events-none",
        content: "opacity-0",
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
        ],
        icon: [
          "text-neutral-200",
          // hover
          "group-hover/button-root:text-neutral-100",
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
        ],
        icon: [
          "text-accent-200",
          // hover
          "group-hover/button-root:text-accent-100",
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
        ],
        icon: [
          "text-danger-200",
          // hover
          "group-hover/button-root:text-danger-100",
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
        ],
        icon: [
          "text-warning-200",
          // hover
          "group-hover/button-root:text-warning-100",
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
        ],
        icon: [
          "text-success-200",
          // hover
          "group-hover/button-root:text-success-100",
        ],
      },
    },
    {
      color: "neutral",
      variant: "secondary",
      class: {
        root: [
          // hover
          "hover:border-neutral-300 hover:bg-neutral-100",
        ],
        icon: [
          // hover
          "group-hover/button-root:text-neutral-900",
        ],
      },
    },
    {
      color: "accent",
      variant: "secondary",
      class: {
        root: "hidden",
      },
    },
    {
      color: "danger",
      variant: "secondary",
      class: {
        root: [
          // hover
          "hover:border-neutral-300 hover:bg-neutral-100 hover:text-danger-500",
        ],
        icon: [
          // hover
          "group-hover/button-root:text-danger-500",
        ],
      },
    },
    {
      color: "warning",
      variant: "secondary",
      class: {
        root: "hidden",
      },
    },
    {
      color: "success",
      variant: "secondary",
      class: {
        root: "hidden",
      },
    },
    {
      color: "neutral",
      variant: "tertiary",
      class: {
        root: [
          // hover
          "hover:border-neutral-100 hover:bg-neutral-100",
        ],
        icon: [
          // hover
          "group-hover/button-root:text-neutral-900",
        ],
      },
    },
    {
      color: "accent",
      variant: "tertiary",
      class: {
        root: "hidden",
      },
    },
    {
      color: "danger",
      variant: "tertiary",
      class: {
        root: "hidden",
      },
    },
    {
      color: "warning",
      variant: "tertiary",
      class: {
        root: "hidden",
      },
    },
    {
      color: "success",
      variant: "tertiary",
      class: {
        root: "hidden",
      },
    },
    {
      disabled: true,
      loading: false,
      class: {
        content: ["text-neutral-400 group-hover/button-root:text-neutral-400"],
        icon: ["text-neutral-400 group-hover/button-root:text-neutral-400"],
      },
    },
    {
      disabled: true,
      loading: false,
      variant: "filled",
      class: {
        root: [
          "inset-shadow-transparent border-neutral-100 bg-neutral-100 shadow-none",
          // hover
          "hover:border-neutral-100 hover:bg-neutral-100",
        ],
      },
    },
    {
      disabled: true,
      loading: false,
      variant: "secondary",
      class: {
        root: [
          "inset-shadow-transparent border-neutral-100 bg-white shadow-none",
          // hover
          "hover:border-neutral-100 hover:bg-white",
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
        ],
      },
    },
  ],
  defaultVariants: {
    variant: "filled",
    color: "neutral",
    size: "md",
  },
});

type ButtonSharedProps = VariantProps<typeof buttonVariants>;

const ButtonContext = React.createContext<ButtonSharedProps>({});
const useButtonContext = () => React.useContext(ButtonContext);

export type ButtonRootProps = Omit<
  useRender.ComponentProps<"button">,
  "disabled"
> &
  Omit<ButtonSharedProps, "disabled" | "loading"> & {
    isDisabled?: boolean;
    isLoading?: boolean;
  };

const ButtonRoot = ({
  // biome-ignore lint/a11y/useButtonType: not needed
  render = <button />,
  color,
  variant,
  className,
  isDisabled,
  isLoading,
  size,
  onClick,
  children,
  ...props
}: ButtonRootProps) => {
  const { root, content } = buttonVariants({
    color,
    variant,
    disabled: isDisabled,
    loading: isLoading,
    size,
  });

  const defaultProps: useRender.ElementProps<"button"> = {
    children: (
      <Transition.Root>
        {isLoading && (
          <Transition.Item
            className="absolute inset-0 flex items-center justify-center"
            key="loader"
          >
            <Loader2 className="animate-spin text-inherit" />
          </Transition.Item>
        )}
        <div className={content()}>{children}</div>
      </Transition.Root>
    ),
    disabled: isDisabled || isLoading,
    className: root({ class: className }),
    onClick: (...args) => {
      if (isDisabled || isLoading) {
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
    <ButtonContext.Provider
      value={{
        color,
        variant,
        disabled: isDisabled,
        loading: isLoading,
      }}
    >
      {element}
    </ButtonContext.Provider>
  );
};

export type ButtonIconProps = useRender.ComponentProps<"svg">;

const ButtonIcon: React.FC<ButtonIconProps> = ({
  className,
  render = <svg />,
  ...props
}) => {
  const { color, variant, disabled, loading } = useButtonContext();
  const { icon } = buttonVariants({
    color,
    variant,
    disabled,
    loading,
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

export { ButtonRoot as Root, ButtonIcon as Icon };
