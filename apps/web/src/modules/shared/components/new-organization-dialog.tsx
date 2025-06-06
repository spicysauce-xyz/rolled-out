import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { Button, Dialog, Input, Label, Text, Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

interface NewOrganizationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const NewOrganizationDialog: React.FC<NewOrganizationDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const response = await authClient.organization.create({
        slug: data.slug,
        name: data.name,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  const checkSlugMutation = useMutation({
    mutationFn: async (slug: string) => {
      const response = await authClient.organization.checkSlug({ slug });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onSubmit: z.object({
        name: z.string().trim().min(1),
        slug: z.string().trim().min(1),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createOrganizationMutation.mutateAsync({
          name: value.name,
          slug: value.slug,
        });

        await queryClient.refetchQueries({
          queryKey: ["organizations"],
        });

        navigate({
          to: ".",
          replace: true,
          params: {
            organizationSlug: value.slug,
          },
        });

        formApi.reset();

        Toaster.success("Organization created successfully!");

        onOpenChange(false);
      } catch {
        Toaster.error("Failed to create organization");
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-120">
        <Dialog.Header>
          <Dialog.Title>New Organization</Dialog.Title>
          <Dialog.Description>
            Create a new organization to collaborate with your team
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
            <form.Field
              name="name"
              listeners={{
                onChange: ({ value }) => {
                  const slugState = form.getFieldMeta("slug");

                  if (slugState?.isPristine) {
                    form.setFieldValue(
                      "slug",
                      // TODO: unify slug rules
                      value
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                      {
                        dontUpdateMeta: true,
                      },
                    );
                    form.validateField("slug", "change");
                  }
                },
              }}
            >
              {(field) => (
                <form.FieldContainer>
                  <Label.Root>
                    Name
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root
                    className="w-full"
                    isInvalid={field.state.meta.errors.length > 0}
                  >
                    <Input.Wrapper>
                      <Input.Field
                        id={field.name}
                        name={field.name}
                        placeholder="Acme Inc."
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

            <form.Field
              name="slug"
              asyncDebounceMs={500}
              validators={{
                onChangeAsync: async ({ value }) => {
                  let isSlugAvailable = false;

                  try {
                    const response = await checkSlugMutation.mutateAsync(value);
                    isSlugAvailable = Boolean(response.status);
                  } catch {
                    isSlugAvailable = false;
                  }

                  if (isSlugAvailable) {
                    return;
                  }

                  return { message: "Slug is already taken" };
                },
              }}
            >
              {(field) => (
                <form.FieldContainer>
                  <Label.Root>
                    Slug
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root
                    className="w-full"
                    isInvalid={field.state.meta.errors.length > 0}
                  >
                    <Input.Wrapper>
                      <Input.Field
                        id={field.name}
                        name={field.name}
                        placeholder="acme-inc"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.isValidating &&
                        !field.form.state.isSubmitting && (
                          <Input.Icon>
                            <Loader2Icon className="animate-spin" />
                          </Input.Icon>
                        )}
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
          </div>
          <Dialog.Footer className="justify-end">
            <Dialog.Close asChild>
              <Button.Root variant="secondary">Cancel</Button.Root>
            </Dialog.Close>
            <form.Subscribe
              selector={({ isSubmitting, isDirty, canSubmit }) => ({
                isSubmitting,
                isDirty,
                canSubmit,
              })}
            >
              {({ isSubmitting, isDirty, canSubmit }) => (
                <Button.Root
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!canSubmit || !isDirty}
                >
                  Create Organization
                </Button.Root>
              )}
            </form.Subscribe>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
