import { Calendar, Popover } from "@mono/ui";

interface DatePickerProps
  extends Omit<
    React.ComponentProps<typeof Popover.Trigger>,
    "onChange" | "value"
  > {
  value: string;
  onChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value: _value,
  onChange,
  ...triggerProps
}) => {
  const value = _value ? new Date(_value) : undefined;

  const handleChange = (date: Date | undefined) => {
    if (date) {
      onChange(date.toISOString());
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger {...triggerProps} />
      <Popover.Content>
        <Calendar.Root mode="single" onSelect={handleChange} selected={value} />
      </Popover.Content>
    </Popover.Root>
  );
};
