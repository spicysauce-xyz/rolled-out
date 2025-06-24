import * as Card from "@components/card";
import { FileUpload } from "@components/file-upload";
import { sessionQuery } from "@lib/api/queries";
import useAppForm from "@lib/form";
import { Avatar, Button, Input, Label, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MailIcon, SaveIcon, UserIcon } from "lucide-react";
import { match } from "ts-pattern";
import { z } from "zod";
import { useUpdateUserMutation } from "./hooks/useUpdateUserMutation";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/profile",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { user: initialUser, session: initialSession } =
    Route.useRouteContext();

  const updateUserMutation = useUpdateUserMutation();

  const { data: sessionQueryData, isPending: isSessionQueryPending } = useQuery(
    {
      ...sessionQuery(),
      initialData: () => ({
        error: null,
        data: {
          user: initialUser,
          session: initialSession,
        },
      }),
    },
  );

  const user = sessionQueryData?.data.user;

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
    onSubmit: async ({ value, formApi }) => {
      await updateUserMutation.mutateAsync({
        name: value.name.trim(),
        image: value.image,
      });

      formApi.reset();
    },
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
                  type="avatar"
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
                  isInvalid={field.state.meta.errors.length > 0}
                  isDisabled={isSessionQueryPending || form.state.isSubmitting}
                >
                  <Input.Wrapper>
                    <Input.Icon>
                      <UserIcon />
                    </Input.Icon>
                    <Input.Field
                      id={field.name}
                      name={field.name}
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
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
                  <MailIcon />
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
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isDirty || !isFieldsValid}
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
