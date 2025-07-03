import useAppForm from "@lib/form";
import { Button, Input, Text } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { z } from "zod";
import { useSendMagicLinkMutation } from "../hooks/useSendMagicLinkMutation";
import { useSocialLoginMutation } from "../hooks/useSocialLoginMutation";

export const Route = createFileRoute("/_guest-only/login")({
  component: Login,
});

function Login() {
  const sendMagicLinkMutation = useSendMagicLinkMutation();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
      }),
    },
    onSubmit: async ({ value }) =>
      sendMagicLinkMutation.mutateAsync({
        email: value.email,
        callbackURL: window.location.href,
      }),
  });

  const socialLoginMutation = useSocialLoginMutation();

  const handleSocialLogin = async (provider: "google" | "github") => {
    await socialLoginMutation.mutateAsync({
      provider,
      callbackURL: window.location.href,
    });
  };

  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-neutral-50">
      <div className="flex w-full flex-col items-center gap-6 rounded-2xl p-6 sm:max-w-96">
        <div className="flex w-full flex-col items-center gap-2">
          <Text.Root size="lg" weight="medium">
            Sign in to your account
          </Text.Root>
          <Text.Root className="px-6 text-center" color="muted" size="sm">
            If you don't have an account, we will create one for you.
          </Text.Root>
        </div>
        <form
          className="flex w-full flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
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
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="john.doe@example.com"
                      type="email"
                      value={field.state.value}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {field.state.meta.errors.length ? (
                  <Text.Root className="text-danger-500" size="sm">
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
                className="w-full"
                color="accent"
                isDisabled={!isFieldsValid}
                isLoading={isSubmitting}
                type="submit"
              >
                Send Magic Link
              </Button.Root>
            )}
          </form.Subscribe>
        </form>
        <div className="relative h-px w-full bg-neutral-100">
          <Text.Root
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-neutral-50 px-2"
            color="muted"
            size="sm"
          >
            or
          </Text.Root>
        </div>
        <div className="flex w-full flex-col gap-4">
          <Button.Root
            className="w-full"
            color="neutral"
            isDisabled={socialLoginMutation.isPending}
            isLoading={
              socialLoginMutation.isPending &&
              socialLoginMutation.variables.provider === "google"
            }
            onClick={() => handleSocialLogin("google")}
            variant="secondary"
          >
            Continue with Google
          </Button.Root>
          <Button.Root
            className="w-full"
            color="neutral"
            isDisabled={socialLoginMutation.isPending}
            isLoading={
              socialLoginMutation.isPending &&
              socialLoginMutation.variables.provider === "github"
            }
            onClick={() => handleSocialLogin("github")}
            variant="secondary"
          >
            Continue with GitHub
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
