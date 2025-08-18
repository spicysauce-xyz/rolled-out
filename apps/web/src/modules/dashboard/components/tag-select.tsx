import { organizationTagsQuery } from "@lib/api/queries";
import { Button, DropdownMenu, IconButton, Tag, Text, Tooltip } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";

interface TagSelectProps {
  organizationId: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export const TagSelect: React.FC<TagSelectProps> = ({
  value,
  organizationId,
  onChange,
}) => {
  const { data: tagsData, isPending } = useQuery(
    organizationTagsQuery(organizationId)
  );

  const tagsMap = useMemo(() => {
    return new Map(tagsData?.map((tag) => [tag.id, tag]) ?? []);
  }, [tagsData]);

  const selectedTagsMap = useMemo(() => {
    return new Map(value.map((id) => [id, tagsMap.get(id)]));
  }, [value, tagsMap]);

  const removeTag = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  const addTag = (tagId: string) => {
    onChange([...value, tagId]);
  };

  const handleCheckedChange = (tagId: string, checked: boolean) => {
    if (checked) {
      addTag(tagId);
    } else {
      removeTag(tagId);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          render={<IconButton.Root isLoading={isPending} variant="secondary" />}
        >
          <IconButton.Icon>
            <PlusIcon />
          </IconButton.Icon>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" className="max-h-64 p-0">
          {tagsData?.map((tag) => (
            <DropdownMenu.CheckboxItem
              checked={selectedTagsMap.has(tag.id)}
              key={tag.id}
              onCheckedChange={(checked) => {
                handleCheckedChange(tag.id, checked);
              }}
            >
              <div className="flex flex-1 items-center justify-between gap-4">
                {tag.label}
                <Text.Root color="muted">{tag.postsCount || ""}</Text.Root>
              </div>
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Tooltip.Provider>
        {Array.from(selectedTagsMap.values()).map((tag) => {
          if (!tag) {
            return null;
          }

          const tagColor = Tag.getTagColor(tag.label);
          const tagClassName = Tag.tagVariants({
            isInteractive: true,
            color: tagColor,
          });

          return (
            <Tooltip.Root key={tag.id}>
              <Tooltip.Trigger
                render={
                  <Button.Root
                    className={tagClassName.root({ className: "border-0" })}
                    onClick={() => removeTag(tag.id)}
                    variant="tertiary"
                  />
                }
              >
                <Text.Root className={tagClassName.text()} weight="medium">
                  {tag.label}
                </Text.Root>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Tooltip.Title>Click to remove</Tooltip.Title>
              </Tooltip.Content>
            </Tooltip.Root>
          );
        })}
      </Tooltip.Provider>
    </div>
  );
};
