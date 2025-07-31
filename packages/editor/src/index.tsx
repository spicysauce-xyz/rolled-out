import type { HocuspocusProvider } from "@hocuspocus/provider";
import { EditorContext, type UseEditorOptions, useEditor } from "@tiptap/react";
import { BubbleMenu } from "./components/bubble-menu";
import { Content } from "./components/content";
import { OutsideClick } from "./components/outside-click";
import extensions from "./extensions";
import { collaborationExtension } from "./extensions/collaboration";
import { collaborationCaretExtension } from "./extensions/collaboration-caret";

interface RootProps extends Omit<UseEditorOptions, "extensions"> {
  provider?: HocuspocusProvider;
  user?: { id: string; name: string; image?: string | null };
}

const Root: React.FC<React.PropsWithChildren<RootProps>> = ({
  children,
  provider,
  user,
  ...options
}) => {
  const editor = useEditor({
    extensions: [
      ...extensions,
      ...(provider
        ? [
            collaborationExtension(provider.document),
            collaborationCaretExtension(provider, user),
          ]
        : []),
    ],
    ...options,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <OutsideClick>{children}</OutsideClick>
    </EditorContext.Provider>
  );
};

export const Editor = {
  Root,
  Content,
  BubbleMenu,
};

export { editorContentClassName } from "./components/content";
export { generateHtml, type JSONContent } from "./utils";
