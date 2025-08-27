import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type React from "react";
import {
  type CaptionLabel,
  type DayButton,
  DayPicker,
  getDefaultClassNames,
  type Month,
  type MonthCaption,
  type Months,
  type NextMonthButton,
  type PreviousMonthButton,
  type Root,
  type Week,
  type Weekday,
  type Weekdays,
  type Weeks,
} from "react-day-picker";
import { cn } from "../../utils";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Text } from "../text";

const CalendarRootComponent = ({
  className,
  rootRef,
  ...props
}: React.ComponentProps<typeof Root>) => {
  return (
    <div
      className={cn(className)}
      data-slot="calendar"
      ref={rootRef}
      {...props}
    />
  );
};

const CalendarMonths = ({
  className,
  ...props
}: React.ComponentProps<typeof Months>) => {
  return (
    <div
      className={cn("relative flex flex-col gap-4 md:flex-row", className)}
      {...props}
    />
  );
};

const CalendarMonth = ({
  className,
  ...props
}: React.ComponentProps<typeof Month>) => {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} {...props} />
  );
};

const CalendarPreviousMonthButton = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PreviousMonthButton>, "color">) => {
  return (
    <IconButton.Root className={cn(className)} variant="tertiary" {...props}>
      <IconButton.Icon render={<ChevronLeftIcon />} />
    </IconButton.Root>
  );
};

const CalendarNextMonthButton = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof NextMonthButton>, "color">) => {
  return (
    <IconButton.Root className={cn(className)} variant="tertiary" {...props}>
      <IconButton.Icon render={<ChevronRightIcon />} />
    </IconButton.Root>
  );
};

const CalendarMonthCaption = ({
  className,
  ...props
}: React.ComponentProps<typeof MonthCaption>) => {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center justify-center px-9",
        className
      )}
      {...props}
    />
  );
};

const CalendarCaptionLabel = ({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CaptionLabel>, "color">) => {
  return (
    <Text.Root className={cn(className)} weight="medium" {...props}>
      {children}
    </Text.Root>
  );
};

const CalendarWeeks = ({
  className,
  ...props
}: React.ComponentProps<typeof Weeks>) => {
  return <tbody className={cn("w-full", className)} {...props} />;
};

const CalendarWeekdays = ({
  className,
  ...props
}: React.ComponentProps<typeof Weekdays>) => {
  return <tr className={cn("flex", className)} {...props} />;
};

const CalendarWeekday = ({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Weekday>, "color">) => {
  return (
    <Text.Root
      className={cn("flex-1 text-center", className)}
      color="muted"
      render={<th />}
      weight="medium"
      {...props}
    >
      {children}
    </Text.Root>
  );
};

const CalendarWeek = ({
  className,
  ...props
}: React.ComponentProps<typeof Week>) => {
  return <tr className={cn("mt-2 flex w-full", className)} {...props} />;
};

const CalendarDayButton = ({
  className,
  day,
  modifiers,
  color,
  children,
  ...props
}: React.ComponentProps<typeof DayButton>) => {
  return (
    <Button.Root
      className={cn(
        "aspect-square size-9 p-0",
        modifiers.selected && "bg-neutral-100",
        className
      )}
      variant="tertiary"
      {...props}
    >
      <div
        className={cn(
          "flex flex-1 items-center justify-center",
          modifiers.outside && "text-neutral-500"
        )}
      >
        {children}
      </div>
    </Button.Root>
  );
};

const CalendarRoot = ({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) => {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout="label"
      className={className}
      classNames={{
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
      }}
      components={{
        Root: CalendarRootComponent,
        Months: CalendarMonths,
        Month: CalendarMonth,
        PreviousMonthButton: CalendarPreviousMonthButton,
        NextMonthButton: CalendarNextMonthButton,
        MonthCaption: CalendarMonthCaption,
        CaptionLabel: CalendarCaptionLabel,
        Weeks: CalendarWeeks,
        Weekdays: CalendarWeekdays,
        Weekday: CalendarWeekday,
        Week: CalendarWeek,
        DayButton: CalendarDayButton,
      }}
      showOutsideDays
      {...props}
    />
  );
};

export { CalendarRoot as Root };
