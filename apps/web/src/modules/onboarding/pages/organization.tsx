import { Page } from "@components/page";
import useAppForm from "@lib/form";
import { useSession } from "@modules/auth/hooks/use-session";
import { useCreateOrganizationMutation } from "@modules/dashboard/hooks/use-create-organization-mutation";
import { useCheckSlugMutation } from "@modules/settings/pages/details/hooks/use-check-slug-mutation";
import { FileUpload } from "@modules/shared/components/file-upload";
import { Avatar, Button, Input, Label, Text, Toaster } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, ImageIcon, Loader2Icon } from "lucide-react";
import { match } from "ts-pattern";
import { z } from "zod";

// Common email providers to exclude from prefill
const WELL_KNOWN_EMAIL_PROVIDERS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
];

// Extract domain from user email for prefill
const getDefaultWebsiteUrl = (email?: string) => {
  if (!email) return "";

  const domain = email.split("@")[1];
  if (!domain || WELL_KNOWN_EMAIL_PROVIDERS.includes(domain.toLowerCase())) {
    return "";
  }

  return `https://${domain}`;
};

export const Route = createFileRoute("/_authorized/onboarding/workspace")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { data: sessionData } = useSession();

  const createOrganizationMutation = useCreateOrganizationMutation();

  const checkSlugMutation = useCheckSlugMutation();

  const form = useAppForm({
    defaultValues: {
      logo: null as string | null,
      name: "",
      slug: "",
      websiteUrl: getDefaultWebsiteUrl(sessionData?.data?.user?.email),
    },
    validators: {
      onSubmit: z.object({
        logo: z.string().nullable(),
        name: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        websiteUrl: z
          .string()
          .trim()
          .min(1, "Website URL is required")
          .url("Invalid URL format")
          .refine(
            (val) => val.startsWith("http://") || val.startsWith("https://"),
            { message: "URL must start with http:// or https://" }
          )
          .refine(
            (val) => {
              try {
                const url = new URL(val);
                return url.pathname === "" || url.pathname === "/";
              } catch {
                return false;
              }
            },
            { message: "URL must not contain a path (pathname must be empty or '/')" }
          ),
      }),
    },
    onSubmit: async ({ value }) => {
      await createOrganizationMutation.mutateAsync(
        {
          name: value.name,
          slug: value.slug,
          logo: value.logo || undefined,
          websiteUrl: value.websiteUrl,
        },
        {
          onSuccess: () => {
            Toaster.success("Workspace created", {
              description: "Your workspace has been created successfully.",
            });

            navigate({
              to: "/$organizationSlug",
              replace: true,
              params: {
                organizationSlug: value.slug,
              },
            });
          },
          onError: () => {
            Toaster.error("Couldn't create workspace", {
              description: "Something went wrong. Please try again.",
            });
          },
        }
      );
    },
  });

  return (
    <Page.Wrapper>
      <Page.Content className="items-center justify-center">
        <div className="flex w-full flex-col gap-6 sm:max-w-96">
          <div className="flex w-full flex-col gap-2">
            <Text.Root size="lg" weight="medium">
              Workspace
            </Text.Root>
            <Text.Root color="muted">
              Create your organization to get started.
            </Text.Root>
          </div>
          <form
            className="flex w-full flex-1 flex-col gap-11"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-4">
              <form.Field name="logo">
                {(field) => (
                  <form.FieldContainer>
                    <Label.Root>Logo</Label.Root>
                    <FileUpload
                      id={field.name}
                      onUploadComplete={(url) => {
                        field.setValue(url);
                      }}
                      type="logo"
                    >
                      {({ id }, state) => (
                        <label htmlFor={id}>
                          <Avatar.Root className="group size-12">
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
                            <form.Subscribe
                              selector={({ values }) => ({ name: values.name })}
                            >
                              {({ name }) => (
                                <Avatar.Fallback>
                                  {name.charAt(0) || "?"}
                                </Avatar.Fallback>
                              )}
                            </form.Subscribe>
                          </Avatar.Root>
                        </label>
                      )}
                    </FileUpload>
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
                      const data = await checkSlugMutation.mutateAsync(value);
                      isSlugAvailable = data.available;
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

              <form.Field name="websiteUrl">
                {(field) => (
                  <form.FieldContainer errors={field.state.meta.errors}>
                    <Label.Root>
                      Website
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
                          placeholder="https://example.com"
                          value={field.state.value}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                    <Text.Root color="muted" size="sm">
                      Enter your website URL with http:// or https:// (e.g., https://example.com)
                    </Text.Root>
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
                <Button.Root
                  color="accent"
                  isDisabled={!(isDirty && isFieldsValid)}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Save & Continue
                  <Button.Icon render={<ArrowRightIcon />} />
                </Button.Root>
              )}
            </form.Subscribe>
          </form>
        </div>
      </Page.Content>
    </Page.Wrapper>
  );
}
