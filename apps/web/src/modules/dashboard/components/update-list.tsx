import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { Skeleton, Tag, Text, Tooltip } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { format } from "date-fns";
import React from "react";

interface UpdateEntryProps extends useRender.ComponentProps<"button"> {}

const UpdateEntryRoot: React.FC<UpdateEntryProps> = ({
  render = <button type="button" />,
  ...props
}) => {
  const defaultProps: useRender.ElementProps<"button"> = {
    className:
      "flex w-full items-start justify-between gap-4 rounded-none border-0 px-6 py-4 hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-within:bg-neutral-50 outline-none",
  };

  const element = useRender({
    render,
    props: mergeProps(defaultProps, props),
  });

  return element;
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
      <Text.Root color="muted">#{number.toString().padStart(3, "0")}</Text.Root>
    </div>
  );
};

interface UpdateEntryTitleProps {
  title: string;
}

const UpdateEntryTitle: React.FC<UpdateEntryTitleProps> = ({ title }) => {
  return <Text.Root weight="medium">{title}</Text.Root>;
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

interface UpdateEntryMetaProps {
  className?: string;
}

const UpdateEntryMeta: React.FC<
  React.PropsWithChildren<UpdateEntryMetaProps>
> = ({ children, className }) => {
  return (
    <Tooltip.Provider>
      <div
        className={cn("flex items-center gap-2 text-neutral-500", className)}
      >
        {React.Children.toArray(children).map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: there is no other way to get the key. or maybe I'm wrong
          <React.Fragment key={index}>
            {index > 0 && <Text.Root className="text-inherit">·</Text.Root>}
            {item}
          </React.Fragment>
        ))}
      </div>
    </Tooltip.Provider>
  );
};

interface UpdateEntryEditorsProps {
  editors: { user: { id: string; name: string; image: string | null } }[];
}

const UpdateEntryEditors: React.FC<UpdateEntryEditorsProps> = ({ editors }) => {
  const creator = editors[0].user;
  const otherEditors = editors.slice(1);

  return (
    <Tooltip.Root>
      <div className="flex items-center gap-1">
        <Text.Root weight="medium">{creator?.name}</Text.Root>
        {otherEditors.length > 0 && (
          <Tooltip.Trigger>
            <Text.Root
              className="decoration-dashed underline-offset-2 hover:underline"
              color="muted"
            >
              {" "}
              and {otherEditors.length} other
              {otherEditors.length !== 1 ? "s" : ""}
            </Text.Root>
          </Tooltip.Trigger>
        )}
      </div>
      <Tooltip.Content>
        <Tooltip.Title>
          {otherEditors.map((editor) => editor.user.name).join(", ")}
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
          className="decoration-dashed underline-offset-2 hover:underline"
          color="muted"
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

const UpdatesListSkeleton: React.FC = () => {
  return (
    <UpdateEntryRoot>
      <UpdateEntryGroup>
        <Skeleton.Root className="h-5 w-8 rounded-xs" />
        <Skeleton.Root
          className="h-5 rounded-xs"
          style={{ width: Math.random() * 200 + 100 }}
        />
      </UpdateEntryGroup>
      <UpdateEntryGroup className="flex-1">
        <Skeleton.Root className="h-5 w-10 rounded-xs" />
        <Skeleton.Root className="h-5 w-12 rounded-xs" />
      </UpdateEntryGroup>
      <UpdateEntryMeta className="text-neutral-200">
        <Skeleton.Root className="h-5 w-34 rounded-xs" />
        <Skeleton.Root className="h-5 w-22 rounded-xs" />
        <Skeleton.Root className="h-5 w-11 rounded-xs" />
      </UpdateEntryMeta>
      <Skeleton.Root className="mx-2 h-5 w-5 rounded-xs" />
    </UpdateEntryRoot>
  );
};

export const UpdateEntry = {
  Root: UpdateEntryRoot,
  Group: UpdateEntryGroup,
  Number: UpdateNumber,
  Title: UpdateEntryTitle,
  Tags: UpdateEntryTags,
  Meta: UpdateEntryMeta,
  Editors: UpdateEntryEditors,
  Date: UpdateEntryDate,
  Skeleton: UpdatesListSkeleton,
};

const UpdatesListRoot: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col divide-y divide-neutral-100">{children}</div>
  );
};

export const UpdatesList = {
  Root: UpdatesListRoot,
};
