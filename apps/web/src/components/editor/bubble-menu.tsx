import { ButtonGroup } from "@mono/ui";
import { BubbleMenu as BubbleMenuTiptap, type Editor } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

interface BubbleMenuProps {
  editor: Editor | null;
}

export const BubbleMenu = ({ editor }: BubbleMenuProps) => {
  return (
    <BubbleMenuTiptap
      shouldShow={() =>
        Boolean(!editor?.state.selection.empty && editor?.isActive("paragraph"))
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
    </BubbleMenuTiptap>
  );
};
