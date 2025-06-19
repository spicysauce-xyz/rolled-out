import { Avatar, Clickable, Tag, Text, Tooltip } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { format } from "date-fns";
import React from "react";

interface UpdateEntryProps
  extends React.ComponentProps<typeof Clickable.Root> {}

const UpdateEntryRoot: React.FC<UpdateEntryProps> = ({
  children,
  ...props
}) => {
  return (
    <Clickable.Root
      variant="tertiary"
      className="flex w-full items-start justify-between gap-6 rounded-none border-0 px-6 py-4"
      {...props}
    >
      {children}
    </Clickable.Root>
  );
};

interface UpdateEntryGroupProps {
  className?: string;
}

const UpdateEntryGroup: React.FC<
  React.PropsWithChildren<UpdateEntryGroupProps>
> = ({ children, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
};

interface UpdateEntryNumberProps {
  number: number;
}

const UpdateNumber: React.FC<UpdateEntryNumberProps> = ({ number }) => {
  return (
    <div className="flex items-center gap-2">
      <Text.Root size="sm" color="muted">
        #{number.toString().padStart(3, "0")}
      </Text.Root>
    </div>
  );
};

interface UpdateEntryTitleProps {
  title: string;
}

const UpdateEntryTitle: React.FC<UpdateEntryTitleProps> = ({ title }) => {
  return (
    <Text.Root size="sm" weight="medium">
      {title}
    </Text.Root>
  );
};

interface UpdateEntryTagsProps {
  tags: string[];
  className?: string;
}

const UpdateEntryTags: React.FC<UpdateEntryTagsProps> = ({
  tags,
  className,
}) => {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      {tags.map((tag) => {
        return (
          <Tag.Root className="h-auto rounded-sm px-1" key={tag}>
            {tag}
          </Tag.Root>
        );
      })}
    </div>
  );
};

const UpdateEntryMeta: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Tooltip.Provider>
      <div className="flex items-center gap-2">
        {React.Children.toArray(children).map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: there is no other way to get the key. or maybe I'm wrong
          <React.Fragment key={index}>
            {index > 0 && (
              <Text.Root size="sm" color="muted">
                ·
              </Text.Root>
            )}
            {item}
          </React.Fragment>
        ))}
      </div>
    </Tooltip.Provider>
  );
};

interface UpdateEntryEditorsProps {
  editors: { id: string; name: string; image: string | null }[];
}

const UpdateEntryEditors: React.FC<UpdateEntryEditorsProps> = ({ editors }) => {
  const creator = editors[0];
  const otherEditors = editors.slice(1);

  return (
    <Tooltip.Root>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <Avatar.Root className="size-5 rounded-sm">
            <Avatar.Image src={creator?.image || ""} />
            <Avatar.Fallback>{creator?.name?.charAt(0)}</Avatar.Fallback>
          </Avatar.Root>
          <Text.Root size="sm" weight="medium">
            {creator?.name}
          </Text.Root>
        </div>
        <Tooltip.Trigger asChild>
          {otherEditors.length > 0 && (
            <Text.Root
              size="sm"
              color="muted"
              className="decoration-dashed underline-offset-2 hover:underline"
            >
              {" "}
              and {otherEditors.length} other
              {otherEditors.length !== 1 ? "s" : ""}
            </Text.Root>
          )}
        </Tooltip.Trigger>
      </div>
      <Tooltip.Content>
        <Tooltip.Title>
          {otherEditors.map((editor) => editor.name).join(", ")}
        </Tooltip.Title>
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

interface UpdateEntryDateProps {
  date: string;
  label: string;
}

const UpdateEntryDate: React.FC<UpdateEntryDateProps> = ({ date, label }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Text.Root
          size="sm"
          color="muted"
          className="decoration-dashed underline-offset-2 hover:underline"
        >
          {format(date, "MMM d")}
        </Text.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Title>
          {label} {format(date, "MMM d, h:mm a")}
        </Tooltip.Title>
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

export {
  UpdateEntryRoot as Root,
  UpdateEntryGroup as Group,
  UpdateNumber as Number,
  UpdateEntryTitle as Title,
  UpdateEntryTags as Tags,
  UpdateEntryMeta as Meta,
  UpdateEntryEditors as Editors,
  UpdateEntryDate as Date,
};
