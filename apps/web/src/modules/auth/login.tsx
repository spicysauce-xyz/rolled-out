import { Button, Input, Label, LinkButton, Text, Toaster } from "@mono/ui";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { LockIcon, MailIcon } from "lucide-react";
import { z } from "zod";
import { authClient } from "../../lib/auth";
import useAppForm from "../../lib/form";

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
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["session"] });
            setTimeout(async () => {
              await navigate({ to: search.redirect ?? "/" });
            });
          },
          onError: (ctx) => {
            Toaster.error("Error", { description: ctx.error.message });
          },
        },
      );
    },
  });

  return (
    <div className="flex min-h-svh w-full gap-6 p-4">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-col gap-8 sm:max-w-96"
          noValidate
        >
          <div className="flex flex-col gap-4">
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
            <form.Field name="password">
              {(field) => (
                <form.FieldContainer>
                  <Label.Root htmlFor={field.name}>
                    Password
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root isInvalid={field.state.meta.errors.length > 0}>
                    <Input.Wrapper>
                      <Input.Icon>
                        <LockIcon />
                      </Input.Icon>
                      <Input.Field
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        type="password"
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="supersecret"
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
          </div>
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
                Sign In
              </Button.Root>
            )}
          </form.Subscribe>
        </form>
        <Text.Root size="sm" color="muted">
          Don't have an account?{" "}
          <Link to="/signup" search={{ redirect: search.redirect }}>
            <LinkButton.Root color="accent">Sign up</LinkButton.Root>
          </Link>
        </Text.Root>
      </div>
      <div className="hidden flex-1 rounded-xl border border-neutral-100 bg-neutral-50 md:flex" />
    </div>
  );
}
