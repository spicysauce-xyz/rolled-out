import { Checkbox } from "@base-ui-components/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "../../utils";

function CheckboxRoot({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Checkbox.Root>) {
  return (
    <Checkbox.Root
      className={cn(
        "peer size-4 shrink-0 rounded-sm border border-neutral-200 bg-white shadow-xs outline-none transition-shadow",
        // transition
        "transition-all",
        // hover
        "hover:border-neutral-300",
        // focus
        "focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-100",
        // checked
        "data-[checked]:border-accent-500 data-[checked]:bg-accent-500 data-[checked]:text-white",
        // disabled
        "data-[disabled]:border-neutral-100 data-[disabled]:bg-neutral-100 data-[disabled]:text-neutral-400 data-[disabled]:shadow-none",
        className
      )}
      {...props}
    >
      <Checkbox.Indicator className="flex items-center justify-center text-current transition-none">
        <CheckIcon className="size-3" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}

export { CheckboxRoot as Root };
