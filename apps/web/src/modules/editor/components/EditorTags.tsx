import type { HocuspocusProvider } from "@hocuspocus/provider";
import {
  Button,
  Clickable,
  Dialog,
  Tag as TagComponent,
  Text,
  Tooltip,
} from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { TagsIcon } from "lucide-react";
import { useDocumentTagManager } from "../hooks/useDocumentTagManager";
import { TagInput } from "./TagInput";

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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
                    <Tooltip.Trigger asChild>
                      <Clickable.Root
                        variant="tertiary"
                        onClick={() => tagManager.remove(tag)}
                        className={tagClassName.root({ className: "border-0" })}
                      >
                        <Text.Root
                          size="sm"
                          weight="medium"
                          className={tagClassName.text()}
                        >
                          {value}
                        </Text.Root>
                      </Clickable.Root>
                    </Tooltip.Trigger>
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
          <Dialog.Close asChild>
            <Button.Root variant="secondary">Cancel</Button.Root>
          </Dialog.Close>
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
      <Clickable.Root
        variant="tertiary"
        className="flex size-5 items-center justify-center gap-1 rounded-sm bg-neutral-50 px-1"
        onClick={tagsDialog.open}
      >
        <Clickable.Icon>
          <TagsIcon />
        </Clickable.Icon>
      </Clickable.Root>
      <TagsDialog
        provider={provider}
        open={tagsDialog.isOpen}
        onOpenChange={tagsDialog.setOpen}
      />
    </div>
  );
};
