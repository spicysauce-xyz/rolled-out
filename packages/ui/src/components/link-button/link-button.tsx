import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";

export const linkButtonVariants = tv({
  slots: {
    root: [
      // base
      "group/link-button-root relative flex select-none overflow-hidden rounded-sm",
      // transition
      "transition-[color]",
      // focus
      "ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
      // active
      "active:inset-shadow-transparent active:shadow-none",
      // icons
      "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-colors",
    ],
    content:
      "flex flex-1 items-center justify-center gap-1 whitespace-nowrap font-weight-500 transition-opacity",
    icon: "",
  },
  variants: {
    color: {
      neutral: {},
      muted: {},
      accent: {},
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
        root: "cursor-not-allowed",
      },
    },
  },
  compoundVariants: [
    {
      color: "neutral",
      class: {
        root: [
          "text-neutral-900",
          // hover
          "hover:text-neutral-950",
        ],
        icon: [
          "stroke-neutral-400",
          // hover
          "group-hover/link-button-root:stroke-neutral-500",
        ],
      },
    },
    {
      color: "muted",
      class: {
        root: [
          "text-neutral-600",
          // hover
          "hover:text-neutral-700",
        ],
        icon: [
          "stroke-neutral-400",
          // hover
          "group-hover/link-button-root:stroke-neutral-500",
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
        ],
        icon: [
          "stroke-accent-400",
          // hover
          "group-hover/link-button-root:stroke-accent-500",
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
        ],
        icon: [
          "stroke-danger-400",
          // hover
          "group-hover/link-button-root:stroke-danger-500",
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
        ],
        icon: [
          "stroke-warning-400",
          // hover
          "group-hover/link-button-root:stroke-warning-500",
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
        ],
        icon: [
          "stroke-success-400",
          // hover
          "group-hover/link-button-root:stroke-success-500",
        ],
      },
    },
    {
      disabled: true,
      class: {
        root: ["text-neutral-400 hover:text-neutral-400"],
        icon: [
          "stroke-neutral-400 group-hover/link-button-root:stroke-neutral-400",
        ],
      },
    },
  ],
  defaultVariants: {
    color: "neutral",
    size: "md",
  },
});

type LinkButtonSharedProps = VariantProps<typeof linkButtonVariants>;

const LinkButtonContext = React.createContext<LinkButtonSharedProps>({});
const useLinkButtonContext = () => React.useContext(LinkButtonContext);

export type LinkButtonRootProps = Omit<
  useRender.ComponentProps<"button">,
  "disabled"
> &
  Omit<LinkButtonSharedProps, "disabled" | "loading"> & {
    isDisabled?: boolean;
    isLoading?: boolean;
  };

const LinkButtonRoot = ({
  render = <button type="button" />,
  color,
  className,
  isDisabled,
  onClick,
  children,
  ...props
}: LinkButtonRootProps) => {
  const { root, content } = linkButtonVariants({
    color,
    disabled: isDisabled,
  });

  const defaultProps: useRender.ElementProps<"button"> = {
    children: <div className={content()}>{children}</div>,
    disabled: isDisabled,
    className: root({ class: className }),
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
    <LinkButtonContext.Provider
      value={{
        color,
        disabled: isDisabled,
      }}
    >
      {element}
    </LinkButtonContext.Provider>
  );
};

export type LinkButtonIconProps = useRender.ComponentProps<"svg">;

const LinkButtonIcon: React.FC<LinkButtonIconProps> = ({
  className,
  render = <svg />,
  ...props
}) => {
  const { color, disabled } = useLinkButtonContext();
  const { icon } = linkButtonVariants({
    color,
    disabled,
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

export { LinkButtonRoot as Root, LinkButtonIcon as Icon };
