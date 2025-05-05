import { ButtonGroup } from "@mono/ui";
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
  BubbleMenu,
  EditorContent,
  type JSONContent,
  useEditor,
} from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { useCallback } from "react";

const CustomDocument = Document.extend({
  content: "heading block*",
});

const extensions = [
  CustomDocument,
  Heading.configure({ levels: [1, 2, 3] }),
  Paragraph,
  Text,
  Image,
  Bold.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-b": () => {
          const { $from } = this.editor.state.selection;
          const parentNode = $from.node($from.depth);

          if (parentNode.type.name.includes("heading")) {
            return true;
          }

          return this.editor.commands.toggleBold();
        },
      };
    },
  }),
  Italic.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-i": () => {
          const { $from } = this.editor.state.selection;
          const parentNode = $from.node($from.depth);

          if (parentNode.type.name.includes("heading")) {
            return true;
          }

          return this.editor.commands.toggleItalic();
        },
      };
    },
  }),
  Strike.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-s": () => {
          const { $from } = this.editor.state.selection;
          const parentNode = $from.node($from.depth);

          if (parentNode.type.name.includes("heading")) {
            return true;
          }

          return this.editor.commands.toggleStrike();
        },
      };
    },
  }),
  Underline.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-u": () => {
          const { $from } = this.editor.state.selection;
          const parentNode = $from.node($from.depth);

          if (parentNode.type.name.includes("heading")) {
            return true;
          }

          return this.editor.commands.toggleUnderline();
        },
      };
    },
  }),
  Code.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-e": () => {
          const { $from } = this.editor.state.selection;
          const parentNode = $from.node($from.depth);

          if (parentNode.type.name.includes("heading")) {
            return true;
          }

          return this.editor.commands.toggleCode();
        },
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
      <BubbleMenu
        shouldShow={() =>
          Boolean(
            !editor?.state.selection.empty && editor?.isActive("paragraph"),
          )
        }
        editor={editor}
        tippyOptions={{ duration: 150 }}
      >
        <ButtonGroup.Root
          size="sm"
          className="shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ButtonGroup.Item
            isActive={editor?.isActive("bold")}
            isDisabled={!editor?.can().chain().focus().toggleBold().run()}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <ButtonGroup.Icon>
              <BoldIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item
            isActive={editor?.isActive("italic")}
            isDisabled={!editor?.can().chain().focus().toggleItalic().run()}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <ButtonGroup.Icon>
              <ItalicIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item
            isActive={editor?.isActive("strike")}
            isDisabled={!editor?.can().chain().focus().toggleStrike().run()}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <ButtonGroup.Icon>
              <StrikethroughIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item
            isActive={editor?.isActive("underline")}
            isDisabled={!editor?.can().chain().focus().toggleUnderline().run()}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <ButtonGroup.Icon>
              <UnderlineIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item
            isActive={editor?.isActive("code")}
            isDisabled={!editor?.can().chain().focus().toggleCode().run()}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <ButtonGroup.Icon>
              <CodeIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item
            isActive={editor?.isActive("link")}
            isDisabled={
              !editor
                ?.can()
                .chain()
                .focus()
                .toggleLink({ href: "https://google.com/" })
                .run()
            }
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleLink({ href: "https://google.com/" })
                .run()
            }
          >
            <ButtonGroup.Icon>
              <LinkIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
        </ButtonGroup.Root>
      </BubbleMenu>
    </div>
  );
};
