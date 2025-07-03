import { Root as RadixLabelRoot } from "@radix-ui/react-label";
import React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const LabelRoot = React.forwardRef<
  React.ComponentRef<typeof RadixLabelRoot>,
  React.ComponentPropsWithoutRef<typeof RadixLabelRoot> & {
    disabled?: boolean;
  }
>(({ className, disabled, ...rest }, ref) => {
  return (
    <Text.Root asChild size="sm" weight="medium">
      <RadixLabelRoot
        aria-disabled={disabled}
        className={cn(
          "group cursor-pointer",
          "flex items-center gap-px",
          className
        )}
        ref={ref}
        {...rest}
      />
    </Text.Root>
  );
});

function LabelAsterisk({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-danger-500", className)} {...rest}>
      {children || "*"}
    </span>
  );
}

function LabelSub({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <Text.Root asChild className={className} color="muted" size="sm">
      <span {...rest}>{children}</span>
    </Text.Root>
  );
}

export { LabelRoot as Root, LabelAsterisk as Asterisk, LabelSub as Sub };
