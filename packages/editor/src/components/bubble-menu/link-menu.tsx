import { Input, Label } from "@mono/ui";
import {
  BubbleMenu as BubbleMenuTiptap,
  type Editor,
  useCurrentEditor,
} from "@tiptap/react";
import { LinkIcon } from "lucide-react";

export const LinkMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  const shouldShowLinkMenu = (args: { editor: Editor }) => {
    if (!args.editor) {
      return false;
    }
    if (args.editor.state.selection.empty) {
      return false;
    }
    if (args.editor.isActive("link")) {
      return true;
    }
    return false;
  };

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenuTiptap
      className="bg-red-500"
      editor={editor}
      pluginKey="link-menu"
      shouldShow={shouldShowLinkMenu}
      tippyOptions={{ duration: 150, placement: "bottom" }}
    >
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: i might need to fix this */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: i might need to fix this */}
      <div
        className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Label.Root>Link</Label.Root>
        <Input.Root size="sm">
          <Input.Wrapper>
            <Input.Icon>
              <LinkIcon />
            </Input.Icon>
            <Input.Field
              onChange={(e) => {
                editor?.chain().setLink({ href: e.target.value }).run();
              }}
              value={editor?.getAttributes("link").href || ""}
            />
          </Input.Wrapper>
        </Input.Root>
        <p className="text-neutral-500 text-sm">
          Add a link to the selected text.
        </p>
      </div>
    </BubbleMenuTiptap>
  );
};
