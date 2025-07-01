import { SymbolPicker } from "@components/symbol-picker";
import type { SuccessResponse, api } from "@lib/api";
import { boardQuery } from "@lib/api/queries";
import useAppForm from "@lib/form";
import { Button, Clickable, Dialog, Input, Label, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import {
  DynamicIcon,
  // @ts-expect-error https://github.com/lucide-icons/lucide/issues/2867
} from "lucide-react/dynamic.mjs";
import { z } from "zod";
import { useUpdateBoardMutation } from "../hooks/useUpdateBoardMutation";
import { TagSelect } from "./tag-select";

const Content: React.FC<
  Pick<EditBoardDialogProps, "board" | "onOpenChange">
> = ({ board, onOpenChange }) => {
  const router = useRouter();
  const updateBoardMutation = useUpdateBoardMutation();

  const { data: boardQueryData } = useQuery({
    ...boardQuery(board.organizationId, board.id),
    placeholderData: board,
  });

  const form = useAppForm({
    defaultValues: {
      name: boardQueryData?.name || "",
      symbol: boardQueryData?.symbol || "",
      slug: boardQueryData?.slug || "",
      tags: boardQueryData?.tags.map((tag) => tag.tagId) || [],
    },
    validators: {
      onSubmit: z.object({
        symbol: z.string().trim().min(1),
        name: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        tags: z.array(z.string().uuid()),
      }),
    },
    onSubmit: async ({ value }) => {
      updateBoardMutation.mutate(
        {
          id: board.id,
          organizationId: board.organizationId,
          name: value.name,
          symbol: value.symbol,
          slug: value.slug,
          tags: value.tags,
        },
        {
          onSuccess: async () => {
            await router.invalidate({ sync: true });

            onOpenChange(false);
          },
        },
      );
    },
  });

  const symbolPicker = useDisclosure();

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Edit Board</Dialog.Title>
        <Dialog.Description>Edit the board details</Dialog.Description>
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
              <form.FieldContainer>
                <Label.Root>
                  Symbol
                  <Label.Asterisk />
                </Label.Root>
                <div className="flex items-start">
                  <Clickable.Root
                    type="button"
                    variant="secondary"
                    className="flex size-10 items-center justify-center"
                    onClick={symbolPicker.toggle}
                  >
                    <DynamicIcon
                      name={field.state.value}
                      className="size-4 stroke-neutral-900"
                    />
                  </Clickable.Root>
                  <SymbolPicker
                    side="right"
                    align="start"
                    isOpen={symbolPicker.isOpen}
                    onOpenChange={symbolPicker.setOpen}
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                </div>
              </form.FieldContainer>
            )}
          </form.Field>
          <form.Field name="name">
            {(field) => (
              <form.FieldContainer>
                <Label.Root>
                  Name
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root
                  className="w-full"
                  isInvalid={field.state.meta.errors.length > 0}
                  isDisabled={form.state.isSubmitting}
                >
                  <Input.Wrapper>
                    <Input.Field
                      id={field.name}
                      name={field.name}
                      placeholder="Mobile Updates"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {field.state.meta.errors.length ? (
                  <Text.Root size="sm" className="text-danger-500">
                    {field.state.meta.errors[0]?.message}
                  </Text.Root>
                ) : null}
              </form.FieldContainer>
            )}
          </form.Field>
          <form.Field name="slug">
            {(field) => (
              <form.FieldContainer>
                <Label.Root>
                  Slug
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root
                  className="w-full"
                  isInvalid={field.state.meta.errors.length > 0}
                  isDisabled={form.state.isSubmitting}
                >
                  <Input.Wrapper>
                    <Input.Field
                      id={field.name}
                      name={field.name}
                      placeholder="mobile-updates"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {field.state.meta.errors.length ? (
                  <Text.Root size="sm" className="text-danger-500">
                    {field.state.meta.errors[0]?.message}
                  </Text.Root>
                ) : null}
              </form.FieldContainer>
            )}
          </form.Field>
          <form.Field name="tags">
            {(field) => (
              <form.FieldContainer>
                <Label.Root>
                  Tags
                  <Label.Asterisk />
                </Label.Root>
                <TagSelect
                  organizationId={board.organizationId}
                  value={field.state.value}
                  onChange={field.handleChange}
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
                type="submit"
                isLoading={updateBoardMutation.isPending}
                isDisabled={!canSubmit || !isDirty}
              >
                Update Board
              </Button.Root>
            )}
          </form.Subscribe>
        </Dialog.Footer>
      </form>
    </>
  );
};

type Board = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["boards"][":id"]["$get"]
  >
>;

interface EditBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  board: Board;
}

export const EditBoardDialog: React.FC<EditBoardDialogProps> = ({
  isOpen,
  onOpenChange,
  board,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-120">
        <Content board={board} onOpenChange={onOpenChange} />
      </Dialog.Content>
    </Dialog.Root>
  );
};
