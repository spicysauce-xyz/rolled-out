import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "../../utils";

function CheckboxRoot({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-sm border border-neutral-200 bg-white text-neutral-900 shadow-xs outline-none transition-shadow",
        // transition
        "transition-all",
        // hover
        "hover:border-neutral-300",
        // focus
        "has-[input:focus]:border-accent-500 has-[input:focus]:ring-2 has-[input:focus]:ring-accent-100",
        // checked
        "data-[state=checked]:border-accent-500 data-[state=checked]:bg-accent-500 data-[state=checked]:text-white",
        // indeterminate
        "data-[state=indeterminate]:border-accent-300 data-[state=indeterminate]:bg-accent-300",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { CheckboxRoot as Root };
