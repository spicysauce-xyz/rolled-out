import { cn } from "@mono/ui/utils";
import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Document } from "@tiptap/extension-document";
import { Heading } from "@tiptap/extension-heading";
import { Image } from "@tiptap/extension-image";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { Underline } from "@tiptap/extension-underline";
import {
  EditorContent,
  type JSONContent,
  type Editor as TiptapEditor,
  useEditor,
} from "@tiptap/react";
import { useCallback } from "react";
import { BubbleMenu } from "./bubble-menu";

const CustomDocument = Document.extend({
  content: "title block*",
});

const Title = Heading.extend({
  name: "title",
  group: "block",
  content: "text*",
  defining: true,
  addInputRules() {
    return [];
  },
  parseHTML() {
    return [{ tag: "h1:first-child" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["h1", HTMLAttributes, 0];
  },
});

const onlyInAllowedNodesForMarks = (
  editor: TiptapEditor,
  action: () => boolean,
) => {
  const { $from } = editor.state.selection;
  const parentNode = $from.node($from.depth);

  if (["heading", "title"].includes(parentNode.type.name)) {
    return true;
  }

  return action();
};

const extensions = [
  CustomDocument,
  Title.configure({ levels: [1] }),
  Heading.configure({ levels: [2, 3] }),
  Paragraph,
  Text,
  Image,
  Bold.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-b": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleBold,
          ),
      };
    },
  }),
  Italic.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-i": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleItalic,
          ),
      };
    },
  }),
  Strike.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-s": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleStrike,
          ),
      };
    },
  }),
  Underline.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-u": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleUnderline,
          ),
      };
    },
  }),
  Code.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-e": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleCode,
          ),
      };
    },
  }),
  Link.configure({
    openOnClick: "whenNotEditable",
    autolink: true,
  }),
];

type EditorProps = {
  content: JSONContent;
  onUpdate?: (json: JSONContent) => void;
};

export const Editor: React.FC<EditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
  });

  const handleClickOutside = useCallback(() => {
    editor?.commands.focus("end");
  }, [editor]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: no need to focus on the editor on key press
    <div className="flex-1" onClick={handleClickOutside}>
      <EditorContent
        className={cn(
          // base
          "prose min-w-full prose-headings:font-weight-500 [&>div]:outline-none",
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
        )}
        editor={editor}
        onClick={(e) => e.stopPropagation()}
      />
      <BubbleMenu editor={editor} />
    </div>
  );
};
