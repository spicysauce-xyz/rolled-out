import type { HocuspocusProvider } from "@hocuspocus/provider";
import { useCallback, useEffect, useState } from "react";

const KEY = "update:tags";

export const useDocumentTagManager = (provider?: HocuspocusProvider) => {
  const [tags, setTags] = useState<Record<string, string>>({});

  useEffect(() => {
    const ydoc = provider?.document;

    if (!ydoc) return;

    const yTags = ydoc.getMap<string>("update:tags");

    setTags(yTags.toJSON());

    yTags.observe(() => setTags(yTags.toJSON()));
  }, [provider]);

  const add = useCallback(
    (tag: { id: string; label: string }) => {
      const ydoc = provider?.document;

      if (!ydoc) return;

      const yDocTags = ydoc.getMap<string>(KEY);

      ydoc.transact(() => {
        yDocTags.set(tag.id, tag.label);
      });
    },
    [provider],
  );

  const remove = useCallback(
    (tagId: string) => {
      const ydoc = provider?.document;

      if (!ydoc) return;

      const yTags = ydoc.getMap<string>(KEY);

      ydoc.transact(() => {
        yTags.delete(tagId);
      });
    },
    [provider],
  );

  return { tags: Object.entries(tags), add, remove };
};
