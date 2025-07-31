import type { HocuspocusProvider } from "@hocuspocus/provider";
import CollaborationCaret from "@tiptap/extension-collaboration-cursor";
import { renderCollaborationCaret } from "./utils";

export const collaborationCaretExtension = (
  provider: HocuspocusProvider,
  user?: { id: string; name: string; image?: string | null }
) =>
  CollaborationCaret.configure({
    provider,
    user: {
      id: user?.id,
      name: user?.name,
      image: user?.image,
    },
    render: renderCollaborationCaret,
  });
