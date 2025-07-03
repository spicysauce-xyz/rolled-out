import { cn } from "@mono/ui/utils";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { forwardRef } from "react";

const FieldContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});

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
