import useAppForm from "@lib/form";
import { Button, Dialog, Label, Select, Text, Toaster } from "@mono/ui";
import { addDays, addHours, addMinutes, format, startOfDay } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import z from "zod";
import { useSchedulePostMutation } from "../hooks/use-schedule-update-mutation";

interface SchedulePostDialogProps {
  defaultValue?: string | null;
  organizationId: string;
  postId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SchedulePostDialog: React.FC<SchedulePostDialogProps> = ({
  defaultValue,
  organizationId,
  postId,
  isOpen = false,
  onOpenChange,
}) => {
  const { mutateAsync: schedulePost } = useSchedulePostMutation();

  const form = useAppForm({
    defaultValues: {
      date:
        defaultValue ||
        addHours(startOfDay(addDays(new Date(), 1)), 12).toISOString(),
    },
    validators: {
      onSubmit: z.object({
        date: z.string().datetime(),
      }),
    },
    onSubmit: async ({ value, formApi }) =>
      schedulePost(
        {
          organizationId,
          id: postId,
          scheduledAt: value.date,
        },
        {
          onSuccess: () => {
            Toaster.success("Post scheduled");
            onOpenChange(false);
            formApi.reset();
          },
        }
      ),
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={isOpen}>
      <Dialog.Content className="max-w-100">
        <Dialog.Header>
          <Dialog.Title>Schedule Post</Dialog.Title>
          <Dialog.Description>
            Schedule your posts to go live at a later time.
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
            <form.Field name="date">
              {(field) => (
                <form.FieldContainer errors={field.state.meta.errors}>
                  <Label.Root htmlFor={field.name}>
                    Date & Time
                    <Label.Asterisk />
                  </Label.Root>
                  <div className="flex w-full gap-2">
                    <Button.Root
                      className="flex-1"
                      type="button"
                      variant="secondary"
                    >
                      <Button.Icon render={<CalendarIcon />} />
                      {format(field.state.value, "iii, d LLL")}
                    </Button.Root>
                    <Select.Root
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      value={field.state.value}
                    >
                      <Select.Trigger
                        render={
                          <Button.Root
                            className="flex-1"
                            type="button"
                            variant="secondary"
                          />
                        }
                      >
                        <Button.Icon render={<ClockIcon />} />
                        {format(field.state.value, "hh:mm a")}
                      </Select.Trigger>
                      <Select.Content align="start" className="max-h-40">
                        {Array.from({ length: 96 }, (_, i) => {
                          const start = startOfDay(field.state.value);
                          const value = addMinutes(start, i * 15);

                          return (
                            <Select.Item
                              key={value.toISOString()}
                              value={value.toISOString()}
                            >
                              {format(value, "h:mm a")}
                            </Select.Item>
                          );
                        })}
                      </Select.Content>
                    </Select.Root>
                  </div>
                  <Text.Root color="muted">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone} Timezone
                  </Text.Root>
                </form.FieldContainer>
              )}
            </form.Field>
          </div>
          <Dialog.Footer>
            <form.Subscribe>
              {({ isSubmitting, canSubmit }) => (
                <>
                  <Dialog.Cancel type="button">Cancel</Dialog.Cancel>
                  <Dialog.Action
                    color="warning"
                    isDisabled={!canSubmit}
                    isLoading={isSubmitting}
                  >
                    <Button.Icon render={<CalendarIcon />} />
                    Schedule post
                  </Dialog.Action>
                </>
              )}
            </form.Subscribe>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
