import { ButtonGroup, Input, Label } from "@mono/ui";
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

export const BubbleMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  const shouldShow = (args: { editor: Editor }) => {
    if (!args.editor) return false;
    if (args.editor.state.selection.empty) return false;
    if (args.editor.isActive("paragraph")) return true;
    return false;
  };

  const shouldShowLinkMenu = (args: { editor: Editor }) => {
    if (!args.editor) return false;
    if (args.editor.state.selection.empty) return false;
    if (args.editor.isActive("link")) return true;
    return false;
  };

  return (
    <>
      <BubbleMenuTiptap
        shouldShow={shouldShow}
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
            onClick={() => {
              const isActive = editor?.isActive("link");

              if (isActive) {
                editor?.chain().focus().unsetLink().run();
              } else {
                editor?.chain().focus().setLink({ href: "" }).run();
              }
            }}
          >
            <ButtonGroup.Icon>
              <LinkIcon />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
        </ButtonGroup.Root>
      </BubbleMenuTiptap>
      <BubbleMenuTiptap
        pluginKey="link-menu"
        shouldShow={shouldShowLinkMenu}
        editor={editor}
        className="bg-red-500"
        tippyOptions={{ duration: 150, placement: "bottom" }}
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl"
        >
          <Label.Root>Link</Label.Root>
          <Input.Root size="sm">
            <Input.Wrapper>
              <Input.Icon>
                <LinkIcon />
              </Input.Icon>
              <Input.Field
                value={editor?.getAttributes("link").href || ""}
                onChange={(e) => {
                  editor?.chain().setLink({ href: e.target.value }).run();
                }}
              />
            </Input.Wrapper>
          </Input.Root>
          <p className="text-neutral-500 text-sm">
            Add a link to the selected text.
          </p>
        </div>
      </BubbleMenuTiptap>
    </>
  );
};
