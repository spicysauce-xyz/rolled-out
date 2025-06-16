import { config } from "@config";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { useEffect, useRef, useState } from "react";
import type * as Y from "yjs";

export interface ConnectedPeer {
  clientId: string;
  status: "online" | "away";
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export const useHocuspocusProvider = (
  documentName: string,
):
  | { isReady: false }
  | {
      isReady: true;
      title: string;
      provider: HocuspocusProvider;
      connectedUsers: ConnectedPeer[];
      hasUnsyncedChanges: boolean;
    } => {
  const providerRef = useRef<HocuspocusProvider | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<ConnectedPeer[]>([]);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);

  useEffect(() => {
    if (providerRef.current) return;

    providerRef.current = new HocuspocusProvider({
      url: config.hocusUrl,
      name: documentName,
      onSynced: () => {
        setIsReady(true);
      },
      onAwarenessUpdate: ({ states }) => {
        setConnectedUsers(states as unknown as ConnectedPeer[]);
      },
      onUnsyncedChanges: (data) => {
        setHasUnsyncedChanges(!!data.number);
      },
    });

    return () => {
      providerRef.current?.destroy();
    };
  }, [documentName]);

  useEffect(() => {
    if (!providerRef.current) return;

    const provider = providerRef.current;

    const onVisibility = () =>
      provider.setAwarenessField("status", document.hidden ? "away" : "online");

    onVisibility();

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const handle = (doc: Y.Doc) => {
      const { default: jsonDocument } = TiptapTransformer.fromYdoc(doc);

      const title = jsonDocument?.content?.[0]?.content?.[0]?.text?.trim();

      setTitle(title ?? "");
    };

    if (providerRef.current?.document) {
      const provider = providerRef.current;
      handle(providerRef.current.document);

      const listener = (_: unknown, __: unknown, document: Y.Doc) => {
        handle(document);
      };

      provider.document.on("update", listener);

      return () => {
        provider.document.off("update", listener);
      };
    }

    return;
  }, []);

  if (!isReady) {
    return { isReady };
  }

  return {
    provider: providerRef.current as HocuspocusProvider,
    title,
    connectedUsers,
    hasUnsyncedChanges,
    isReady,
  };
};
