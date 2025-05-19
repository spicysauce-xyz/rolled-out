import * as Card from "@components/card";
import { useSession } from "@hooks/useSession";
import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { Button, Input, Label, Toaster } from "@mono/ui";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MailIcon, SaveIcon, UserIcon } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authorized/$organizationSlug_/settings/profile",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();

  const form = useAppForm({
    defaultValues: {
      name: sessionData?.data?.user?.name || "",
      email: sessionData?.data?.user?.email || "",
    },
    validators: {
      onChange: z.object({
        name: z.string().trim().min(1),
        email: z.string().email(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.updateUser(
        {
          name: value.name.trim(),
        },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["session"] });

            formApi.reset();

            Toaster.success("Account updated successfully!");
          },
        },
      );
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
                <Input.Field
                  placeholder="john@doe.com"
                  value={sessionData?.data?.user?.email}
                />
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
