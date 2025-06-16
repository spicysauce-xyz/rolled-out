import type { HocuspocusProvider } from "@hocuspocus/provider";
import { cn } from "@mono/ui/utils";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-cursor";
import { generateHTML as generateTiptapHTML } from "@tiptap/html";
import {
  EditorContext,
  type JSONContent,
  EditorContent as TiptapEditorContent,
  type UseEditorOptions,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import { useCallback } from "react";
import { BubbleMenu } from "./components/bubble-menu";
import { extensions } from "./extensions";

interface EditorRootProps extends Omit<UseEditorOptions, "extensions"> {
  provider: HocuspocusProvider;
  user: { id: string; name: string; image?: string | null };
}

export const EditorRoot: React.FC<React.PropsWithChildren<EditorRootProps>> = ({
  children,
  provider,
  user,
  ...options
}) => {
  const editor = useEditor({
    extensions: [
      ...extensions,
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCaret.configure({
        provider: provider,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        render: (user) => {
          const cursor = document.createElement("span");

          cursor.classList.add("border-x", "-mx-px", "relative");
          cursor.setAttribute("style", `border-color: ${user.color}`);

          const label = document.createElement("div");

          label.classList.add(
            "rounded-sm",
            "text-xs",
            "leading-4",
            "font-weight-500",
            "left-1/2",
            "-translate-x-1/2",
            "line-height-normal",
            "px-1",
            "py-0.5",
            "absolute",
            "-top-5",
            "user-select-none",
            "whitespace-nowrap",
          );

          label.setAttribute("style", `background-color: ${user.color}`);
          label.insertBefore(document.createTextNode(user.name), null);
          cursor.insertBefore(label, null);

          return cursor;
        },
      }),
    ],
    ...options,
  });

  const handleClickOutside = useCallback(() => {
    if (editor?.isEditable) {
      editor?.commands.focus("end");
    }
  }, [editor]);

  return (
    <EditorContext.Provider value={{ editor }}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: no need to focus on the editor on key press */}
      <div className="flex-1" onClick={handleClickOutside}>
        {children}
      </div>
    </EditorContext.Provider>
  );
};

export const editorContentClassName = cn(
  // base
  "prose min-w-full prose-headings:font-weight-500 [&>div]:outline-none",
  // placeholder
  "[&>div>*]:before:pointer-events-none [&>div>*]:before:absolute [&>div>*]:before:text-neutral-500 [&>div>*]:before:content-[attr(data-placeholder)]",
  // paragraph
  "prose-p:text-md prose-p:text-neutral-900 prose-p:tracking-tight",
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
);

export const EditorContent: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    <TiptapEditorContent
      className={editorContentClassName}
      editor={editor}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export const Editor = {
  Root: EditorRoot,
  Content: EditorContent,
  BubbleMenu,
};
export type { JSONContent };

export const generateHtml = (content: JSONContent) => {
  return generateTiptapHTML(content, extensions);
};
