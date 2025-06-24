import type { HocuspocusProvider } from "@hocuspocus/provider";
import { organizationTagsQuery } from "@lib/api/queries";
import useAppForm from "@lib/form";
import { Clickable, Input, Tag as TagComponent, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { useCreateTagMutation } from "../hooks/useCreateTagMutation";
import { useDocumentTagManager } from "../hooks/useDocumentTagManager";
import type { Tag } from "../types";

interface TagInputProps {
  provider: HocuspocusProvider;
}

const useFilteredTags = (
  search: string,
  organizationTags: Tag[],
  currentTags: [string, string][],
) => {
  return useMemo(() => {
    return organizationTags
      .filter(
        (tag) =>
          tag.label.toLowerCase().includes(search.toLowerCase()) &&
          !currentTags.some(([id]) => id === tag.id),
      )
      .slice(0, 3);
  }, [currentTags, search, organizationTags]);
};

export const TagInput: React.FC<TagInputProps> = ({ provider }) => {
  const { organization } = useRouteContext({
    from: "/_authorized/_has-organization/$organizationSlug/editor/$id",
  });

  const { data: organizationTags } = useQuery(
    organizationTagsQuery(organization.id),
  );

  const tagManager = useDocumentTagManager(provider);

  const inputRef = useRef<HTMLInputElement>(null);

  const createTagMutation = useCreateTagMutation();

  const handleClickTag = useCallback(
    (tag: Tag) => {
      form.setFieldValue("search", "");
      tagManager.add(tag);
      inputRef.current?.focus();
    },
    [tagManager],
  );

  const form = useAppForm({
    defaultValues: {
      search: "",
    },
    validators: {
      onSubmit: z.object({
        search: z
          .string()
          .trim()
          .min(3, "Tag must be at least 3 characters long")
          .max(20, "Tag must be less than 20 characters long"),
      }),
    },
    onSubmit: ({ value, formApi }) => {
      createTagMutation.mutate(
        {
          organizationId: organization.id,
          label: value.search,
        },
        {
          onSuccess: (tag) => {
            tagManager.add(tag);
            formApi.reset();
          },
          onSettled: () => {
            setTimeout(() => {
              inputRef.current?.focus();
            });
          },
        },
      );
    },
  });

  const search = useStore(form.store, (state) => state.values.search);

  const availableTags = useFilteredTags(
    search,
    organizationTags ?? [],
    tagManager.tags,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="search">
        {(field) => (
          <form.FieldContainer>
            <Input.Root
              className="relative"
              isDisabled={createTagMutation.isPending}
              isInvalid={field.state.meta.errors.length > 0}
            >
              <Input.Wrapper>
                <Input.Icon>
                  <SearchIcon />
                </Input.Icon>
                <Input.Field
                  ref={inputRef}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Search or create a tag"
                  autoComplete="off"
                />
              </Input.Wrapper>
              {field.state.value.length >= 3 && (
                <div
                  className={cn(
                    "-right-px -left-px absolute top-[calc(100%+0.5rem)] z-10 flex-col items-center gap-1 rounded-md border border-neutral-200 bg-white p-2 shadow-lg",
                    "fade-out-0 hidden animate-out",
                    "group-focus-within/input-root:fade-in-0 group-focus-within/input-root:pointer-events-auto group-focus-within/input-root:flex group-focus-within/input-root:animate-in",
                  )}
                >
                  {match(availableTags)
                    .with(
                      P.when((values) => values.length > 0),
                      (values) =>
                        values.map((tag) => {
                          const tagColor = TagComponent.getTagColor(tag.label);
                          const tagClassName = TagComponent.tagVariants({
                            color: tagColor,
                          });

                          return (
                            <Clickable.Root
                              variant="tertiary"
                              key={tag.id}
                              type="button"
                              className={tagClassName.root({
                                className:
                                  "h-9 w-full justify-start border-0 bg-white",
                              })}
                              onClick={() => handleClickTag(tag)}
                            >
                              <Text.Root
                                size="sm"
                                weight="medium"
                                className={tagClassName.text()}
                              >
                                {tag.label}
                              </Text.Root>
                            </Clickable.Root>
                          );
                        }),
                    )
                    .otherwise(() => {
                      const tagColor = TagComponent.getTagColor(search);
                      const tagClassName = TagComponent.tagVariants({
                        color: tagColor,
                      });

                      return (
                        <Text.Root
                          size="xs"
                          color="muted"
                          className="text-balance text-center"
                        >
                          No tags found. Press Enter to create{" "}
                          <span
                            className={tagClassName.text({
                              className: "font-weight-500",
                            })}
                          >
                            {search}
                          </span>{" "}
                          tag
                        </Text.Root>
                      );
                    })}
                </div>
              )}
            </Input.Root>
            {field.state.meta.errors.length ? (
              <Text.Root size="sm" className="text-danger-500">
                {field.state.meta.errors[0]?.message}
              </Text.Root>
            ) : null}
          </form.FieldContainer>
        )}
      </form.Field>
    </form>
  );
};
