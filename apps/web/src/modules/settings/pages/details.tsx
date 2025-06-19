import * as Card from "@components/card";
import { FileUpload } from "@components/file-upload";
import { organizationQuery, organizationsQuery } from "@lib/api/queries";
import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { Avatar, Button, Input, Label, Text, Toaster } from "@mono/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { match } from "ts-pattern";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/details",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const { organization } = Route.useRouteContext();

  const { data: organizationQueryData, isPending: isOrganizationQueryPending } =
    useQuery({
      ...organizationQuery(organization.id),
      placeholderData: {
        ...organization,
        members: [],
        invitations: [],
      },
    });

  const updateOrganizationMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      logo: string | undefined;
      organizationId: string;
    }) => {
      const response = await authClient.organization.update({
        organizationId: data.organizationId,
        data: {
          name: data.name,
          slug: data.slug,
          logo: data.logo,
        },
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
    onSubmit: async ({ value }) => {
      try {
        await updateOrganizationMutation.mutateAsync({
          name: value.name,
          slug: value.slug,
          logo: value.logo || undefined,
          organizationId: organization.id,
        });

        await queryClient.refetchQueries(organizationQuery(organization.id));

        await queryClient.refetchQueries(organizationsQuery());

        if (value.slug !== organization.slug) {
          navigate({
            to: ".",
            replace: true,
            params: {
              organizationSlug: value.slug,
            },
          });
        } else {
          await router.invalidate({ sync: true });
        }

        Toaster.success("Organization updated successfully!");
      } catch {
        Toaster.error("Failed to update organization");
      }
    },
  });

  useEffect(() => {
    form.reset({
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo || null,
    });
  }, [organization, form]);

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
                  type="logo"
                  id={field.name}
                  onUploadComplete={(url) => {
                    field.setValue(url);
                  }}
                >
                  {({ id }, state) => (
                    <label htmlFor={id}>
                      <Avatar.Root className="group size-15">
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
                            ),
                          )
                          .otherwise(() => (
                            <>
                              <Avatar.Image src={field.state.value || ""} />
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                                <Text.Root
                                  size="xs"
                                  weight="medium"
                                  className="text-white"
                                >
                                  Update
                                </Text.Root>
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
              <form.FieldContainer>
                <Label.Root>
                  Name
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root
                  className="w-full"
                  isInvalid={field.state.meta.errors.length > 0}
                  isDisabled={isOrganizationQueryPending}
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
              <form.FieldContainer>
                <Label.Root>
                  Slug
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root
                  className="w-full"
                  isInvalid={field.state.meta.errors.length > 0}
                  isDisabled={isOrganizationQueryPending}
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
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!canSubmit || !isDirty}
                >
                  <Button.Icon>
                    <SaveIcon />
                  </Button.Icon>
                  Save
                </Button.Root>
                {isDirty && (
                  <Button.Root
                    type="button"
                    variant="tertiary"
                    onClick={() => form.reset()}
                    isDisabled={isSubmitting}
                  >
                    Discard
                  </Button.Root>
                )}
              </div>
            )}
          </form.Subscribe>
        </Card.Footer>
      </form>
    </Card.Root>
  );
}
