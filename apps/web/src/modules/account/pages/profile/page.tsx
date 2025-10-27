import { Card } from "@components/card";
import { Image01Icon, Mail01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { sessionQuery } from "@lib/api/queries";
import useAppForm from "@lib/form";
import { FileUpload } from "@modules/shared/components/file-upload";
import { Avatar, Button, Input, Label, Toaster } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { match } from "ts-pattern";
import { z } from "zod";
import { useUpdateUserMutation } from "./hooks/use-update-user-mutation";

export const Route = createFileRoute("/_authorized/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user: initialUser, session: initialSession } =
    Route.useRouteContext();

  const { mutateAsync: updateUser } = useUpdateUserMutation();

  const { data: sessionQueryData, isPending: isSessionQueryPending } = useQuery(
    {
      ...sessionQuery(),
      placeholderData: {
        error: null,
        data: {
          user: initialUser,
          session: initialSession,
        },
      },
    }
  );

  const user = sessionQueryData?.data?.user;

  const form = useAppForm({
    defaultValues: {
      image: user?.image || null,
      name: user?.name || "",
      email: user?.email || "",
    },
    validators: {
      onChange: z.object({
        image: z.string().nullable(),
        name: z.string().trim().min(1),
        email: z.string().email(),
      }),
    },
    onSubmit: ({ value, formApi }) =>
      updateUser(
        {
          name: value.name.trim(),
          image: value.image,
        },
        {
          onSuccess() {
            formApi.reset();
            Toaster.success("Account updated", {
              description: "Your account details have been saved successfully.",
            });
          },
          onError() {
            Toaster.error("Couldn't update account", {
              description:
                "Something went wrong while saving your changes. Please try again.",
            });
          },
        }
      ),
  });

  return (
    <Card.Root>
      <Card.Header>
        <Card.HeaderCopy>
          <Card.HeaderTitle>Profile</Card.HeaderTitle>
          <Card.HeaderDescription>
            Just a few details to help us identify you
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
                                <HugeiconsIcon
                                  className="size-4 text-white"
                                  icon={Image01Icon}
                                  strokeWidth={2}
                                />
                              </div>
                            </>
                          ))}
                        <Avatar.Fallback>
                          {user?.name.charAt(0)}
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
                  isDisabled={isSessionQueryPending || form.state.isSubmitting}
                  isInvalid={field.state.meta.errors.length > 0}
                >
                  <Input.Wrapper>
                    <Input.Icon>
                      <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
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

          <form.FieldContainer>
            <Label.Root>
              Email
              <Label.Asterisk />
            </Label.Root>
            <Input.Root className="w-full" isDisabled>
              <Input.Wrapper>
                <Input.Icon>
                  <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
                </Input.Icon>
                <Input.Field placeholder="john@doe.com" value={user?.email} />
              </Input.Wrapper>
            </Input.Root>
          </form.FieldContainer>
        </Card.Content>
        <Card.Footer className="mt-4">
          <form.Subscribe
            selector={({ isSubmitting, isDirty, isFieldsValid }) => ({
              isSubmitting,
              isDirty,
              isFieldsValid,
            })}
          >
            {({ isSubmitting, isDirty, isFieldsValid }) => (
              <div className="flex gap-2">
                <Button.Root
                  isDisabled={!(isDirty && isFieldsValid)}
                  isLoading={isSubmitting}
                  type="submit"
                >
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
