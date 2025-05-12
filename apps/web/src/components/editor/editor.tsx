import { cn } from "@mono/ui/utils";
import {
  EditorContext,
  type JSONContent,
  EditorContent as TiptapEditorContent,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import { BubbleMenu } from "./components/bubble-menu";
import { extensions } from "./extensions";

type EditorProps = {
  content: JSONContent;
  onUpdate?: (json: JSONContent) => void;
};

export const EditorRoot: React.FC<React.PropsWithChildren<EditorProps>> = ({
  content,
  onUpdate,
  children,
}) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "flex-1 h-full",
      },
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="flex flex-1">{children}</div>
    </EditorContext.Provider>
  );
};

export const EditorContent: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    <TiptapEditorContent
      className={cn(
        // base
        "prose min-h-full min-w-full prose-headings:font-weight-500 [&>div]:outline-none",
        // placeholder
        "[&>div>*]:before:pointer-events-none [&>div>*]:before:absolute [&>div>*]:before:text-neutral-500 [&>div>*]:before:content-[attr(data-placeholder)]",
        // paragraph
        "prose-p:text-md prose-p:text-neutral-500 prose-p:tracking-tight",
        // heading
        "prose-headings:font-weight-500 prose-headings:text-neutral-900 prose-headings:tracking-tight",
        // h1
        "prose-h1:text-display-sm",
        // h2
        "prose-h2:text-display-xs",
        // h3
        "prose-h3:text-lg",
        // strong
        "prose-strong:font-weight-600 prose-strong:text-inherit",
        // img
        "prose-img:rounded-xl",
        // code
        "prose-code:rounded-xs prose-code:bg-neutral-100 prose-code:px-1 prose-code:font-mono prose-code:font-weight-400 prose-code:text-md prose-code:before:content-none prose-code:after:content-none",
        // blockquote
        "prose-blockquote:border-neutral-200 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:[&>p]:text-neutral-900 prose-blockquote:[&>p]:not-italic prose-blockquote:[&>p]:before:content-none",
        // lists
        "prose-li:pl-0 prose-ol:prose-li:marker:text-neutral-900 prose-ol:prose-li:marker:text-sm prose-ul:prose-li:marker:text-neutral-200",
      )}
      editor={editor}
    />
  );
};

export { EditorRoot as Root, EditorContent as Content, BubbleMenu };
