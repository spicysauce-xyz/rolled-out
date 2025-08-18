import { Text } from "@mono/ui";
import { tv } from "@mono/ui/utils";
import React from "react";

const cardVariants = tv({
  slots: {
    root: "",
    header: "mb-4 flex justify-between gap-4 border-neutral-100 border-b pb-4",
    headerCopy: "flex flex-col gap-0.5",
    content: "flex flex-col",
    footer: "mt-4 flex gap-4 border-neutral-100 border-t pt-4",
  },
});

type CardRootProps = React.HTMLAttributes<HTMLDivElement>;

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, ...props }, ref) => {
    const { root } = cardVariants();

    return <div className={root({ className })} ref={ref} {...props} />;
  }
);

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    const { header } = cardVariants();

    return <div className={header({ className })} ref={ref} {...props} />;
  }
);

type CardHeaderCopyProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeaderCopy = React.forwardRef<HTMLDivElement, CardHeaderCopyProps>(
  ({ className, ...props }, ref) => {
    const { headerCopy } = cardVariants();

    return <div className={headerCopy({ className })} ref={ref} {...props} />;
  }
);

const CardHeaderTitle = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentProps<typeof Text.Root>
>(({ className, ...props }, ref) => {
  return (
    <Text.Root className={className} ref={ref} weight="medium" {...props} />
  );
});

const CardHeaderDescription = React.forwardRef<
  React.ComponentRef<typeof Text.Root>,
  React.ComponentProps<typeof Text.Root>
>(({ className, ...props }, ref) => {
  return <Text.Root className={className} color="muted" ref={ref} {...props} />;
});

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const { content } = cardVariants();

    return <div className={content({ className })} ref={ref} {...props} />;
  }
);

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    const { footer } = cardVariants();

    return <div className={footer({ className })} ref={ref} {...props} />;
  }
);

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  HeaderCopy: CardHeaderCopy,
  HeaderTitle: CardHeaderTitle,
  HeaderDescription: CardHeaderDescription,
  Content: CardContent,
  Footer: CardFooter,
};
