import { AlertCircle } from "lucide-react";
import React, { createContext, forwardRef } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";
import { Text } from "../text";

const inputVariants = tv({
  slots: {
    root: [
      // base
      "group/input-root flex border border-neutral-200 bg-white shadow-xs",
      // transition
      "transition-all",
      // hover
      "hover:border-neutral-300",
      // focus
      "has-[input:focus]:border-accent-500 has-[input:focus]:ring-2 has-[input:focus]:ring-accent-100",
    ],
    wrapper: [
      // base
      "group/input-wrapper flex h-full w-full flex-1 cursor-text items-center",
      // transition
      "transition-all",
    ],
    field: [
      // base
      "h-full flex-1 pb-px text-md outline-none",
      // transition
      "transition-all",
      // placeholder transition
      "placeholder:transition-all",
      // hover
      "placeholder:text-neutral-500",
    ],
    text: "shrink-0 select-none text-neutral-400 transition-colors",
    icon: "flex size-4 shrink-0 select-none items-center justify-center text-neutral-400 transition-colors",
    divider: [
      // base
      "h-full w-[1px] shrink-0 bg-neutral-200",
      // transition
      "transition-all",
      // hover
      "group-hover/input-root:bg-neutral-300",
      // focus
      "group-has-[input:focus]/input-root:bg-accent-500",
    ],
  },
  variants: {
    size: {
      sm: {
        root: ["h-8 rounded-md"],
        wrapper: ["gap-2 px-2"],
      },
      md: {
        root: ["h-9 rounded-lg"],
        wrapper: ["gap-2.5 px-2.5"],
      },
      lg: {
        root: ["h-10 rounded-xl"],
        wrapper: ["gap-3 px-3"],
      },
    },
    invalid: {
      true: {},
    },
    disabled: {
      true: {},
    },
  },
  compoundVariants: [
    {
      invalid: true,
      disabled: false,
      class: {
        field: "pr-6.5",
        root: [
          // base
          "border-danger-200",
          // hover
          "hover:border-danger-300",
          // focus
          "has-[input:focus]:border-danger-500 has-[input:focus]:ring-2 has-[input:focus]:ring-danger-200",
          // select
          "selection:bg-danger-200",
        ],
        divider: [
          "bg-danger-200",
          // hover
          "group-hover/input-root:bg-danger-300",
          // focus
          "group-has-[input:focus]/input-root:bg-danger-500",
        ],
      },
    },
    {
      disabled: true,
      class: {
        root: "select-none border-neutral-100 bg-neutral-100 shadow-none hover:border-neutral-100",
        wrapper: "cursor-not-allowed",
        field:
          "cursor-not-allowed text-neutral-400 placeholder:text-neutral-400",
        text: "text-neutral-400",
        icon: "text-neutral-400",
        divider: "bg-neutral-100 group-hover/input-root:bg-neutral-100",
      },
    },
  ],
  defaultVariants: {
    size: "md",
  },
});

type InputSharedProps = VariantProps<typeof inputVariants>;

const InputContext = createContext<InputSharedProps>({});
const useInputContext = () => React.useContext(InputContext);

type InputRootProps = React.ComponentPropsWithRef<"div"> &
  Omit<InputSharedProps, "invalid" | "disabled"> & {
    isInvalid?: boolean;
    isDisabled?: boolean;
  };

const InputRoot: React.FC<InputRootProps> = ({
  className,
  size,
  isInvalid,
  isDisabled,
  ref,
  ...props
}) => {
  const { root } = inputVariants({
    size,
    invalid: isInvalid,
    disabled: isDisabled,
  });

  const sharedProps = { size, invalid: isInvalid, disabled: isDisabled };

  return (
    <InputContext.Provider value={sharedProps}>
      <div ref={ref} {...props} className={root({ className })} />
    </InputContext.Provider>
  );
};

type InputWrapperProps = React.ComponentPropsWithRef<"label">;

const InputWrapper: React.FC<InputWrapperProps> = ({
  className,
  ref,
  ...props
}) => {
  const { size, invalid, disabled } = useInputContext();
  const { wrapper } = inputVariants({ size, invalid, disabled });

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: input is wrapped in a label when used
    <label ref={ref} {...props} className={wrapper({ className })} />
  );
};

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useInputContext();
    const { field } = inputVariants({ size, invalid, disabled });

    return (
      <div className="relative flex flex-1 items-center overflow-hidden">
        <input
          ref={ref}
          {...props}
          className={field({ className })}
          disabled={disabled}
        />
        {invalid && !disabled && (
          <AlertCircle className="absolute right-0 size-4 text-danger-500" />
        )}
      </div>
    );
  }
);

type InputTextProps = React.ComponentPropsWithRef<typeof Text.Root>;

const InputText: React.FC<InputTextProps> = ({ className, ref, ...props }) => {
  const { size, invalid, disabled } = useInputContext();
  const { text } = inputVariants({ size, invalid, disabled });

  return <Text.Root className={text({ className })} ref={ref} {...props} />;
};

type InputIconProps = React.ComponentPropsWithRef<"div">;

const InputIcon: React.FC<InputIconProps> = ({ className, ref, ...props }) => {
  const { size, invalid, disabled } = useInputContext();
  const { icon } = inputVariants({ size, invalid, disabled });

  return <div ref={ref} {...props} className={icon({ className })} />;
};

type InputDividerProps = React.ComponentPropsWithRef<"div">;

const InputDivider: React.FC<InputDividerProps> = ({
  className,
  ref,
  ...props
}) => {
  const { size, invalid, disabled } = useInputContext();
  const { divider } = inputVariants({ size, invalid, disabled });

  return <div ref={ref} {...props} className={divider({ className })} />;
};

export {
  InputRoot as Root,
  InputWrapper as Wrapper,
  InputField as Field,
  InputText as Text,
  InputIcon as Icon,
  InputDivider as Divider,
};
