import { ScrollArea } from "@mono/ui";
import { tv } from "@mono/ui/utils";
import React from "react";

const pageVariants = tv({
  slots: {
    root: "flex flex-1 flex-col overflow-hidden bg-white border-neutral-100",
    header: "p-4 px-6 flex justify-between gap-4 border-b border-neutral-100",
    content: "h-full px-6 py-6 gap-8 grid",
  },
});

type PageRootProps = React.HTMLAttributes<HTMLDivElement>;

const PageRoot = React.forwardRef<HTMLDivElement, PageRootProps>(
  ({ className, ...props }, ref) => {
    const { root } = pageVariants();

    return <div ref={ref} className={root({ className })} {...props} />;
  },
);

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, ...props }, ref) => {
    const { header } = pageVariants();

    return <div ref={ref} className={header({ className })} {...props} />;
  },
);

type PageContentProps = React.HTMLAttributes<HTMLDivElement>;

const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
  ({ className, ...props }, ref) => {
    const { content } = pageVariants();

    return (
      <ScrollArea.Root type="scroll">
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Viewport className="flex-1">
          <div ref={ref} className={content({ className })} {...props} />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    );
  },
);

export { PageRoot as Root, PageHeader as Header, PageContent as Content };
