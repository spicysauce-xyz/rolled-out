import { Button, Text } from "@mono/ui";
import { BellIcon, BookOpenIcon, PlusIcon } from "lucide-react";

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
      <BellIcon className="size-10 fill-neutral-100 stroke-neutral-400" />
      <div className="flex flex-col items-center gap-1">
        <Text.Root weight="medium">No updates yet</Text.Root>
        <Text.Root color="muted">
          Create your first update to get started
        </Text.Root>
      </div>
      <div className="flex items-center gap-2">
        <Button.Root variant="secondary">
          <Button.Icon render={<BookOpenIcon />} />
          Learn more
        </Button.Root>
        <Button.Root isLoading={isCreatingPost} onClick={onCreatePost}>
          <Button.Icon render={<PlusIcon />} />
          New Update
        </Button.Root>
      </div>
    </div>
  );
};
