import { Clickable, Text, Tooltip } from "@mono/ui";
import { cn } from "@mono/ui/utils";
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
  const colors = [
    {
      text: "text-misc-1-500",
      bg: "bg-misc-1-50",
    },
    {
      text: "text-misc-2-500",
      bg: "bg-misc-2-50",
    },
    {
      text: "text-misc-3-500",
      bg: "bg-misc-3-50",
    },
    {
      text: "text-misc-4-500",
      bg: "bg-misc-4-50",
    },
    {
      text: "text-misc-5-500",
      bg: "bg-misc-5-50",
    },
    {
      text: "text-misc-6-500",
      bg: "bg-misc-6-50",
    },
  ];

  return (
    <div className={cn("flex items-start gap-2", className)}>
      {tags.map((tag) => {
        const color = colors[tag.length % colors.length];

        return (
          <div
            key={tag}
            className={cn("flex items-center rounded-sm px-1", color.bg)}
          >
            <Text.Root size="sm" weight="medium" className={color.text}>
              {tag}
            </Text.Root>
          </div>
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

export {
  UpdateEntryRoot as Root,
  UpdateEntryGroup as Group,
  UpdateNumber as Number,
  UpdateEntryTitle as Title,
  UpdateEntryTags as Tags,
  UpdateEntryMeta as Meta,
};
