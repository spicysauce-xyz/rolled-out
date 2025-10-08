import { Page } from "@components/page";
import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { useSession } from "@modules/auth/hooks/use-session";
import { FileUpload } from "@modules/shared/components/file-upload";
import { Avatar, Button, Input, Label, Text, Toaster } from "@mono/ui";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, ImageIcon, MailIcon, UserIcon } from "lucide-react";
import { match } from "ts-pattern";
import { z } from "zod";

export const Route = createFileRoute("/_authorized/onboarding/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const navigate = Route.useNavigate();

  const form = useAppForm({
    defaultValues: {
      image: sessionData?.data?.user?.image || null,
      name: sessionData?.data?.user?.name || "",
      email: sessionData?.data?.user?.email || "",
    },
    validators: {
      onChange: z.object({
        image: z.string().nullable(),
        name: z.string().trim().min(1),
        email: z.string().email(),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.updateUser(
        {
          name: value.name.trim(),
          image: value.image,
          onboarded: true,
        },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["session"] });

            Toaster.success("Profile saved", {
              description: "Your profile has been updated successfully.",
            });

            navigate({
              to: "/onboarding/workspace",
            });
          },
          onError: () => {
            Toaster.error("Couldn't save profile", {
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
              Profile Info
            </Text.Root>
            <Text.Root color="muted">
              Complete your profile to get started.
            </Text.Root>
          </div>
          <form
            className="flex w-full flex-col gap-11"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-4">
              <form.Field name="image">
                {(field) => (
                  <form.FieldContainer>
                    <Label.Root>Avatar</Label.Root>
                    <FileUpload
                      id={field.name}
                      onUploadComplete={(url) => {
                        field.setValue(url);
                      }}
                      type="avatar"
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
                    >
                      <Input.Wrapper>
                        <Input.Icon>
                          <UserIcon />
                        </Input.Icon>
                        <Input.Field
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="John Doe"
                          value={field.state.value}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </form.FieldContainer>
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <form.FieldContainer>
                    <Label.Root>
                      Email
                      <Label.Asterisk />
                    </Label.Root>
                    <Input.Root
                      className="w-full"
                      isDisabled
                      isInvalid={field.state.meta.errors.length > 0}
                    >
                      <Input.Wrapper>
                        <Input.Icon>
                          <MailIcon />
                        </Input.Icon>
                        <Input.Field
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </form.FieldContainer>
                )}
              </form.Field>
            </div>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
            >
              {({ isSubmitting, canSubmit }) => (
                <Button.Root
                  color="accent"
                  isDisabled={!canSubmit}
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
