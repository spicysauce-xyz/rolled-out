import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "../../utils";

const SwitchRoot = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // base
      "group/switch-root inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-neutral-200 p-0.5 shadow-xs",
      // transition
      "transition-[background-color,border-color]",
      // hover
      "data-[state=checked]:hover:border-accent-600 data-[state=unchecked]:hover:border-neutral-300 data-[state=checked]:hover:bg-accent-600",
      // focus
      "ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      // focus unchecked
      "data-[state=unchecked]:focus-visible:border-neutral-300 data-[state=unchecked]:focus-visible:ring-accent-500",
      // focus checked
      "data-[state=checked]:focus-visible:border-accent-600 data-[state=checked]:focus-visible:bg-accent-600 data-[state=checked]:focus-visible:ring-accent-500",
      // checked
      "data-[state=checked]:border-accent-500 data-[state=checked]:bg-accent-500",
      // unchecked
      "data-[state=unchecked]:border-neutral-200 data-[state=unchecked]:bg-white",
      // disabled
      "disabled:cursor-not-allowed disabled:shadow-none",
      // disabled unchecked
      "disabled:data-[state=unchecked]:border-neutral-100 disabled:data-[state=unchecked]:bg-white",
      // disabled checked
      "disabled:data-[state=checked]:border-neutral-100 disabled:data-[state=checked]:bg-neutral-100",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4.5 w-4.5 rounded-full bg-neutral-200 ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white",
        // disabled
        "group-disabled/switch-root:bg-neutral-100",
      )}
    />
  </SwitchPrimitives.Root>
));

export { SwitchRoot as Root };
