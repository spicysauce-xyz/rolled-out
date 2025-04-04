import { createContext, forwardRef } from "react";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";
import { Text } from "../text";

const inputVariants = tv({
  slots: {
    root: [
      // base
      "group/input-root flex rounded-md border border-neutral-200 bg-white shadow-xs tracking-tight",
      // transition
      "transition-all",
      // hover
      "hover:border-neutral-300",
      // focus
      "has-[input:focus]:border-neutral-500 has-[input:focus]:ring-2 has-[input:focus]:ring-neutral-300",
    ],
    wrapper: [
      // base
      "group/input-wrapper flex-1 h-full flex items-center cursor-text",
      // transition
      "transition-all",
    ],
    field: [
      // base
      "h-full flex-1 outline-none",
      // transition
      "transition-all",
      // placeholder transition
      "placeholder:transition-all",
      // hover
      "placeholder:text-neutral-400",
    ],
    text: [
      //base
      "shrink-0 select-none text-neutral-500",
    ],
    icon: [
      "shrink-0 select-none text-neutral-500 size-4 flex items-center justify-center",
    ],
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
        root: ["h-9"],
        wrapper: ["gap-2 px-2.5"],
        field: ["text-sm"],
        icon: "first:mr-0.5 last:ml-0.5",
        text: "first:mr-0.5 last:ml-0.5 text-sm",
      },
      md: {
        root: ["h-10"],
        wrapper: ["gap-2 px-3"],
        field: ["text-sm"],
        icon: "first:mr-1 last:ml-1",
        text: "first:mr-1 last:ml-1 text-sm",
      },
      lg: {
        root: ["h-11"],
        wrapper: ["gap-2 px-3.5"],
        icon: "first:mr-1.5 last:ml-1.5",
        text: "first:mr-1.5 last:ml-1.5",
      },
    },
    invalid: {
      true: {
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
        field: ["placeholder:text-danger-400"],
        text: ["text-danger-500"],
        icon: ["text-danger-500"],
        divider: [
          "bg-danger-200",
          // hover
          "group-hover/input-root:bg-danger-300",
          // focus
          "group-has-[input:focus]/input-root:bg-danger-500",
        ],
      },
    },
    disabled: {
      true: {
        root: [
          "hover:border-neutral-200 bg-neutral-50 select-none shadow-none",
        ],
        wrapper: ["cursor-not-allowed"],
        field: ["text-neutral-400 cursor-not-allowed"],
        text: ["text-neutral-400"],
        icon: ["text-neutral-400"],
        divider: ["group-hover/input-root:bg-neutral-200"],
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type InputSharedProps = VariantProps<typeof inputVariants>;

const InputContext = createContext<InputSharedProps>({});
const useInputContext = () => React.useContext(InputContext);

type InputRootProps = React.HTMLAttributes<HTMLDivElement> &
  Omit<InputSharedProps, "invalid" | "disabled"> & {
    isInvalid?: boolean;
    isDisabled?: boolean;
  };

const InputRoot = forwardRef<HTMLInputElement, InputRootProps>(
  ({ className, size, isInvalid, isDisabled, ...props }, ref) => {
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
  },
);

type InputWrapperProps = React.HTMLAttributes<HTMLLabelElement>;

const InputWrapper = forwardRef<HTMLLabelElement, InputWrapperProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useInputContext();
    const { wrapper } = inputVariants({ size, invalid, disabled });

    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: input is wrapped in a label when used
      <label ref={ref} {...props} className={wrapper({ className })} />
    );
  },
);

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useInputContext();
    const { field } = inputVariants({ size, invalid, disabled });

    return (
      <input
        ref={ref}
        {...props}
        disabled={disabled}
        className={field({ className })}
      />
    );
  },
);

type InputTextProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">;

const InputText = forwardRef<HTMLParagraphElement, InputTextProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useInputContext();
    const { text } = inputVariants({ size, invalid, disabled });

    return <Text.Root ref={ref} {...props} className={text({ className })} />;
  },
);

type InputIconProps = React.HTMLAttributes<HTMLDivElement>;

const InputIcon = forwardRef<HTMLDivElement, InputIconProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useInputContext();
    const { icon } = inputVariants({ size, invalid, disabled });

    return <div ref={ref} {...props} className={icon({ className })} />;
  },
);

type InputDividerProps = React.HTMLAttributes<HTMLDivElement>;

const InputDivider = forwardRef<HTMLDivElement, InputDividerProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useInputContext();
    const { divider } = inputVariants({ size, invalid, disabled });

    return <div ref={ref} {...props} className={divider({ className })} />;
  },
);

export {
  InputRoot as Root,
  InputWrapper as Wrapper,
  InputField as Field,
  InputText as Text,
  InputIcon as Icon,
  InputDivider as Divider,
};
