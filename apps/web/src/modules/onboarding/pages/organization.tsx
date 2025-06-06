import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { Button, Input, Label, Text, Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/_authorized/onboarding/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

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
    onSubmit: async ({ value }) => {
      try {
        await createOrganizationMutation.mutateAsync({
          name: value.name,
          slug: value.slug,
        });

        await queryClient.refetchQueries({
          queryKey: ["organizations"],
        });

        navigate({
          to: "/$organizationSlug",
          replace: true,
          params: {
            organizationSlug: value.slug,
          },
        });

        Toaster.success("Organization updated successfully!");
      } catch {
        Toaster.error("Failed to update organization");
      }
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 p-6 sm:max-w-96">
        <div className="flex-1" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-1 flex-col gap-6"
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
          <form.Subscribe
            selector={({ isSubmitting, isDirty, isFieldsValid }) => ({
              isSubmitting,
              isDirty,
              isFieldsValid,
            })}
          >
            {({ isSubmitting, isDirty, isFieldsValid }) => (
              <div className="flex justify-end gap-2">
                <Button.Root
                  type="submit"
                  color="accent"
                  isLoading={isSubmitting}
                  isDisabled={!isDirty || !isFieldsValid}
                >
                  Save & Continue
                  <Button.Icon>
                    <ArrowRightIcon />
                  </Button.Icon>
                </Button.Root>
              </div>
            )}
          </form.Subscribe>
        </form>
        <div className="flex-1" />
      </div>
    </div>
  );
}
