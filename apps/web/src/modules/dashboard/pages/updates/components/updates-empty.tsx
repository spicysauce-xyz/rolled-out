import { Button, Text } from "@mono/ui";
import { BellIcon, BookOpenIcon, PlusIcon } from "lucide-react";

interface UpdatesEmptyProps {
  onCreatePost: () => void;
  isCreatingPost: boolean;
}

export const UpdatesEmpty: React.FC<UpdatesEmptyProps> = ({
  onCreatePost,
  isCreatingPost,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <BellIcon className="size-10 fill-neutral-50 stroke-neutral-500" />
      <div className="flex flex-col items-center gap-1">
        <Text.Root weight="medium">No updates yet</Text.Root>
        <Text.Root size="sm" color="muted">
          Create your first update to get started
        </Text.Root>
      </div>
      <div className="flex items-center gap-2">
        <Button.Root variant="secondary" size="sm">
          <Button.Icon>
            <BookOpenIcon />
          </Button.Icon>
          Learn more
        </Button.Root>
        <Button.Root
          size="sm"
          isLoading={isCreatingPost}
          onClick={onCreatePost}
        >
          <Button.Icon>
            <PlusIcon />
          </Button.Icon>
          New Update
        </Button.Root>
      </div>
    </div>
  );
};
