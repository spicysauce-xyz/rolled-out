import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const FieldContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

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
