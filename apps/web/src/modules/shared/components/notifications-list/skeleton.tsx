import { Skeleton } from "@mono/ui";

interface ListSkeletonProps {
  count: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count }) => {
  return new Array(Math.min(count, 9)).fill(null).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: could be used here
    <div className="flex items-center gap-2 p-2" key={index}>
      <Skeleton.Root className="size-10 rounded-md" />
      <div className="flex flex-col gap-2">
        <Skeleton.Root className="h-3.5 w-60 rounded-xs" />
        <Skeleton.Root className="h-3 w-40 rounded-xs" />
      </div>
    </div>
  ));
};
