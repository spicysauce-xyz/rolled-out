import { Switch } from "@base-ui-components/react/switch";
import type React from "react";
import { cn } from "../../utils";

const SwitchRoot = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Switch.Root>) => (
  <Switch.Root
    className={cn(
      // base
      "group/switch-root inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-neutral-200 p-0.5 shadow-xs",
      // transition
      "transition-[background-color,border-color]",
      // hover
      "data-[checked]:hover:border-accent-600 data-[unchecked]:hover:border-neutral-300 data-[checked]:hover:bg-accent-600",
      // focus
      "ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      // focus unchecked
      "data-[unchecked]:focus-visible:border-neutral-300 data-[unchecked]:focus-visible:ring-accent-500",
      // focus checked
      "data-[checked]:focus-visible:border-accent-600 data-[checked]:focus-visible:bg-accent-600 data-[checked]:focus-visible:ring-accent-500",
      // checked
      "data-[checked]:border-accent-500 data-[checked]:bg-accent-500",
      // unchecked
      "data-[unchecked]:border-neutral-200 data-[unchecked]:bg-white",
      // disabled
      "disabled:cursor-not-allowed disabled:shadow-none",
      // disabled unchecked
      "disabled:data-[unchecked]:border-neutral-100 disabled:data-[unchecked]:bg-white",
      // disabled checked
      "disabled:data-[checked]:border-neutral-100 disabled:data-[checked]:bg-neutral-100",
      className
    )}
    {...props}
  >
    <Switch.Thumb
      className={cn(
        "pointer-events-none block h-4.5 w-4.5 rounded-full bg-neutral-200 ring-0 transition-[translate,background-color] data-[checked]:translate-x-4 data-[unchecked]:translate-x-0 data-[checked]:bg-white",
        // disabled
        "group-disabled/switch-root:bg-neutral-100"
      )}
    />
  </Switch.Root>
);

export { SwitchRoot as Root };
