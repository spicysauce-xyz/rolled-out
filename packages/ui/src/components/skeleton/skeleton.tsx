import { cn } from "../../utils";

const SkeletonRoot = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-100", className)}
      {...props}
    />
  );
};

export { SkeletonRoot as Root };
