import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { Button, Input, Text, Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/_outside/_Auth.layout/login")({
  component: Login,
  // TODO: Make a use of this
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
});

function Login() {
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
      // TODO: Move to useMutation
      await authClient.signIn.magicLink(
        {
          email: value.email,
          callbackURL: "http://localhost",
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

  const socialLogin = useMutation({
    mutationFn: async (data: {
      provider: "google" | "github";
      callbackURL: string;
    }) => {
      const response = await authClient.signIn.social({
        provider: data.provider,
        callbackURL: data.callbackURL,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  const handleSocialLogin = async (provider: "google" | "github") => {
    await socialLogin.mutateAsync({
      provider,
      callbackURL: "http://localhost",
    });
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col items-center">
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 p-6 sm:max-w-96">
          <div className="flex w-full flex-1 flex-col items-center justify-end gap-2">
            <Text.Root size="lg" weight="medium">
              Sign in to your account
            </Text.Root>
            <Text.Root size="sm" color="muted" className="px-6 text-center">
              If you don't have an account, we will create one for you.
            </Text.Root>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex w-full flex-col gap-4"
            noValidate
          >
            <form.Field name="email">
              {(field) => (
                <form.FieldContainer>
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
          <div className="relative h-px w-full bg-neutral-100">
            <Text.Root
              color="muted"
              size="sm"
              className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-white px-2"
            >
              or
            </Text.Root>
          </div>
          <div className="flex w-full flex-col gap-4">
            <Button.Root
              isLoading={
                socialLogin.isPending &&
                socialLogin.variables.provider === "google"
              }
              isDisabled={socialLogin.isPending}
              onClick={() => handleSocialLogin("google")}
              color="neutral"
              variant="secondary"
              className="w-full"
            >
              Continue with Google
            </Button.Root>
            <Button.Root
              isLoading={
                socialLogin.isPending &&
                socialLogin.variables.provider === "github"
              }
              isDisabled={socialLogin.isPending}
              onClick={() => handleSocialLogin("github")}
              color="neutral"
              variant="secondary"
              className="w-full"
            >
              Continue with GitHub
            </Button.Root>
          </div>
          <div className="flex-1" />
        </div>
      </div>
      <div className="flex-1 border-neutral-100 border-l bg-neutral-50" />
    </div>
  );
}
