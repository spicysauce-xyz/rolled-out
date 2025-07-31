import { useCurrentEditor } from "@tiptap/react";
import { useCallback } from "react";

export const OutsideClick: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { editor } = useCurrentEditor();

  const handleClickOutside = useCallback(() => {
    if (editor?.isEditable) {
      editor?.commands.focus("end");
    }
  }, [editor]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: no need to focus on the editor on key press
    // biome-ignore lint/a11y/noStaticElementInteractions: no need to focus on the editor on key press
    <div className="flex-1" onClick={handleClickOutside}>
      {children}
    </div>
  );
};
