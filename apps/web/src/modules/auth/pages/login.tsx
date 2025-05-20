import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { Button, Input, Label, Text, Toaster } from "@mono/ui";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: ({ context, search }) => {
    if (context.auth?.user) {
      throw redirect({ to: search.redirect || "/" });
    }
  },
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
});

function Login() {
  const search = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
      }),
    },
    onSubmit: async ({ value }) => {
      // TODO: Replace localhost with the host
      await authClient.signIn.magicLink(
        {
          email: value.email,
          callbackURL: `http://localhost:5173${search.redirect || ""}`,
        },
        {
          onSuccess: async () => {
            Toaster.success("Magic link sent");
          },
          onError: (ctx) => {
            Toaster.error("Error", { description: ctx.error.message });
          },
        },
      );
    },
  });

  return (
    <div className="flex min-h-svh w-full gap-6 p-6">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-col gap-4 sm:max-w-96"
          noValidate
        >
          <form.Field name="email">
            {(field) => (
              <form.FieldContainer>
                <Label.Root htmlFor={field.name}>
                  Email
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root isInvalid={field.state.meta.errors.length > 0}>
                  <Input.Wrapper>
                    <Input.Icon>
                      <MailIcon />
                    </Input.Icon>
                    <Input.Field
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type="email"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="john.doe@example.com"
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
          <form.Subscribe
            selector={({ isSubmitting, isFieldsValid }) => ({
              isSubmitting,
              isFieldsValid,
            })}
          >
            {({ isSubmitting, isFieldsValid }) => (
              <Button.Root
                type="submit"
                className="w-full"
                color="accent"
                isLoading={isSubmitting}
                isDisabled={!isFieldsValid}
              >
                Send Magic Link
              </Button.Root>
            )}
          </form.Subscribe>
        </form>
      </div>
      <div className="hidden flex-1 rounded-xl border border-neutral-100 bg-neutral-50 md:flex" />
    </div>
  );
}
