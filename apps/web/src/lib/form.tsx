import { Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import {
  type AnyFieldMetaDerived,
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form";
import { forwardRef } from "react";

interface FieldContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  errors?: AnyFieldMetaDerived["errors"];
}

const FieldContainer = forwardRef<HTMLDivElement, FieldContainerProps>(
  ({ children, className, errors, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        ref={ref}
        {...props}
      >
        {children}
        {errors?.length ? (
          <Text.Root className="text-danger-500">
            {errors[0]?.message}
          </Text.Root>
        ) : null}
      </div>
    );
  }
);

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    FieldContainer,
  },
  fieldContext,
  formContext,
});

export default useAppForm;
