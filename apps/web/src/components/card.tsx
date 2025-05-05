import { Text } from "@mono/ui";
import { tv } from "@mono/ui/utils";
import React from "react";

const cardVariants = tv({
  slots: {
    root: "",
    header: "border-b border-neutral-100 pb-4 flex justify-between gap-4",
    headerCopy: "flex flex-col gap-0.5",
    content: "pt-4 pb-2 flex flex-col",
    footer: "pt-4 border-t border-neutral-100 flex gap-4",
  },
});

type CardRootProps = React.HTMLAttributes<HTMLDivElement>;

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, ...props }, ref) => {
    const { root } = cardVariants();

    return <div ref={ref} className={root({ className })} {...props} />;
  },
);

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    const { header } = cardVariants();

    return <div ref={ref} className={header({ className })} {...props} />;
  },
);

type CardHeaderCopyProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeaderCopy = React.forwardRef<HTMLDivElement, CardHeaderCopyProps>(
  ({ className, ...props }, ref) => {
    const { headerCopy } = cardVariants();

    return <div ref={ref} className={headerCopy({ className })} {...props} />;
  },
);

const CardHeaderTitle = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentProps<typeof Text.Root>
>(({ className, ...props }, ref) => {
  return (
    <Text.Root ref={ref} weight="medium" className={className} {...props} />
  );
});

const CardHeaderDescription = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentProps<typeof Text.Root>
>(({ className, ...props }, ref) => {
  return (
    <Text.Root
      ref={ref}
      size="sm"
      color="muted"
      className={className}
      {...props}
    />
  );
});

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const { content } = cardVariants();

    return <div ref={ref} className={content({ className })} {...props} />;
  },
);

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    const { footer } = cardVariants();

    return <div ref={ref} className={footer({ className })} {...props} />;
  },
);

export {
  CardRoot as Root,
  CardHeader as Header,
  CardHeaderCopy as HeaderCopy,
  CardHeaderTitle as HeaderTitle,
  CardHeaderDescription as HeaderDescription,
  CardContent as Content,
  CardFooter as Footer,
};
