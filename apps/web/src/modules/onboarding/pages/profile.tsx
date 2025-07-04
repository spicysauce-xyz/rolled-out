import { authClient } from "@lib/auth";
import useAppForm from "@lib/form";
import { useSession } from "@modules/auth/hooks/useSession";
import { Button, Input, Label, Toaster } from "@mono/ui";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, UserIcon } from "lucide-react";
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
      name: sessionData?.data?.user?.name || "",
      email: sessionData?.data?.user?.email || "",
    },
    validators: {
      onChange: z.object({
        name: z.string().trim().min(1),
        email: z.string().email(),
      }),
    },
    onSubmit: async ({ value }) => {
      // TODO: Add error toast
      await authClient.updateUser(
        {
          name: value.name.trim(),
          onboarded: true,
        },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["session"] });

            Toaster.success("Updated!");

            navigate({
              to: "/onboarding/organization",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 p-6 sm:max-w-108">
        <div className="flex-1" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-col gap-6"
        >
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
          <form.Subscribe
            selector={({ isSubmitting, isDirty, isFieldsValid }) => ({
              isSubmitting,
              isDirty,
              isFieldsValid,
            })}
          >
            {({ isSubmitting, isDirty, isFieldsValid }) => (
              <div className="flex justify-between gap-2">
                <Button.Root
                  type="button"
                  variant="secondary"
                  isDisabled={isSubmitting}
                >
                  Skip
                </Button.Root>
                <Button.Root
                  type="submit"
                  color="accent"
                  isLoading={isSubmitting}
                  isDisabled={!isDirty || !isFieldsValid}
                >
                  Create Organization
                  <Button.Icon>
                    <ArrowRightIcon />
                  </Button.Icon>
                </Button.Root>
              </div>
            )}
          </form.Subscribe>
        </form>
        <div className="flex-1" />
      </div>
    </div>
  );
}
