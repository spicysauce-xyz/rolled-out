import { Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { forwardRef } from "react";

const LandingSectionRoot = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "section flex w-full flex-col items-center justify-center",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const LandingSectionHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-col gap-6">{children}</div>;
};

const LandingSectionTitle: React.FC<
  React.ComponentPropsWithRef<typeof Text.Root>
> = ({ className, ...props }) => {
  return (
    <Text.Root
      className={cn("text-balance", className)}
      size="sm"
      variant="display"
      weight="medium"
      {...props}
    />
  );
};

const LandingSectionSubtitle: React.FC<
  React.ComponentPropsWithRef<typeof Text.Root>
> = ({ className, ...props }) => {
  return (
    <Text.Root
      className={cn("max-w-130 text-balance", className)}
      size="lg"
      {...props}
    />
  );
};

const LandingSectionContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-256 flex-col items-start gap-12 p-6",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export const LandingSection = {
  Root: LandingSectionRoot,
  Header: LandingSectionHeader,
  Title: LandingSectionTitle,
  Subtitle: LandingSectionSubtitle,
  Content: LandingSectionContent,
};
