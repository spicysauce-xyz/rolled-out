import { SymbolPicker } from "@components/symbol-picker";
import useAppForm from "@lib/form";
import { Button, Clickable, Dialog, Input, Label } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import {
  DynamicIcon,
  // @ts-expect-error https://github.com/lucide-icons/lucide/issues/2867
} from "lucide-react/dynamic.mjs";
import { useEffect } from "react";
import slugify from "slugify";
import { z } from "zod";
import { TagSelect } from "../../../components/tag-select";
import { useCreateBoardMutation } from "../hooks/use-create-board-mutation";

interface NewBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organizationId: string;
}

export const NewBoardDialog: React.FC<NewBoardDialogProps> = ({
  isOpen,
  onOpenChange,
  organizationId,
}) => {
  const createBoardMutation = useCreateBoardMutation();

  const form = useAppForm({
    defaultValues: {
      name: "",
      symbol: "house",
      slug: "",
      tags: [] as string[],
    },
    validators: {
      onSubmit: z.object({
        symbol: z.string().trim().min(1),
        name: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        tags: z.array(z.string().uuid()),
      }),
    },
    onSubmit: ({ value, formApi }) => {
      createBoardMutation.mutate(
        {
          organizationId,
          name: value.name,
          symbol: value.symbol,
          slug: value.slug,
          tags: value.tags,
        },
        {
          onSuccess: () => {
            formApi.reset();

            onOpenChange(false);
          },
        }
      );
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const symbolPicker = useDisclosure();

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={isOpen}>
      <Dialog.Content className="max-w-120">
        <Dialog.Header>
          <Dialog.Title>New Board</Dialog.Title>
          <Dialog.Description>
            Create a new board to group your posts
          </Dialog.Description>
        </Dialog.Header>
        <form
          className="flex w-full flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.Field name="symbol">
              {(field) => (
                <form.FieldContainer errors={field.state.meta.errors}>
                  <Label.Root>
                    Symbol
                    <Label.Asterisk />
                  </Label.Root>
                  <div className="flex items-start">
                    <Clickable.Root
                      className="flex size-10 items-center justify-center"
                      onClick={symbolPicker.toggle}
                      type="button"
                      variant="secondary"
                    >
                      <DynamicIcon
                        className="size-4 stroke-neutral-900"
                        name={field.state.value}
                      />
                    </Clickable.Root>
                    <SymbolPicker
                      align="start"
                      isOpen={symbolPicker.isOpen}
                      onChange={field.handleChange}
                      onOpenChange={symbolPicker.setOpen}
                      side="right"
                      value={field.state.value}
                    />
                  </div>
                </form.FieldContainer>
              )}
            </form.Field>
            <form.Field
              listeners={{
                onChange: ({ value }) => {
                  const slugState = form.getFieldMeta("slug");

                  if (slugState?.isPristine) {
                    form.setFieldValue(
                      "slug",
                      slugify(value, { lower: true, strict: true }),
                      {
                        dontUpdateMeta: true,
                      }
                    );
                    form.validateField("slug", "change");
                  }
                },
              }}
              name="name"
            >
              {(field) => (
                <form.FieldContainer errors={field.state.meta.errors}>
                  <Label.Root>
                    Name
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root
                    className="w-full"
                    isDisabled={form.state.isSubmitting}
                    isInvalid={field.state.meta.errors.length > 0}
                  >
                    <Input.Wrapper>
                      <Input.Field
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Mobile Updates"
                        value={field.state.value}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </form.FieldContainer>
              )}
            </form.Field>
            <form.Field name="slug">
              {(field) => (
                <form.FieldContainer errors={field.state.meta.errors}>
                  <Label.Root>
                    Slug
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root
                    className="w-full"
                    isDisabled={form.state.isSubmitting}
                    isInvalid={field.state.meta.errors.length > 0}
                  >
                    <Input.Wrapper>
                      <Input.Field
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="mobile-updates"
                        value={field.state.value}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </form.FieldContainer>
              )}
            </form.Field>
            <form.Field name="tags">
              {(field) => (
                <form.FieldContainer errors={field.state.meta.errors}>
                  <Label.Root>
                    Tags
                    <Label.Asterisk />
                  </Label.Root>
                  <TagSelect
                    onChange={field.handleChange}
                    organizationId={organizationId}
                    value={field.state.value}
                  />
                </form.FieldContainer>
              )}
            </form.Field>
          </div>
          <Dialog.Footer className="justify-end">
            <Dialog.Close asChild>
              <Button.Root variant="secondary">Cancel</Button.Root>
            </Dialog.Close>
            <form.Subscribe
              selector={({ isDirty, canSubmit }) => ({
                isDirty,
                canSubmit,
              })}
            >
              {({ isDirty, canSubmit }) => (
                <Button.Root
                  isDisabled={!(canSubmit && isDirty)}
                  isLoading={createBoardMutation.isPending}
                  type="submit"
                >
                  Create Board
                </Button.Root>
              )}
            </form.Subscribe>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
