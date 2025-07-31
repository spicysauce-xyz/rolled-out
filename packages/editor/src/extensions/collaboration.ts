import type { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";

export const collaborationExtension = (
  document: HocuspocusProvider["document"]
) =>
  Collaboration.configure({
    document,
  });
