import useAppForm from "@lib/form";
import {
  Button,
  Clickable,
  Dialog,
  Input,
  Label,
  Select,
  Text,
} from "@mono/ui";
import _ from "lodash";
import { SendIcon } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { useInviteMemberMutation } from "../hooks/use-invite-member-mutation";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organizationId: string;
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  organizationId,
}) => {
  const inviteMemberMutation = useInviteMemberMutation({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      role: "member" as "member" | "admin" | "owner",
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email(),
        role: z.enum(["member", "admin", "owner"]),
      }),
    },
    onSubmit: async ({ value }) =>
      inviteMemberMutation.mutateAsync({
        organizationId,
        email: value.email,
        role: value.role,
      }),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={isOpen}>
      <Dialog.Content className="max-w-100">
        <Dialog.Header>
          <Dialog.Title>Invite Member</Dialog.Title>
          <Dialog.Description>
            Invite a new member to your organization
          </Dialog.Description>
        </Dialog.Header>
        <form
          className="flex w-full flex-col gap-6"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex w-full flex-col gap-4">
            <form.Field name="email">
              {(field) => (
                <form.FieldContainer className="flex-1">
                  <Label.Root htmlFor={field.name}>
                    Email
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root isInvalid={field.state.meta.errors.length > 0}>
                    <Input.Wrapper>
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
            <form.Field name="role">
              {(field) => (
                <form.FieldContainer>
                  <Label.Root htmlFor={field.name}>
                    Role
                    <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    onValueChange={(value) =>
                      field.handleChange(value as "member" | "admin" | "owner")
                    }
                    value={field.state.value}
                  >
                    <Select.Trigger asChild>
                      <Clickable.Root
                        className="flex h-10 items-center justify-between px-3"
                        variant="secondary"
                      >
                        <Select.Value placeholder="Role" />
                        <Clickable.Icon>
                          <Select.Icon />
                        </Clickable.Icon>
                      </Clickable.Root>
                    </Select.Trigger>
                    <Select.Content align="end">
                      {["member", "admin", "owner"].map((role) => (
                        <Select.Item key={role} value={role}>
                          <Select.ItemText>
                            <Text.Root size="sm" weight="medium">
                              {_.capitalize(role)}
                            </Text.Root>
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </form.FieldContainer>
              )}
            </form.Field>
          </div>
          <Dialog.Footer className="justify-end">
            <Dialog.Close asChild>
              <Button.Root variant="secondary">Cancel</Button.Root>
            </Dialog.Close>
            <form.Subscribe
              selector={({ isSubmitting, isFieldsValid }) => ({
                isSubmitting,
                isFieldsValid,
              })}
            >
              {({ isSubmitting, isFieldsValid }) => (
                <Button.Root
                  isDisabled={!isFieldsValid || isSubmitting}
                  type="submit"
                >
                  <Button.Icon>
                    <SendIcon />
                  </Button.Icon>
                  Send Invite
                </Button.Root>
              )}
            </form.Subscribe>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
