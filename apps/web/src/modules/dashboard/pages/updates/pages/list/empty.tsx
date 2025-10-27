import {
  Add01Icon,
  BookOpen01Icon,
  Files02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Text } from "@mono/ui";

interface EmptyProps {
  onCreatePost: () => void;
  isCreatingPost: boolean;
}

export const Empty: React.FC<EmptyProps> = ({
  onCreatePost,
  isCreatingPost,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <HugeiconsIcon
        className="size-10 text-neutral-900"
        icon={Files02Icon}
        strokeWidth={1.5}
      />
      <div className="flex flex-col items-center gap-1">
        <Text.Root weight="medium">No updates yet</Text.Root>
        <Text.Root color="muted">
          Create your first update to get started
        </Text.Root>
      </div>
      <div className="flex items-center gap-2">
        <Button.Root variant="secondary">
          <Button.Icon
            render={<HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />}
          />
          Learn more
        </Button.Root>
        <Button.Root isLoading={isCreatingPost} onClick={onCreatePost}>
          <Button.Icon
            render={<HugeiconsIcon icon={Add01Icon} strokeWidth={2} />}
          />
          New Update
        </Button.Root>
      </div>
    </div>
  );
};
