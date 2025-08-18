import { Card } from "@components/card";
import { organizationQuery, organizationsQuery } from "@lib/api/queries";
import useAppForm from "@lib/form";
import { FileUpload } from "@modules/shared/components/file-upload";
import { Avatar, Button, Input, Label } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { match } from "ts-pattern";
import { z } from "zod";
import { useCheckSlugMutation } from "./hooks/use-check-slug-mutation";
import { useUpdateOrganizationMutation } from "./hooks/use-update-organization-mutation";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/details"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { organization, organizations } = Route.useRouteContext();

  useQuery({ ...organizationsQuery(), initialData: organizations });

  const { data: organizationQueryData, isPending: isOrganizationQueryPending } =
    useQuery({
      ...organizationQuery(organization.id),
      placeholderData: {
        ...organization,
        members: [],
        invitations: [],
      },
    });

  const checkSlugMutation = useCheckSlugMutation();

  const updateOrganizationMutation = useUpdateOrganizationMutation();

  const form = useAppForm({
    defaultValues: {
      name: organizationQueryData?.name || "",
      slug: organizationQueryData?.slug || "",
      logo: organizationQueryData?.logo || null,
    },
    validators: {
      onSubmit: z.object({
        name: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        logo: z.string().nullable(),
      }),
    },
    onSubmit: async ({ value, formApi }) =>
      updateOrganizationMutation.mutateAsync(
        {
          name: value.name,
          slug: value.slug,
          logo: value.logo || undefined,
          organizationId: organization.id,
        },
        {
          onSuccess: () => {
            if (value.slug !== organization.slug) {
              navigate({
                to: ".",
                replace: true,
                params: {
                  organizationSlug: value.slug,
                },
              });
            }

            formApi.reset();
          },
        }
      ),
  });

  return (
    <Card.Root>
      <Card.Header>
        <Card.HeaderCopy>
          <Card.HeaderTitle>Details</Card.HeaderTitle>
          <Card.HeaderDescription>
            Manage your organization details
          </Card.HeaderDescription>
        </Card.HeaderCopy>
      </Card.Header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card.Content className="gap-4">
          <form.Field name="logo">
            {(field) => (
              <form.FieldContainer>
                <Label.Root>Avatar</Label.Root>
                <FileUpload
                  id={field.name}
                  onUploadComplete={(url) => {
                    field.setValue(url);
                  }}
                  type="logo"
                >
                  {({ id }, state) => (
                    <label htmlFor={id}>
                      <Avatar.Root className="group size-10">
                        {match(state)
                          .with(
                            { state: "uploading" },
                            ({ preview, progress }) => (
                              <div className="relative overflow-hidden rounded-md">
                                <Avatar.Image src={preview} />
                                <div
                                  className="absolute inset-x-0 bottom-0 bg-white/10 backdrop-blur-sm transition-all"
                                  style={{ top: `${progress}%` }}
                                />
                              </div>
                            )
                          )
                          .otherwise(() => (
                            <>
                              <Avatar.Image src={field.state.value || ""} />
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                                <ImageIcon className="size-4 text-white" />
                              </div>
                            </>
                          ))}
                        <Avatar.Fallback>
                          {organization.name[0]}
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </label>
                  )}
                </FileUpload>
              </form.FieldContainer>
            )}
          </form.Field>
          <form.Field name="name">
            {(field) => (
              <form.FieldContainer errors={field.state.meta.errors}>
                <Label.Root>
                  Name
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root
                  className="w-full"
                  isDisabled={
                    isOrganizationQueryPending || form.state.isSubmitting
                  }
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

                if (value === organization.slug) {
                  return;
                }

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
                  isDisabled={
                    isOrganizationQueryPending || form.state.isSubmitting
                  }
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
        </Card.Content>
        <Card.Footer className="mt-4">
          <form.Subscribe
            selector={({ isSubmitting, isDirty, canSubmit }) => ({
              isSubmitting,
              isDirty,
              canSubmit,
            })}
          >
            {({ isSubmitting, isDirty, canSubmit }) => (
              <div className="flex gap-2">
                <Button.Root
                  isDisabled={!(canSubmit && isDirty)}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  <Button.Icon render={<SaveIcon />} />
                  Save
                </Button.Root>
                <Button.Root
                  isDisabled={isSubmitting || !isDirty}
                  onClick={() => form.reset()}
                  type="button"
                  variant="secondary"
                >
                  Discard
                </Button.Root>
              </div>
            )}
          </form.Subscribe>
        </Card.Footer>
      </form>
    </Card.Root>
  );
}
