import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { Loader2 } from "lucide-react";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";
import { Transition } from "../transition/transition";

export const iconButtonVariants = tv({
  slots: {
    root: [
      // base
      "group/icon-button-root relative flex select-none overflow-hidden rounded-md",
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
      "flex flex-1 items-center justify-center gap-2 whitespace-nowrap font-weight-500 text-md transition-opacity",
    icon: "",
  },
  variants: {
    variant: {
      filled: {
        root: "inset-shadow-default border text-white shadow-xs",
        icon: "stroke-white",
      },
      secondary: {
        root: "inset-shadow-default border border-neutral-200 bg-white text-neutral-600 shadow-xs",
        icon: "stroke-neutral-600",
      },
      tertiary: {
        root: "border border-transparent text-neutral-600",
        icon: "stroke-neutral-600",
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
        root: ["size-8 rounded-md"],
      },
      md: {
        root: ["size-9 rounded-md"],
      },
      lg: {
        root: ["size-10 rounded-md"],
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
          "group-hover/icon-button-root:stroke-neutral-700",
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
        root: "hidden",
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
          "group-hover/icon-button-root:stroke-neutral-700",
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
        icon: [
          "stroke-neutral-400 group-hover/icon-button-root:stroke-neutral-400",
        ],
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

type IconButtonSharedProps = VariantProps<typeof iconButtonVariants>;

const IconButtonContext = React.createContext<IconButtonSharedProps>({});
const useIconButtonContext = () => React.useContext(IconButtonContext);

export type IconButtonRootProps = Omit<
  useRender.ComponentProps<"button">,
  "disabled"
> &
  Omit<IconButtonSharedProps, "disabled" | "loading"> & {
    isDisabled?: boolean;
    isLoading?: boolean;
  };

const IconButtonRoot = ({
  render = <button type="button" />,
  color,
  variant,
  className,
  size,
  isDisabled,
  isLoading,
  onClick,
  children,
  ...props
}: IconButtonRootProps) => {
  const { root, content } = iconButtonVariants({
    color,
    variant,
    size,
    disabled: isDisabled,
    loading: isLoading,
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
    type: "button",
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
    <IconButtonContext.Provider
      value={{
        color,
        variant,
        disabled: isDisabled,
        loading: isLoading,
      }}
    >
      {element}
    </IconButtonContext.Provider>
  );
};

export type IconButtonIconProps = useRender.ComponentProps<"svg">;

const IconButtonIcon: React.FC<IconButtonIconProps> = ({
  className,
  render = <div />,
  ...props
}) => {
  const { color, variant, disabled, loading } = useIconButtonContext();
  const { icon } = iconButtonVariants({
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

export { IconButtonRoot as Root, IconButtonIcon as Icon };
