import { createContext, forwardRef } from "react";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";

const textareaVariants = tv({
  slots: {
    root: [
      // base
      "group/textarea-root flex rounded-md border border-neutral-200 shadow-xs tracking-tight",
      // transition
      "transition-all",
      // hover
      "hover:border-neutral-300",
      // focus
      "has-[textarea:focus]:border-neutral-500 has-[textarea:focus]:ring-2 has-[textarea:focus]:ring-neutral-300",
    ],
    wrapper: [
      // base
      "group/textarea-wrapper flex-1 h-full flex items-center cursor-text",
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
  },
  variants: {
    size: {
      sm: {
        wrapper: ["gap-2 px-2.5 py-1.5"],
        field: ["text-sm"],
      },
      md: {
        wrapper: ["gap-2 px-3 py-2"],
        field: ["text-sm"],
      },
      lg: {
        wrapper: ["gap-2 px-3.5 py-2.5"],
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
          "has-[textarea:focus]:border-danger-500 has-[textarea:focus]:ring-2 has-[textarea:focus]:ring-danger-200",
          // select
          "selection:bg-danger-200",
        ],
        field: ["placeholder:text-danger-400"],
      },
    },
    disabled: {
      true: {
        root: [
          "hover:border-neutral-200 bg-neutral-50 select-none shadow-none",
        ],
        wrapper: ["cursor-not-allowed"],
        field: ["text-neutral-400 cursor-not-allowed"],
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type TextareaSharedProps = VariantProps<typeof textareaVariants>;

const TextareaContext = createContext<TextareaSharedProps>({});
const useTextareaContext = () => React.useContext(TextareaContext);

type TextareaRootProps = React.HTMLAttributes<HTMLDivElement> &
  Omit<TextareaSharedProps, "invalid" | "disabled"> & {
    isInvalid?: boolean;
    isDisabled?: boolean;
  };

const TextareaRoot = forwardRef<HTMLDivElement, TextareaRootProps>(
  ({ className, size, isInvalid, isDisabled, ...props }, ref) => {
    const { root } = textareaVariants({
      size,
      invalid: isInvalid,
      disabled: isDisabled,
    });

    const sharedProps = { size, invalid: isInvalid, disabled: isDisabled };

    return (
      <TextareaContext.Provider value={sharedProps}>
        <div ref={ref} {...props} className={root({ className })} />
      </TextareaContext.Provider>
    );
  },
);

type TextareaWrapperProps = React.HTMLAttributes<HTMLLabelElement>;

const TextareaWrapper = forwardRef<HTMLLabelElement, TextareaWrapperProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useTextareaContext();
    const { wrapper } = textareaVariants({ size, invalid, disabled });

    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: textarea is wrapped in a label when used
      <label ref={ref} {...props} className={wrapper({ className })} />
    );
  },
);

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ className, ...props }, ref) => {
    const { size, invalid, disabled } = useTextareaContext();
    const { field } = textareaVariants({ size, invalid, disabled });

    return (
      <textarea
        ref={ref}
        {...props}
        disabled={disabled}
        className={field({ className })}
      />
    );
  },
);

export {
  TextareaRoot as Root,
  TextareaWrapper as Wrapper,
  TextareaField as Field,
};
