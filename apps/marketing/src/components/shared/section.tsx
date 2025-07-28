import { Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";

const LandingSectionRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="section flex w-full flex-col items-center justify-center">
      {children}
    </div>
  );
};

const LandingSectionHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-col gap-6">{children}</div>;
};

const LandingSectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text.Root
      className="text-balance"
      size="sm"
      variant="display"
      weight="medium"
    >
      {children}
    </Text.Root>
  );
};

const LandingSectionSubtitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Text.Root className="max-w-130 text-balance" size="sm">
      {children}
    </Text.Root>
  );
};

const LandingSectionContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-256 flex-col items-start gap-12 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const LandingSection = {
  Root: LandingSectionRoot,
  Header: LandingSectionHeader,
  Title: LandingSectionTitle,
  Subtitle: LandingSectionSubtitle,
  Content: LandingSectionContent,
};
