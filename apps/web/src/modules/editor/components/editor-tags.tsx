import type { HocuspocusProvider } from "@hocuspocus/provider";
import { Button, Dialog, Tag as TagComponent, Tooltip } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { TagsIcon } from "lucide-react";
import { useDocumentTagManager } from "../hooks/use-document-tag-manager";
import { TagInput } from "./tag-input";

interface TagsDialogProps {
  provider: HocuspocusProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TagsDialog: React.FC<TagsDialogProps> = ({
  provider,
  open,
  onOpenChange,
}) => {
  const tagManager = useDocumentTagManager(provider);

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Content className="max-w-96">
        <Dialog.Header>
          <Dialog.Title>Tags</Dialog.Title>
          <Dialog.Description>
            Add or remove tags from your update
          </Dialog.Description>
        </Dialog.Header>
        <TagInput provider={provider} />
        {tagManager.tags.length > 0 && (
          <Tooltip.Provider>
            <div className="flex flex-wrap gap-2">
              {tagManager.tags.map(([tag, value]) => {
                const tagColor = TagComponent.getTagColor(value);
                const tagClassName = TagComponent.tagVariants({
                  isInteractive: true,
                  color: tagColor,
                });

                return (
                  <Tooltip.Root key={tag}>
                    <Tooltip.Trigger>{value}</Tooltip.Trigger>
                    <Tooltip.Content>
                      <Tooltip.Title>Click to remove</Tooltip.Title>
                    </Tooltip.Content>
                  </Tooltip.Root>
                );
              })}
            </div>
          </Tooltip.Provider>
        )}
        <Dialog.Footer>
          <Dialog.Cancel>Cancel</Dialog.Cancel>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

interface EditorTags {
  provider: HocuspocusProvider;
}

export const EditorTags: React.FC<EditorTags> = ({ provider }) => {
  const tagManager = useDocumentTagManager(provider);
  const tagsDialog = useDisclosure();

  return (
    <div className="flex items-center gap-2">
      {tagManager.tags.map(([tag, value]) => (
        <TagComponent.Root className="h-auto rounded-sm px-1" key={tag}>
          {value}
        </TagComponent.Root>
      ))}
      <Button.Root
        className="flex size-5 items-center justify-center gap-1 rounded-sm bg-neutral-50 px-1"
        onClick={tagsDialog.open}
        variant="tertiary"
      >
        <Button.Icon render={<TagsIcon />} />
      </Button.Root>
      <TagsDialog
        onOpenChange={tagsDialog.setOpen}
        open={tagsDialog.isOpen}
        provider={provider}
      />
    </div>
  );
};
