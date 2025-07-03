import useAppForm from "@lib/form";
import { useCreateOrganizationMutation } from "@modules/dashboard/hooks/use-create-organization-mutation";
import { useCheckSlugMutation } from "@modules/settings/pages/details/hooks/use-check-slug-mutation";
import { Button, Input, Label } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/_authorized/onboarding/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const createOrganizationMutation = useCreateOrganizationMutation();

  const checkSlugMutation = useCheckSlugMutation();

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
      await createOrganizationMutation.mutateAsync(
        {
          name: value.name,
          slug: value.slug,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/$organizationSlug",
              replace: true,
              params: {
                organizationSlug: value.slug,
              },
            });
          },
        }
      );
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 p-6 sm:max-w-96">
        <div className="flex-1" />
        <form
          className="flex w-full flex-1 flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.Field
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
                    isInvalid={field.state.meta.errors.length > 0}
                  >
                    <Input.Wrapper>
                      <Input.Field
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Acme Inc."
                        value={field.state.value}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </form.FieldContainer>
              )}
            </form.Field>

            <form.Field
              asyncDebounceMs={500}
              name="slug"
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
                <form.FieldContainer errors={field.state.meta.errors}>
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
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="acme-inc"
                        value={field.state.value}
                      />
                      {field.state.meta.isValidating &&
                        !field.form.state.isSubmitting && (
                          <Input.Icon>
                            <Loader2Icon className="animate-spin" />
                          </Input.Icon>
                        )}
                    </Input.Wrapper>
                  </Input.Root>
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
                  color="accent"
                  isDisabled={!(isDirty && isFieldsValid)}
                  isLoading={isSubmitting}
                  type="submit"
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
