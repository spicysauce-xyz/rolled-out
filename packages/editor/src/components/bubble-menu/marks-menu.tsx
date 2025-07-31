import { ButtonGroup } from "@mono/ui";
import {
  BubbleMenu as BubbleMenuTiptap,
  type Editor,
  useCurrentEditor,
} from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

const marksOptions = [
  {
    name: "bold",
    icon: BoldIcon,
    command: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleBold().run(),
    isActive: (editor: Editor) => editor.isActive("bold"),
  },
  {
    name: "italic",
    icon: ItalicIcon,
    command: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleItalic().run(),
    isActive: (editor: Editor) => editor.isActive("italic"),
  },
  {
    name: "strike",
    icon: StrikethroughIcon,
    command: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleStrike().run(),
    isActive: (editor: Editor) => editor.isActive("strike"),
  },
  {
    name: "underline",
    icon: UnderlineIcon,
    command: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleUnderline().run(),
    isActive: (editor: Editor) => editor.isActive("underline"),
  },
  {
    name: "code",
    icon: CodeIcon,
    command: (editor: Editor) => editor.chain().focus().toggleCode().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleCode().run(),
    isActive: (editor: Editor) => editor.isActive("code"),
  },
  {
    name: "link",
    icon: LinkIcon,
    command: (editor: Editor) => {
      const isActive = editor.isActive("link");
      if (isActive) {
        editor.chain().focus().unsetLink().run();
      } else {
        editor.chain().focus().setLink({ href: "" }).run();
      }
    },
    canExecute: (editor: Editor) =>
      editor
        .can()
        .chain()
        .focus()
        .toggleLink({ href: "https://google.com/" })
        .run(),
    isActive: (editor: Editor) => editor.isActive("link"),
  },
];

export const MarksMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  const shouldShow = (args: { editor: Editor }) => {
    if (!args.editor) {
      return false;
    }
    if (args.editor.state.selection.empty) {
      return false;
    }
    if (args.editor.isActive("paragraph")) {
      return true;
    }
    return false;
  };

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenuTiptap
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{ duration: 150 }}
    >
      <ButtonGroup.Root
        className="shadow-xl"
        onClick={(e) => e.stopPropagation()}
        size="sm"
      >
        {marksOptions.map((option) => {
          const Icon = option.icon;
          return (
            <ButtonGroup.Item
              isActive={option.isActive(editor)}
              isDisabled={!option.canExecute(editor)}
              key={option.name}
              onClick={() => option.command(editor)}
            >
              <ButtonGroup.Icon>
                <Icon />
              </ButtonGroup.Icon>
            </ButtonGroup.Item>
          );
        })}
      </ButtonGroup.Root>
    </BubbleMenuTiptap>
  );
};
