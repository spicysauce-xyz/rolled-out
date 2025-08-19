import { ScrollArea } from "@mono/ui";
import { tv } from "@mono/ui/utils";
import React from "react";

const pageVariants = tv({
  slots: {
    root: "flex h-svh w-full items-start",
    wrapper:
      "flex h-full flex-1 flex-col overflow-hidden border-neutral-100 bg-white",
    header: "flex justify-between gap-6 border-neutral-100 border-b p-4 px-6",
    content: "flex flex-1 flex-col gap-8 p-6",
  },
});

type PageRootProps = React.HTMLAttributes<HTMLDivElement>;

const PageRoot = React.forwardRef<HTMLDivElement, PageRootProps>(
  ({ className, ...props }, ref) => {
    const { root } = pageVariants();

    return <div className={root({ className })} ref={ref} {...props} />;
  }
);

type PageWrapperProps = React.HTMLAttributes<HTMLDivElement>;

const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ className, ...props }, ref) => {
    const { wrapper } = pageVariants();

    return <div className={wrapper({ className })} ref={ref} {...props} />;
  }
);

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, ...props }, ref) => {
    const { header } = pageVariants();

    return <div className={header({ className })} ref={ref} {...props} />;
  }
);

const PageContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { content } = pageVariants();

  return (
    <ScrollArea.Root className="flex-1 overflow-hidden">
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Viewport className={content({ className })} {...props} />
    </ScrollArea.Root>
  );
};

export const Page = {
  Root: PageRoot,
  Wrapper: PageWrapper,
  Header: PageHeader,
  Content: PageContent,
};
