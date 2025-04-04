import * as LabelPrimitives from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const LabelRoot = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> & {
    disabled?: boolean;
  }
>(({ className, disabled, ...rest }, ref) => {
  return (
    <Text.Root asChild size="sm" weight="medium">
      <LabelPrimitives.Root
        ref={ref}
        className={cn(
          "group cursor-pointer",
          "flex items-center gap-px",
          className,
        )}
        aria-disabled={disabled}
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
    <Text.Root asChild size="sm" color="muted" className={className}>
      <span {...rest}>{children}</span>
    </Text.Root>
  );
}

export { LabelRoot as Root, LabelAsterisk as Asterisk, LabelSub as Sub };
