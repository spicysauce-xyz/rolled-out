import type React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const LabelRoot = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<"label">) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-px font-[450] text-md",
        className
      )}
      {...rest}
    />
  );
};

function LabelAsterisk({
  children = "*",
  className,
  ...rest
}: React.ComponentPropsWithRef<typeof Text.Root>) {
  return (
    <Text.Root
      className={cn("text-danger-500", className)}
      render={<span />}
      {...rest}
    >
      {children}
    </Text.Root>
  );
}

function LabelSub(props: React.ComponentPropsWithRef<typeof Text.Root>) {
  return <Text.Root color="muted" render={<span />} {...props} />;
}

export { LabelRoot as Root, LabelAsterisk as Asterisk, LabelSub as Sub };
