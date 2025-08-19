import { Skeleton, Text } from "@mono/ui";
import {
  ArchiveIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  ClockIcon,
} from "lucide-react";

export const GroupDivider: React.FC<{
  status: "draft" | "scheduled" | "published" | "archived";
}> & {
  Skeleton: React.FC;
} = ({ status }) => {
  const variants = {
    draft: {
      icon: <CircleDashedIcon className="size-4 text-neutral-500" />,
      label: "Drafts",
    },
    scheduled: {
      icon: <ClockIcon className="size-4 text-warning-500" />,
      label: "Scheduled",
    },
    published: {
      icon: <CircleCheckIcon className="size-4 text-success-500" />,
      label: "Published",
    },
    archived: {
      icon: <ArchiveIcon className="size-4 text-neutral-500" />,
      label: "Archived",
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
