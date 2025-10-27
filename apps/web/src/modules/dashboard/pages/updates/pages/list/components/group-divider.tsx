import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  DashedLineCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton, Text } from "@mono/ui";

export const GroupDivider: React.FC<{
  status: "draft" | "scheduled" | "published";
}> & {
  Skeleton: React.FC;
} = ({ status }) => {
  const variants = {
    draft: {
      icon: (
        <HugeiconsIcon
          className="size-4 text-neutral-500"
          icon={DashedLineCircleIcon}
          strokeWidth={2}
        />
      ),
      label: "Drafts",
    },
    scheduled: {
      icon: (
        <HugeiconsIcon
          className="size-4 text-warning-500"
          icon={Clock01Icon}
          strokeWidth={2}
        />
      ),
      label: "Scheduled",
    },
    published: {
      icon: (
        <HugeiconsIcon
          className="size-4 text-success-500"
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
        />
      ),
      label: "Published",
    },
  };

  const variant = variants[status];

  if (!variant) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-6">
      {variant.icon}
      <Text.Root weight="medium">{variant.label}</Text.Root>
    </div>
  );
};

GroupDivider.Skeleton = () => {
  return (
    <div className="flex items-center gap-2 p-6">
      <Skeleton.Root className="h-4 w-4 rounded-full" />
      <Skeleton.Root className="my-0.5 h-4 w-20 rounded-xs" />
    </div>
  );
};
