import useAppForm from "@lib/form";
import { Button, Dialog, Input, Label, Select, Text } from "@mono/ui";
import _ from "lodash";
import { SendIcon } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { useInviteMemberMutation } from "../../settings/pages/members/hooks/use-invite-member-mutation";

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
                <form.FieldContainer errors={field.state.meta.errors}>
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
                    items={[
                      {
                        label: "Member",
                        value: "member",
                      },
                      {
                        label: "Admin",
                        value: "admin",
                      },
                      {
                        label: "Owner",
                        value: "owner",
                      },
                    ]}
                    onValueChange={(value) =>
                      field.handleChange(value as "member" | "admin" | "owner")
                    }
                    value={field.state.value}
                  >
                    <Select.Trigger
                      render={<Button.Root type="button" variant="secondary" />}
                    >
                      <Select.Value />
                      <Button.Icon
                        className="ml-auto"
                        render={<Select.Icon />}
                      />
                    </Select.Trigger>
                    <Select.Content>
                      {["member", "admin", "owner"].map((role) => (
                        <Select.Item key={role} value={role}>
                          <Select.ItemText>
                            <Text.Root weight="medium">
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
            <Dialog.Cancel render={<Button.Root variant="secondary" />}>
              Cancel
            </Dialog.Cancel>
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
                  <Button.Icon render={<SendIcon />} />
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
