import { cn } from "@mono/ui/utils";
import { EditorContent, useCurrentEditor } from "@tiptap/react";

export const editorContentClassName = cn(
  // base
  "prose min-w-full prose-headings:font-weight-500 tracking-tight [&>*]:last:mb-0 [&>div]:outline-none [&>div]:[&>*]:last:mb-0",
  // placeholder
  "[&>div>*]:before:pointer-events-none [&>div>*]:before:absolute [&>div>*]:before:text-neutral-500 [&>div>*]:before:content-[attr(data-placeholder)]",
  // paragraph
  "prose-p:text-lg prose-p:text-neutral-900",
  // heading
  "prose-headings:font-weight-500 prose-headings:text-neutral-900",
  // h1
  "prose-h1:text-display-sm",
  // h2
  "prose-h2:text-display-xs",
  // h3
  "prose-h3:text-[1.125rem]",
  // strong
  "prose-strong:font-weight-600 prose-strong:text-inherit",
  // img
  "prose-img:rounded-xl",
  // code
  "prose-p:prose-code:rounded-xs prose-p:prose-code:bg-neutral-50 prose-p:prose-code:px-1 prose-code:font-mono prose-code:font-weight-400 prose-code:text-md prose-code:before:content-none prose-code:after:content-none",
  // code block
  "prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-neutral-50 prose-pre:p-4 prose-pre:text-neutral-700",
  // blockquote
  "prose-blockquote:border-neutral-200 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:[&>p]:text-neutral-900 prose-blockquote:[&>p]:not-italic prose-blockquote:[&>p]:before:content-none",
  // lists
  "prose-li:pl-0 prose-ol:prose-li:marker:text-neutral-900 prose-ol:prose-li:marker:text-sm prose-ul:prose-li:marker:text-neutral-200"
);

export const Content: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    <EditorContent
      className={editorContentClassName}
      editor={editor}
      onClick={(e) => e.stopPropagation()}
    />
  );
};
